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

export default function CroppingInterface() {
    const [crop, setCrop] = useState<Crop>()
    const [imageInfo, setImageInfo] = useState<ImageInfo | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [refresh, setRefresh] = useState(true)
    const imgRef = useRef<HTMLImageElement>()

    // when refresh is true, fetch new image
    useEffect(() => {
        if (refresh) {
            const fetchNewImageInfo = async () => {
                setIsLoading(true)
                // await fetch new image
                const newImg = {} as ImageInfo
                setImageInfo(newImg)
                // setIsLoading(false)
            }
            fetchNewImageInfo().catch(console.error)
        }
        setRefresh(false)
    }, [refresh])

    const handleOnSend = async () => {
        setRefresh(true)
    }
    const handleOnSkip = async () => {
        setRefresh(true)
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
                        unit: '%',
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
                                // src={imageInfo?.url}
                                src={'0.jpg'}
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
                            <Typography variant={'body2'}>
                                Source: {imageInfo?.source}
                            </Typography>
                            <Typography variant={'body2'}>
                                Video ID: {imageInfo?.videoName}
                            </Typography>
                            <Typography variant={'body2'}>
                                Image ID: {imageInfo?.imageId}
                            </Typography>
                            <Typography variant={'body2'}>
                                Image Name: {imageInfo?.imageName}
                            </Typography>
                            <Typography variant={'body2'}>
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
            </Box>
        </Paper>
    )
}
