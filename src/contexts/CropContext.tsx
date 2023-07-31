import { createContext, PropsWithChildren, useState } from 'react'
import { PercentCrop } from 'react-image-crop'
import { ImageInfo } from '@/types/crop'

interface CropContextType {
    crop: PercentCrop | null
    imageInfo: ImageInfo | null
}

export const CropContext = createContext<CropContextType>({} as CropContextType)

export default function CropContextProvider(props: PropsWithChildren) {
    const [crop, setCrop] = useState<PercentCrop | null>(null)
    const [imageInfo, setImageInfo] = useState<ImageInfo | null>(null)

    return (
        <CropContext.Provider value={{ crop, imageInfo }}>
            {props.children}
        </CropContext.Provider>
    )
}
