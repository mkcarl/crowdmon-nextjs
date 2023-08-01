export type Image = {
    image_id: number
    image_name: string
    video_name: string | null
    source: string
    url: string
}

export type Annotation = {
    annotation_id: number
    image_id: number
    annotator_id: number
    timestamp: number
    seen: boolean
    valid: boolean
}

export type AnnotatorUser = {
    user_id: number
    username: string
    image_url: string | null
}

export type Crop = {
    subject: string
    start_x: number | null
    start_y: number | null
    width: number | null
    height: number | null
}
