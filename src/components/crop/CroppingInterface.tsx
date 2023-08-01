import 'react-image-crop/dist/ReactCrop.css'
import { useEffect, useRef, useState } from 'react'
import {
    centerCrop,
    Crop,
    makeAspectCrop,
    PercentCrop,
    ReactCrop,
} from 'react-image-crop'
import { ImageInfo } from '@/types/crop'
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Box,
    Button,
    Divider,
    Paper,
    Skeleton,
    Typography,
} from '@mui/material'
import { ExpandMore } from '@mui/icons-material'
import _ from 'lodash'

export default function CroppingInterface() {
    const [crop, setCrop] = useState<Crop>()
    const [imageInfo, setImageInfo] = useState<ImageInfo | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [refresh, setRefresh] = useState(true)
    const imgRef = useRef<HTMLImageElement>()
    const [cropInfoDisplay, setCropInfoDisplay] = useState<Crop>({
        unit: 'px',
        width: NaN,
        height: NaN,
        x: NaN,
        y: NaN,
    })

    // when refresh is true, fetch new image
    useEffect(() => {
        if (refresh) {
            const fetchNewImageInfo = async () => {
                setIsLoading(true)
                // await fetch new image
                const newImg = (await (await fetch(`/api/randomImage`)).json())
                    .data as ImageInfo
                setImageInfo(newImg)
                // setIsLoading(false)
            }
            fetchNewImageInfo().catch(console.error)
        }
        setRefresh(false)
    }, [refresh])

    useEffect(() => {
        if (crop) {
            const cropX = crop.x ?? NaN
            const cropY = crop.y ?? NaN
            const cropWidth = crop.width ?? NaN
            const cropHeight = crop.height ?? NaN
            const width = imgRef.current?.width ?? NaN
            const height = imgRef.current?.height ?? NaN

            setCropInfoDisplay({
                unit: 'px',
                width: _.round((cropWidth * width) / 100, 2),
                height: _.round((cropHeight * height) / 100, 2),
                x: _.round((cropX * width) / 100, 2),
                y: _.round((cropY * height) / 100, 2),
            })
        }
    }, [crop])

    const handleOnSend = async () => {
        setRefresh(true)
        if (imageInfo && crop) {
            await submitCrop(crop, 1, imageInfo.imageId) //TODO: change to real annotator id
        } else {
            console.error('imageInfo or crop is null')
        }
    }
    const handleOnSkip = async () => {
        setRefresh(true)
        if (imageInfo) {
            await submitCrop(null, 1, imageInfo?.imageId) //TODO: change to real annotator id
        } else {
            console.error('imageInfo is null')
        }
    }

    const submitCrop = async (
        crop: Crop | null,
        annotatorId: number,
        imageId: number
    ) => {
        await fetch('/api/cropv2', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                imageId: imageId,
                annotatorId: 1, //TODO: change to real annotator id
                x: crop?.x ?? null,
                y: crop?.y ?? null,
                width: crop?.width ?? null,
                height: crop?.height ?? null,
            }),
        })
    }

    const handleOnCropChange = (crop: Crop, percentageCrop: PercentCrop) => {
        setCrop(percentageCrop)
    }

    const handleOnImageLoad = () => {
        if (!imgRef.current) return
        setCrop(
            // set crop to center
            centerCrop(
                makeAspectCrop(
                    {
                        unit: 'px',
                        width: imgRef.current?.width,
                    },
                    1,
                    50,
                    50
                ),
                imgRef.current?.width,
                imgRef.current?.height
            )
        )
        setIsLoading(false)
    }

    return (
        <Paper
            sx={{
                display: 'flex',
                flexDirection: 'column',
                width: '100%',
                maxWidth: 720,
                p: 4,
                gap: 2,
            }}
        >
            <Box sx={{ display: 'flex' }}>
                <Box hidden={!isLoading} sx={{ flex: 1 }}>
                    <Skeleton
                        variant={'rectangular'}
                        sx={{
                            width: '100%', // Use percentage width to make it adjust to parent
                            paddingTop: '56.25%', // 16:9 aspect ratio (56.25% = 9 / 16 * 100)
                        }}
                    ></Skeleton>
                </Box>
                <Box hidden={isLoading} sx={{ flex: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                        <ReactCrop crop={crop} onChange={handleOnCropChange}>
                            <Box
                                component={'img'}
                                src={imageInfo?.url}
                                onLoad={handleOnImageLoad}
                                sx={{ width: 'auto', height: 'auto' }}
                                ref={imgRef}
                            />
                        </ReactCrop>
                    </Box>
                </Box>
            </Box>
            <Box
                sx={{
                    display: 'flex',
                    width: '100%',
                    justifyContent: 'center',
                    gap: 4,
                }}
            >
                <Button
                    variant={'contained'}
                    color={'secondary'}
                    disabled={isLoading}
                    onClick={handleOnSkip}
                >
                    Skip
                </Button>
                <Button
                    variant={'contained'}
                    color={'primary'}
                    disabled={isLoading}
                    onClick={handleOnSend}
                >
                    Send
                </Button>
            </Box>
            <Divider sx={{ width: '100%' }} />
            <Box id={'image-detail'} sx={{ width: '100%' }}>
                <Accordion>
                    <AccordionSummary expandIcon={<ExpandMore />} id="panel">
                        <Typography variant={'h6'}>Image details</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Box hidden={isLoading}>
                            <Typography variant={'body1'}>
                                Source: {imageInfo?.source}
                            </Typography>
                            <Typography variant={'body1'}>
                                Video ID: {imageInfo?.videoName}
                            </Typography>
                            <Typography variant={'body1'}>
                                Image ID: {imageInfo?.imageId}
                            </Typography>
                            <Typography variant={'body1'}>
                                Image Name: {imageInfo?.imageName}
                            </Typography>
                            <Typography variant={'body1'}>
                                Image URL: {imageInfo?.url}
                            </Typography>
                        </Box>
                        <Box hidden={!isLoading}>
                            <Skeleton variant={'text'} />
                            <Skeleton variant={'text'} />
                            <Skeleton variant={'text'} />
                            <Skeleton variant={'text'} />
                            <Skeleton variant={'text'} />
                        </Box>
                    </AccordionDetails>
                </Accordion>
                <Accordion>
                    <AccordionSummary
                        expandIcon={<ExpandMore />}
                        id="crop-panel"
                    >
                        <Typography variant={'h6'}>Crop details</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Box hidden={isLoading}>
                            <Typography variant={'body1'}>
                                {`x: ${cropInfoDisplay.x}${cropInfoDisplay.unit}`}
                            </Typography>
                            <Typography variant={'body1'}>
                                {`y: ${cropInfoDisplay.y}${cropInfoDisplay.unit}`}
                            </Typography>
                            <Typography variant={'body1'}>
                                {`width: ${cropInfoDisplay.width}${cropInfoDisplay.unit}`}
                            </Typography>
                            <Typography variant={'body1'}>
                                {`height: ${cropInfoDisplay.height}${cropInfoDisplay.unit}`}
                            </Typography>
                        </Box>
                        <Box hidden={!isLoading}>
                            <Skeleton variant={'text'} />
                            <Skeleton variant={'text'} />
                            <Skeleton variant={'text'} />
                            <Skeleton variant={'text'} />
                        </Box>
                    </AccordionDetails>
                </Accordion>
            </Box>
        </Paper>
    )
}
