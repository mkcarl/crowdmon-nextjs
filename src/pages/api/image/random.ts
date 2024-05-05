import { NextApiRequest, NextApiResponse } from 'next'
import { ApiResponse } from '@/util/apiResponse'
import { getRandomImage } from '@/service/ImageService'
import { handleError } from '@/util/middlewares'

interface Request extends NextApiRequest {
    query: {
        count: string
    }
}

async function handler(req: Request, res: NextApiResponse) {
    switch (req.method) {
        case 'GET':
            const count = +req.query.count ?? 1

            if (count <= 0) {
                ApiResponse.fail(res, 'count cannot be zero or negative value')
            }
            if (count > 20) {
                ApiResponse.fail(res, 'count cannot be greater than 20')
            }

            const images = await getRandomImage(count)
            ApiResponse.ok(res, images)
            break
        default:
            ApiResponse.fail(res, `Invalid method ${req.method?.toUpperCase()}`)
            break
    }
}

export default handleError(handler)
