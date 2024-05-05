export interface CropData {
    video_id: string
    image_id: string
    annotation_class: string
    annotation_startX: number
    annotation_startY: number
    annotation_width: number
    annotation_height: number
    contributor_id: string
    timestamp: number
}

export interface Image {
    image_id: number
    image_name: string
    source: string
    storage_url: string
    image_width: number
    image_height: number
    timestamp_added: number
}
