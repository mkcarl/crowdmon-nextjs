import {
    Avatar,
    Box,
    Grid,
    List,
    ListItemAvatar,
    ListItemButton,
    ListItemText,
    Typography,
} from '@mui/material'
import Navbar from '@/components/Navbar'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { GetStaticProps } from 'next'
import Link from 'next/link'
import { MongoClient } from 'mongodb'
import useAuth from '@/hooks/useAuth'

dayjs.extend(relativeTime)

async function getAllCrops() {
    const client = new MongoClient(process.env.MONGODB_URI!)
    const db = client.db('crowdmon')
    const collection = db.collection('crops')
    const crops = await collection.find().toArray()
    const cropsIntoCorrectFormat = crops.map((crop) => {
        return {
            video_id: crop.videoId,
            image_id: crop.imageId,
            annotation_class: crop.annotationClass,
            annotation_startX: crop.annotationStartX,
            annotation_startY: crop.annotationStartY,
            annotation_width: crop.annotationWidth,
            annotation_height: crop.annotationHeight,
            contributor_id: crop.contributorId,
            timestamp: crop.timestamp,
        }
    })
    return cropsIntoCorrectFormat
}

export const getStaticProps: GetStaticProps<ContributionPageProps> = async (
    context
) => {
    const crops = await getAllCrops()
    const accumulator: Record<
        string,
        { contribution: number; lastContribution: number }
    > = {}

    for (const crop of crops) {
        if (crop.contributor_id in accumulator) {
            accumulator[crop.contributor_id].contribution += 1
            accumulator[crop.contributor_id].lastContribution = Math.max(
                accumulator[crop.contributor_id].lastContribution,
                crop.timestamp
            )
        } else {
            accumulator[crop.contributor_id] = {
                contribution: 1,
                lastContribution: crop.timestamp,
            }
        }
    }

    const contribs = Object.entries(accumulator).map(([key, value]) => {
        return {
            contributor_id: key,
            contribution: value.contribution,
            lastContribution: value.lastContribution,
        }
    })

    return {
        props: {
            contributions: contribs,
        },
        revalidate: 10,
    }
}

interface ContributionPageProps {
    contributions: Array<{
        contributor_id: string
        contribution: number
        lastContribution: number
    }>
}

export default function ContributionsPage(props: ContributionPageProps) {
    useAuth()

    return (
        <Box component={'div'}>
            <Navbar />
            <Box component={'div'} sx={{ padding: '1rem' }}>
                <Typography variant={'h1'}>Contribution Leaderboard</Typography>
                <Grid container>
                    <Grid item xs={0} md={3}></Grid>
                    <Grid item xs={12} md={6}>
                        <List>
                            {Object.entries(props.contributions).map(
                                ([key, value]) => {
                                    return (
                                        <Contributions
                                            name={value.contributor_id}
                                            contributions={value.contribution}
                                            lastContribution={
                                                value.lastContribution
                                            }
                                            key={key}
                                        />
                                    )
                                }
                            )}
                        </List>
                    </Grid>
                    <Grid item xs={0} md={3}></Grid>
                </Grid>
            </Box>
        </Box>
    )
}

interface ContributionProps {
    name: string
    contributions: number
    lastContribution: number
}

function Contributions(props: ContributionProps) {
    return (
        <ListItemButton component={Link} href={`/contributions/${props.name}`}>
            <ListItemAvatar>
                <Avatar variant={'circular'}>A</Avatar>
            </ListItemAvatar>
            <ListItemText
                primary={props.name}
                secondary={`Latest contribution : ${dayjs(
                    props.lastContribution
                ).fromNow()}`}
            />
            <ListItemText
                primary={props.contributions}
                sx={{ textAlign: 'right' }}
            />
        </ListItemButton>
    )
}
