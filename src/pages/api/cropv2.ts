import { NextApiRequest, NextApiResponse } from 'next'
import sql from '@/lib/postgres'
import dayjs from 'dayjs'
import { Annotation } from '@/types/db'

interface Request extends NextApiRequest {
    body: {
        imageId: number
        x?: number
        y?: number
        width?: number
        height?: number
    }
}

type Response = NextApiResponse<{ message: string }>

export default async function handler(req: Request, res: Response) {
    if (req.method === 'POST') {
        let annotationId = await getAnnotation(req.body.imageId)
        if (!annotationId) {
            annotationId = await newAnnotation(req.body.imageId, 1) // TODO : change to actual annotator id
        }
        if (annotationId) {
            if (req.body.x && req.body.y && req.body.width && req.body.height) {
                // if there are detections
                await newCrop(
                    req.body.x,
                    req.body.y,
                    req.body.width,
                    req.body.height,
                    annotationId
                )
            } else {
                await newCrop(null, null, null, null, annotationId)
            }
            res.status(200)
            res.json({ message: 'OK' })
        } else {
            res.status(400)
            res.json({ message: 'Failed to create new annotation' })
        }
    }
}

async function getAnnotation(imageId: number) {
    const annotations = await sql<Partial<Annotation>[]>`
        SELECT annotation_id
        FROM annotation
        WHERE image_id = ${imageId}
`
    return annotations.pop()?.annotation_id ?? null
}

async function newAnnotation(imageId: number, annotatorId: number) {
    type QueryResults = { annotationId: number }[]
    const annotationId = await sql<QueryResults>`
            INSERT INTO annotation (image_id, annotator_id, seen, valid, timestamp)
            values (${imageId}, ${annotatorId}, false, false, ${dayjs().unix()})
            RETURNING annotation_id as "annotationId";
        `
    return annotationId.pop()?.annotationId ?? null
}

async function newCrop(
    x: number | null,
    y: number | null,
    width: number | null,
    height: number | null,
    annotationId: number
) {
    if (!!x && !!y && !!width && !!height) {
        await sql`
            INSERT INTO crop (subject, start_x, start_y, width, height, annotation_id)
            VALUES ('paimon', ${x}, ${y}, ${width}, ${height}, ${annotationId})
        `
    }
}
