import { ApiError } from 'next/dist/server/api-utils'
import { NextApiRequest, NextApiResponse } from 'next'

export const handleError =
    (...handlers: Function[]) =>
    async (req: NextApiRequest, res: NextApiResponse) => {
        try {
            for (const handler of handlers) {
                await handler(req, res)
            }
        } catch (error) {
            if (error instanceof ApiError) {
                return res.json({ message: error.message })
            } else {
                /// Log server errors using winston or your preferred logger
                console.error(error)
                return res.json({ message: 'Server Error', status: 500 })
            }
        }
    }
