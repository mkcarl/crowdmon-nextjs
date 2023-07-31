import { Box, Grid, Typography } from '@mui/material'
import Navbar from '@/components/Navbar'
import { AvailableVideosList } from '@/components/AvailableVideoList'
import Redis from 'ioredis'
import { configDotenv } from 'dotenv'
import { MongoClient } from 'mongodb'
import { useAuthState } from 'react-firebase-hooks/auth'
import { firebaseAuth } from '@/firebase'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import Loading from '@/components/Loading'

configDotenv()

const redisClient = new Redis(process.env.REDIS_URL!)

interface HomepageProp {
    cropStatus: Record<string, string>
}

export default function Index(props: HomepageProp) {
    const [user, loading, error] = useAuthState(firebaseAuth)
    const router = useRouter()

    useEffect(() => {
        if (!user) {
            router.push('/')
        }
    }, [user])

    if (loading || !user) {
        return <Loading />
    }

    return (
        <>
            <Navbar />
            <Box
                component={'div'}
                sx={{
                    padding: '1rem',
                }}
            >
                <Box component={'div'}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Typography variant={'h1'}>
                                Welcome back to Crowdmon!
                            </Typography>
                        </Grid>
                        <Grid item xs={0} md={2}></Grid>
                        <Grid item xs={12} md={8}>
                            <AvailableVideosList
                                cropStatus={props.cropStatus}
                            />
                        </Grid>
                        <Grid item xs={0} md={2}></Grid>
                    </Grid>
                </Box>
            </Box>
        </>
    )
}

export async function getServerSideProps() {
    let cropStatus: Record<string, string> = {}

    const dataInCache = await redisClient.exists('cropStatus')
    if (dataInCache) {
        cropStatus = await redisClient.hgetall('cropStatus')
    } else {
        const client = new MongoClient(process.env.MONGODB_URI!)
        const db = client.db('crowdmon')
        const allVideos = await db.collection('videos').find().toArray()
        const allCrops = await db.collection('crops').find().toArray()
        const cropNumberByVideo = allCrops.reduce(
            (acc, crop) => {
                if (crop.videoId in acc) {
                    acc[crop.videoId] += 1
                } else {
                    acc[crop.videoId] = 1
                }
                return acc
            },
            {} as Record<string, number>
        )
        const numberOfFramesByVideo = allVideos.reduce(
            (acc, video) => {
                acc[video.name] = video.frames.length
                return acc
            },
            {} as Record<string, number>
        )

        const cropStatus = Object.entries(cropNumberByVideo).reduce(
            (acc, [videoId, cropNumber]) => {
                acc[videoId] = `${(
                    (cropNumber / numberOfFramesByVideo[videoId]) *
                    100
                ).toFixed(2)}%`
                return acc
            },
            {} as Record<string, string>
        )

        await redisClient.hmset('cropStatus', cropStatus)
    }

    return {
        props: {
            cropStatus,
        },
    }
}
