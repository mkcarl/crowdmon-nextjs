import { NextApiRequest, NextApiResponse } from 'next'
import { ImageInfo } from '@/types/crop'
import sql from '@/lib/postgres'

type Request = NextApiRequest
type Response = NextApiResponse<{ message: string; data: ImageInfo | null }>

export default async function handler(req: Request, res: Response) {
    if (req.method === 'GET') {
        const image = await getNonAnnotatedImage()
        res.status(200)
        if (!image) {
            res.json({ message: 'No images to annotate', data: null })
        } else {
            res.json({ message: 'OK', data: image })
        }
    }
}

async function getNonAnnotatedImage(): Promise<ImageInfo | null> {
    const images = await sql<ImageInfo[]>`
        SELECT source, url, image_name as "imageName", video_name as "videoName", image.image_id as "imageId"
        FROM image
                 LEFT JOIN annotation on image.image_id = annotation.image_id
        WHERE annotation.annotation_id IS NULL
        ORDER BY random()
        LIMIT 1;
    `
    return images.pop() ?? null
}
