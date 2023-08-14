import { NextPage } from 'next'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import * as tf from '@tensorflow/tfjs'

const modelInputSize = 640
const inputWidth = 640
const inputHeight = 360
const widthScale = inputWidth / modelInputSize
const heightScale = inputHeight / modelInputSize

const preprocess = (htmlImage: HTMLImageElement) => {
    let xRatio, yRatio // ratios for boxes

    const input = tf.tidy(() => {
        const img = tf.browser.fromPixels(htmlImage)

        // padding image to square => [n, m] to [n, n], n > m
        const [h, w] = img.shape.slice(0, 2) // get source width and height
        const maxSize = Math.max(w, h) // get max size
        const imgPadded = img.pad([
            [0, maxSize - h], // padding y [bottom only]
            [0, maxSize - w], // padding x [right only]
            [0, 0],
        ])

        xRatio = maxSize / w // update xRatio
        yRatio = maxSize / h // update yRatio

        return (
            tf.image
                // @ts-ignore
                .resizeBilinear(imgPadded, [modelInputSize, modelInputSize]) // resize frame
                .div(255.0) // normalize
                .expandDims(0)
        ) // add batch
    })

    return [input, xRatio, yRatio]
}

//@ts-ignore
const detect = async (
    source: HTMLImageElement,
    model: tf.GraphModel,
    callback = () => {}
) => {
    tf.engine().startScope() // start scoping tf engine
    const [input, xRatio, yRatio] = preprocess(source) // preprocess image

    const res = model.execute(input) // inference model
    const transRes = res.transpose([0, 2, 1]) // transpose result [b, det, n] => [b, n, det]
    const boxes = tf.tidy(() => {
        const w = transRes.slice([0, 0, 2], [-1, -1, 1]) // get width
        const h = transRes.slice([0, 0, 3], [-1, -1, 1]) // get height
        const x1 = tf.sub(transRes.slice([0, 0, 0], [-1, -1, 1]), tf.div(w, 2)) // x1
        const y1 = tf.sub(transRes.slice([0, 0, 1], [-1, -1, 1]), tf.div(h, 2)) // y1
        return tf
            .concat(
                [
                    y1,
                    x1,
                    tf.add(y1, h), //y2
                    tf.add(x1, w), //x2
                ],
                2
            )
            .squeeze()
    }) // process boxes [y1, x1, y2, x2]

    const [scores, classes] = tf.tidy(() => {
        // class scores
        const rawScores = transRes.slice([0, 0, 4], [-1, -1, 1]).squeeze(0) // #6 only squeeze axis 0 to handle only 1 class models
        return [rawScores.max(1), rawScores.argMax(1)]
    }) // get max scores and classes index

    const nms = await tf.image.nonMaxSuppressionAsync(
        boxes,
        scores,
        500,
        0.45,
        0.2
    ) // NMS to filter boxes

    const boxes_data = boxes.gather(nms, 0).dataSync() // indexing boxes by nms index
    const scores_data = scores.gather(nms, 0).dataSync() // indexing scores by nms index
    const classes_data = classes.gather(nms, 0).dataSync() // indexing classes by nms index

    const data = []
    for (let i = 0; i < scores_data.length; i++) {
        data.push({
            box: {
                y1: boxes_data[i * 4] * yRatio,
                x1: boxes_data[i * 4 + 1] * xRatio,
                y2: boxes_data[i * 4 + 2] * yRatio,
                x2: boxes_data[i * 4 + 3] * xRatio,
            },
            score: scores_data[i],
            class: classes_data[i],
        })
    }

    tf.dispose([res, transRes, boxes, scores, classes, nms]) // clear memory

    callback()

    tf.engine().endScope() // end of scoping
    return data
}

const Predict: NextPage = (data: any) => {
    const imgRef = useRef<HTMLImageElement>(null)
    const [model, setModel] = useState<tf.GraphModel | null>(null)
    const [modelLoading, setModelLoading] = useState<boolean>(true)

    useEffect(() => {
        const loadModel = async () => {
            const model = await tf.loadGraphModel(
                '/nano_web_model/nano-model.json'
            )
            setModel(model)
            setModelLoading(false)
        }
        loadModel()
    }, [])

    const predict = async () => {
        console.log(await detect(imgRef.current!, model!))
    }

    return (
        <>
            <h1>predict</h1>
            <h2>{modelLoading ? 'model loading' : ''}</h2>
            <Image
                src={'https://images.crowdmon.mkcarl.com/MGZIuKuXI6A/4525.jpg'}
                alt={'img'}
                width={500}
                height={500}
                ref={imgRef}
            />
            <button onClick={predict}>predict</button>
        </>
    )
}

export default Predict
