import { NextApiResponse } from 'next'

type OkResponse<T> = {
    status: number
    message: string
    data: T
}

type FailureResponse = {
    status: number
    message: string
}

type PaginationMeta = {
    itemPerPage: number
    totalItem: number
    currentPage: number
    totalPages: number
}

type PaginationResponse<T> = {
    status: number
    message: string
    meta: PaginationMeta
    data: T[]
}

function ok<T>(res: NextApiResponse<OkResponse<T>>, data: T) {
    const response: OkResponse<T> = {
        status: 200,
        message: 'OK',
        data,
    }
    return res.status(200).json(response)
}

function okPage<T>(
    res: NextApiResponse<PaginationResponse<T>>,
    paginationMeta: PaginationMeta,
    data: T[]
) {
    const response: PaginationResponse<T> = {
        status: 200,
        message: 'OK',
        meta: paginationMeta,
        data: data,
    }
    return res.status(200).json(response)
}

function fail(res: NextApiResponse<FailureResponse>, error: string) {
    const response: FailureResponse = {
        status: 400,
        message: `Bad request [${error}]`,
    }
    return res.status(400).json(response)
}

export const ApiResponse = { ok, fail, okPage }
