import { handleError } from '@/util/middlewares'
import { ApiResponse } from '@/util/apiResponse'
import { NextApiRequest, NextApiResponse } from 'next'
import {
    getAllImageCount,
    getImagePage,
    insertImage,
} from '@/service/ImageService'
import { Image } from '@/types'
import { isValidBody } from '@/util/apiRequest'

interface Request extends NextApiRequest {
    query: {
        itemPerPage: string
        page: string
    }
    body: {
        width: number
        height: number
        name: string
        source: string
        url: string
    }
}

async function handler(req: Request, res: NextApiResponse) {
    switch (req.method) {
        case 'GET':
            const itemPerPage = +req.query.itemPerPage || 20
            const page = +req.query.page || 1

            if (itemPerPage < 0 || page < 0) {
                ApiResponse.fail(res, 'Bad param')
            }

            const totalItem = await getAllImageCount()
            const totalPages = Math.ceil(totalItem / itemPerPage)
            const data = await getImagePage(itemPerPage, page)

            ApiResponse.okPage<Image>(
                res,
                { itemPerPage, currentPage: page, totalItem, totalPages },
                data
            )

            break
        case 'POST':
            if (
                !isValidBody(req.body, [
                    'width',
                    'height',
                    'name',
                    'source',
                    'url',
                ])
            ) {
                ApiResponse.fail(res, 'Invalid Body')
            }

            const { width, height, name, source, url } = req.body

            await insertImage(width, height, name, source, url)
            return ApiResponse.ok(res, undefined)
            break
        default:
            ApiResponse.fail(res, `Invalid method ${req.method?.toUpperCase()}`)
            break
    }
}

export default handleError(handler)
