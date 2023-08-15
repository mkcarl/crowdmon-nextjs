import 'react-image-crop/dist/ReactCrop.css'
import { FC, PropsWithChildren, useEffect, useRef, useState } from 'react'
import {
    centerCrop,
    convertToPercentCrop,
    convertToPixelCrop,
    Crop,
    makeAspectCrop,
    PercentCrop,
    PixelCrop,
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
    FormControlLabel,
    Paper,
    Skeleton,
    Snackbar,
    Switch,
    Typography,
} from '@mui/material'
import { ExpandMore } from '@mui/icons-material'
import _ from 'lodash'
import { useAuthState } from 'react-firebase-hooks/auth'
import { firebaseAuth } from '@/lib/firebase'
import { ScriptProps } from 'next/script'
import * as tf from '@tensorflow/tfjs'
import Image from 'next/image'
import { detect } from '@/lib/prediction'

export default function CroppingInterface() {
    const [model, setModel] = useState<tf.GraphModel>()
    const [modelLoaded, setModelLoaded] = useState(true)
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
    const [user, userLoading, userError] = useAuthState(firebaseAuth)
    const [snackbarOpen, setSnackbarOpen] = useState(false)
    const [snackbarMessage, setSnackbarMessage] = useState('')
    const [modelProcessing, setModelProcessing] = useState(false)
    const [aiEnabled, setAiEnabled] = useState(false)

    useEffect(() => {
        const loadModel = async () => {
            const model = (await tf.loadGraphModel(
                'https://mkcarl.github.io/crowdmon-yolov8-models/nano/model.json'
            )) as tf.GraphModel
            setModel(model)
        }
        loadModel().catch(console.error)
    }, [])

    useEffect(() => {
        setModelLoaded(!!model)
    }, [model])

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

    useEffect(() => {
        if (aiEnabled) {
            handleOnPredict()
        }
    }, [aiEnabled])

    const handleOnSend = async () => {
        setRefresh(true)
        if (imageInfo && crop) {
            await submitCrop(crop, imageInfo.imageId)
        } else {
            console.error('imageInfo or crop is null')
        }
    }
    const handleOnSkip = async () => {
        setRefresh(true)
        if (imageInfo) {
            await submitCrop(null, imageInfo?.imageId)
        } else {
            console.error('imageInfo is null')
        }
    }

    const submitCrop = async (crop: Crop | null, imageId: number) => {
        await fetch('/api/cropv2', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + (await user?.getIdToken()),
            },
            body: JSON.stringify({
                imageId: imageId,
                annotatorId: user?.uid ?? null,
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
                        unit: '%',
                        height: 30,
                    },
                    1,
                    imgRef.current?.width,
                    imgRef.current?.height
                ),
                imgRef.current?.width,
                imgRef.current?.height
            )
        )
        setIsLoading(false)
        if (aiEnabled) {
            handleOnPredict()
        }
    }

    const handleOnPredict = async () => {
        setModelProcessing(true)
        if (!model) return
        const data = await detect(imgRef.current!, model)
        const paimon = data.pop()
        setModelProcessing(false)
        if (!paimon) {
            setSnackbarMessage('No Paimon detected!')
            setSnackbarOpen(true)
            return
        }
        setCrop(paimon.crop as Crop)
        setSnackbarMessage('Paimon!')
        setSnackbarOpen(true)
    }

    const handleOnAiToggle = () => {
        setAiEnabled(!aiEnabled)
    }

    interface DisplayInfoProps {
        title: string
        info: string
        color: string
    }
    const DisplayInfo: FC<Partial<DisplayInfoProps>> = (props) => {
        return (
            <>
                <Box component={'span'} fontWeight={'bold'} color={props.color}>
                    {props.title}:{' '}
                </Box>
                {props.info}
            </>
        )
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
            <Box sx={{ display: 'flex', aspectRatio: '16/9' }}>
                <Box hidden={!isLoading} sx={{ flex: 1 }}>
                    <Skeleton
                        variant={'rectangular'}
                        sx={{
                            width: '100%', // Use percentage width to make it adjust to parent
                            height: '100%',
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
                                crossOrigin={'anonymous'}
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
                    flexWrap: 'wrap',
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
                <FormControlLabel
                    control={
                        <Switch
                            checked={aiEnabled}
                            onChange={handleOnAiToggle}
                        />
                    }
                    label="AI detection"
                />
            </Box>
            <Divider sx={{ width: '100%' }} />
            <Box id={'image-detail'} sx={{ width: '100%' }}>
                <Accordion>
                    <AccordionSummary expandIcon={<ExpandMore />} id="panel">
                        <Typography variant={'h6'}>Image details</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Box hidden={isLoading}>
                            <Typography
                                variant={'body1'}
                                sx={{ wordWrap: 'break-word' }}
                            >
                                <DisplayInfo
                                    title={'Source'}
                                    info={imageInfo?.source}
                                    color={'primary.light'}
                                />
                            </Typography>
                            <Typography
                                variant={'body1'}
                                sx={{ wordWrap: 'break-word' }}
                            >
                                <DisplayInfo
                                    title={'Video ID'}
                                    info={imageInfo?.videoName}
                                    color={'primary.light'}
                                />
                            </Typography>
                            <Typography
                                variant={'body1'}
                                sx={{ wordWrap: 'break-word' }}
                            >
                                <DisplayInfo
                                    title={'Image ID'}
                                    info={imageInfo?.imageId.toString()}
                                    color={'primary.light'}
                                />
                            </Typography>
                            <Typography
                                variant={'body1'}
                                sx={{ wordWrap: 'break-word' }}
                            >
                                <DisplayInfo
                                    title={'Image name'}
                                    info={imageInfo?.imageName}
                                    color={'primary.light'}
                                />
                            </Typography>
                            <Typography
                                variant={'body1'}
                                sx={{ wordWrap: 'break-word' }}
                            >
                                <DisplayInfo
                                    title={'URL'}
                                    info={imageInfo?.url}
                                    color={'primary.light'}
                                />
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
                                <DisplayInfo
                                    title={'x'}
                                    info={`${cropInfoDisplay.x}${cropInfoDisplay.unit}`}
                                    color={'secondary.light'}
                                />
                            </Typography>
                            <Typography variant={'body1'}>
                                <DisplayInfo
                                    title={'y'}
                                    info={`${cropInfoDisplay.y}${cropInfoDisplay.unit}`}
                                    color={'secondary.light'}
                                />
                            </Typography>
                            <Typography variant={'body1'}>
                                <DisplayInfo
                                    title={'width'}
                                    info={`${cropInfoDisplay.width}${cropInfoDisplay.unit}`}
                                    color={'secondary.light'}
                                />
                            </Typography>
                            <Typography variant={'body1'}>
                                <DisplayInfo
                                    title={'height'}
                                    info={`${cropInfoDisplay.height}${cropInfoDisplay.unit}`}
                                    color={'secondary.light'}
                                />
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
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={1000}
                onClose={(event) => setSnackbarOpen(false)}
                message={snackbarMessage}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
            />
        </Paper>
    )
}
