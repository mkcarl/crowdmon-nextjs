import * as tf from '@tensorflow/tfjs'

const modelInputSize = 640
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
        640,
        0.5,
        0.5
    ) // NMS to filter boxes

    const boxes_data = boxes.gather(nms, 0).dataSync() // indexing boxes by nms index
    const scores_data = scores.gather(nms, 0).dataSync() // indexing scores by nms index
    const classes_data = classes.gather(nms, 0).dataSync() // indexing classes by nms index
    const data = []

    console.log('boxes_data', boxes_data)
    for (let i = 0; i < scores_data.length; i++) {
        const y1 = (boxes_data[i * 4] / modelInputSize) * 100 * yRatio
        const x1 = (boxes_data[i * 4 + 1] / modelInputSize) * 100 * xRatio
        const y2 = (boxes_data[i * 4 + 2] / modelInputSize) * 100 * yRatio
        const x2 = (boxes_data[i * 4 + 3] / modelInputSize) * 100 * xRatio
        console.log(x1, y1, x2, y2)
        data.push({
            crop: {
                x: x1,
                y: y1,
                width: x2 - x1,
                height: y2 - y1,
                unit: '%',
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

export { detect }
