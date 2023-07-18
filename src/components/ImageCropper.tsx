import {
    Alert,
    Box,
    Button,
    Divider,
    Grid,
    Paper,
    Skeleton,
    Typography,
} from '@mui/material'
import {
    centerCrop,
    makeAspectCrop,
    PixelCrop,
    ReactCrop,
} from 'react-image-crop'
import Redis from 'ioredis'
import { MutableRefObject, useEffect, useRef, useState } from 'react'
import 'react-image-crop/dist/ReactCrop.css'
import useEnhancedEffect from '@mui/utils/useEnhancedEffect'

interface Props {
    videoId: string
    frame: {
        name: string
        url: string
    }
    completed: boolean
    contributorId: string
    onRefresh: () => void
}
export function ImageCropper(props: Props) {
    const [refresh, setRefresh] = useState(false)
    const [crop, setCrop] = useState<PixelCrop>()
    const [completedCrop, setCompletedCrop] = useState<PixelCrop>()
    const [imageLoaded, setImageLoaded] = useState(false)
    const [dimensions, setDimensions] = useState({ width: 640, height: 360 })

    const imgRef = useRef<HTMLImageElement>()

    useEffect(() => {
        if (refresh) props.onRefresh()
    }, [refresh])

    const sendCrop = async (
        crop: PixelCrop,
        videoId: string,
        imageId: string,
        contributor: string,
        image: string
    ) => {
        await fetch('/api/crop', {
            method: 'POST',
            body: JSON.stringify({
                videoId: videoId,
                imageId: imageId,
                x: crop.x,
                y: crop.y,
                width: crop.width,
                height: crop.height,
                annotationClass: 'paimon',
                contributorId: contributor,
                timestamp: Math.floor(+new Date()),
                base64Image: image,
            }),
            headers: new Headers({
                'Content-Type': 'application/json',
                Accept: 'application/json',
            }),
        })
    }

    const sendSkipCrop = async (
        videoId: string,
        imageId: string,
        contributor: string
    ) => {
        await fetch('/api/crop', {
            method: 'POST',
            body: JSON.stringify({
                videoId: videoId,
                imageId: imageId,
                annotationClass: 'none',
                contributorId: contributor,
                timestamp: Math.floor(+new Date()),
            }),
            headers: new Headers({
                'Content-Type': 'application/json',
                Accept: 'application/json',
            }),
        })
    }

    const getCroppedImg = async (image: HTMLImageElement) => {
        try {
            const canvas = document.createElement('canvas')
            const ctx = canvas.getContext('2d')

            const centerX = image.naturalWidth / 2
            const centerY = image.naturalHeight / 2

            canvas.width = crop!.width
            canvas.height = crop!.height
            ctx!.translate(-crop!.x, -crop!.y)
            ctx!.translate(centerX, centerY)
            ctx!.translate(-centerX, -centerY)
            ctx!.drawImage(
                image,
                0,
                0,
                image.naturalWidth,
                image.naturalHeight,
                0,
                0,
                image.naturalWidth,
                image.naturalHeight
            )

            const b64 = canvas.toDataURL('image/jpeg', 1)
            return b64
        } catch (e) {
            console.log(e)
        }
    }
    const onClickCrop = async () => {
        const b64 = await getCroppedImg(imgRef.current!)

        try {
            await sendCrop(
                completedCrop!,
                props.videoId,
                props.frame.name,
                props.contributorId,
                b64!
            )
            setRefresh(true)
        } catch (e) {
            console.log('Send crop failed')
        }
    }

    const centerAspectCrop = (mediaWidth: number, mediaHeight: number) => {
        return centerCrop(
            makeAspectCrop(
                {
                    unit: 'px',
                    width: mediaWidth,
                },
                1,
                50,
                50
            ),
            mediaWidth,
            mediaHeight
        )
    }

    const onImageLoad = (e: any) => {
        const { width, height } = e.currentTarget
        setImageLoaded(true)
        setCrop(centerAspectCrop(width, height))
        setDimensions({
            width: e.target.naturalWidth,
            height: e.target.naturalHeight,
        })
        setRefresh(false)
    }

    return (
        <>
            <Paper
                elevation={12}
                sx={{
                    padding: '1rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1rem',
                }}
            >
                <Box component={'div'} textAlign={'center'}>
                    <Typography variant={'h4'}>{props.videoId}</Typography>
                </Box>
                <Divider />
                <Box
                    component={'div'}
                    hidden={!props.completed}
                    sx={{ marginBottom: '1rem' }}
                >
                    <Alert severity="success">
                        This video has been completely annotated!
                    </Alert>
                </Box>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Box
                            component={'div'}
                            sx={{
                                display: 'flex',
                                justifyContent: 'center',
                                width: '100%',
                                height: 'auto',
                            }}
                        >
                            <Box component={'div'} hidden={!props.completed}>
                                <ReactCrop onChange={() => {}} disabled>
                                    <Box
                                        component={'img'}
                                        src={
                                            'https://res.cloudinary.com/dmqxgg2mj/image/upload/v1688451174/crowdmon-website-assets/done_gpcplj.jpg'
                                        }
                                        onLoad={onImageLoad}
                                        loading={'lazy'}
                                        sx={{
                                            width: 'auto',
                                            height: 'auto',
                                            maxWidth: '1280px',
                                            maxHeight: '720px',
                                        }}
                                    />
                                </ReactCrop>
                            </Box>
                            <Box component={'div'} hidden={props.completed}>
                                <ReactCrop
                                    crop={crop}
                                    onChange={(c) => {
                                        setCrop(c)
                                    }}
                                    onComplete={(c) => setCompletedCrop(c)}
                                >
                                    <Box
                                        component={'img'}
                                        ref={imgRef}
                                        crossOrigin={'anonymous'}
                                        src={props.frame?.url}
                                        onLoad={onImageLoad}
                                        loading={'lazy'}
                                        sx={{
                                            width: 'auto',
                                            height: 'auto',
                                            maxWidth: '1280px',
                                            maxHeight: '720px',
                                        }}
                                    />
                                    <Box component={'div'} hidden={imageLoaded}>
                                        <Skeleton variant={'rectangular'} />
                                    </Box>
                                </ReactCrop>
                            </Box>
                        </Box>
                    </Grid>
                    <Grid item xs={12}>
                        <Box
                            component={'div'}
                            sx={{ display: 'flex', justifyContent: 'center' }}
                        >
                            <Typography variant={'caption'}>
                                {props.frame?.name}
                            </Typography>
                            <Box component={'div'} hidden={!!props.frame?.name}>
                                <Skeleton variant={'text'} width={'20rem'} />
                            </Box>
                        </Box>
                    </Grid>
                    <Grid item xs={12}>
                        <Box
                            component={'div'}
                            sx={{
                                display: 'flex',
                                justifyContent: 'center',
                                gap: '1rem',
                            }}
                        >
                            <Button
                                onClick={() => {
                                    sendSkipCrop(
                                        props.videoId,
                                        props.frame?.name,
                                        props.contributorId
                                    )
                                    setRefresh(true)
                                }}
                                color={'secondary'}
                                variant={'contained'}
                                disabled={props.completed || refresh}
                            >
                                skip
                            </Button>
                            <Button
                                onClick={onClickCrop}
                                color={'primary'}
                                variant={'contained'}
                                disabled={props.completed || refresh}
                            >
                                Crop
                            </Button>
                        </Box>
                    </Grid>
                </Grid>
            </Paper>
        </>
    )
}
