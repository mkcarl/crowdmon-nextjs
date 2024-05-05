import sql from '@/lib/postgres'
import { Image } from '@/types'

export const getRandomImage = async (n: number): Promise<Image[]> => {
    const images = await sql<Image[]>`
        SELECT img.*
        FROM image img
            LEFT JOIN annotation on img.image_id = annotation.image_id
        WHERE annotation.annotation_id IS NULL
        ORDER BY random()
        LIMIT ${n};
    `
    return images.flatMap((x) => x)
}

export const getAllImageCount = async (): Promise<number> => {
    const query = await sql<{ count: number }[]>`
        SELECT COUNT(*)::float as count 
        FROM image;
    `
    return query.pop()!.count
}

export const getImagePage = async (
    itemPerPage: number,
    page: number
): Promise<Image[]> => {
    const start = itemPerPage * (page - 1)

    const query = await sql<Image[]>`
        SELECT * 
        FROM image
        ORDER BY timestamp_added DESC
        OFFSET ${start}
        LIMIT ${itemPerPage}
    `

    return query.flatMap((x) => x)
}

export const insertImage = async (
    width: number,
    height: number,
    name: string,
    source: string,
    url: string
) => {
    const query = await sql`
    INSERT INTO image 
    (image_width, image_height, image_name, source, storage_url, timestamp_added)
    VALUES (${width}, ${height}, ${name}, ${source}, ${url}, floor(extract(epoch from now()) * 1000))
    `
}
