import { useRouter } from 'next/router'
import { Box, Grid, Typography } from '@mui/material'
import Navbar from '@/components/Navbar'
import { ContributionDetailsList } from '@/components/ContributionDetailsList'
import { MongoClient } from 'mongodb'
import { configDotenv } from 'dotenv'
import { GetServerSidePropsContext } from 'next'
import { auth } from '@/firebase'
import useAuth from '@/hooks/useAuth'

configDotenv()

interface PersonalContributionProps {
    doughnutData: any
    lineChartData: any
    contributionDetails: any
}

type MyQuery = {
    id: string
}

const borderColors = [
    'rgb(178, 204, 12)',
    'rgb(112, 61, 78)',
    'rgb(22, 1, 175)',
    'rgb(108, 114, 102)',
    'rgb(188, 130, 221)',
    'rgb(155, 138, 153)',
    'rgb(6, 7, 38)',
    'rgb(150, 204, 89)',
    'rgb(83, 96, 77)',
    'rgb(201, 175, 151)',
    'rgb(0, 0, 0)',
    'rgb(32, 45, 22)',
    'rgb(35, 28, 45)',
    'rgb(179, 224, 216)',
    'rgb(211, 153, 150)',
    'rgb(53, 60, 112)',
    'rgb(179, 198, 201)',
    'rgb(149, 139, 183)',
    'rgb(198, 156, 117)',
    'rgb(162, 141, 168)',
    'rgb(19, 0, 45)',
    'rgb(50, 73, 47)',
    'rgb(36, 38, 51)',
    'rgb(67, 92, 107)',
    'rgb(102, 124, 13)',
    'rgb(216, 92, 75)',
    'rgb(47, 96, 25)',
    'rgb(27, 34, 73)',
    'rgb(6, 33, 12)',
    'rgb(249, 0, 66)',
    'rgb(2, 2, 2)',
    'rgb(221, 221, 221)',
    'rgb(105, 165, 71)',
    'rgb(149, 173, 105)',
    'rgb(234, 60, 168)',
    'rgb(124, 119, 77)',
    'rgb(86, 56, 13)',
    'rgb(110, 72, 117)',
    'rgb(35, 13, 18)',
    'rgb(76, 57, 31)',
] as const

const colors = [
    'rgba(178, 204, 1,0.5)',
    'rgba(112, 61, 7,0.5)',
    'rgba(22, 1, 17,0.5)',
    'rgba(108, 114, 10,0.5)',
    'rgba(188, 130, 22,0.5)',
    'rgba(155, 138, 15,0.5)',
    'rgba(6, 7, 3,0.5)',
    'rgba(150, 204, 8,0.5)',
    'rgba(83, 96, 7,0.5)',
    'rgba(201, 175, 15,0.5)',
    'rgba(0, 0, 0,0.5)',
    'rgba(32, 45, 2,0.5)',
    'rgba(35, 28, 4,0.5)',
    'rgba(179, 224, 21,0.5)',
    'rgba(211, 153, 15,0.5)',
    'rgba(53, 60, 11,0.5)',
    'rgba(179, 198, 20,0.5)',
    'rgba(149, 139, 18,0.5)',
    'rgba(198, 156, 11,0.5)',
    'rgba(162, 141, 16,0.5)',
    'rgba(19, 0, 4,0.5)',
    'rgba(50, 73, 4,0.5)',
    'rgba(36, 38, 5,0.5)',
    'rgba(67, 92, 10,0.5)',
    'rgba(102, 124, 1,0.5)',
    'rgba(216, 92, 7,0.5)',
    'rgba(47, 96, 2,0.5)',
    'rgba(27, 34, 7,0.5)',
    'rgba(6, 33, 1,0.5)',
    'rgba(249, 0, 6,0.5)',
    'rgba(2, 2, 2 ,0.5)',
    'rgba(221, 221, 22,0.5)',
    'rgba(105, 165, 7,0.5)',
    'rgba(149, 173, 10,0.5)',
    'rgba(234, 60, 16,0.5)',
    'rgba(124, 119, 7,0.5)',
    'rgba(86, 56, 1,0.5)',
    'rgba(110, 72, 11,0.5)',
    'rgba(35, 13, 1,0.5)',
    'rgba(76, 57, 3,0.5)',
] as const

export default function PersonalContribution(props: PersonalContributionProps) {
    useAuth()
    const router = useRouter()
    const query = router.query as MyQuery

    return (
        <Box component={'div'}>
            <Navbar />
            <Box component={'div'} sx={{ padding: '1rem' }}>
                <Typography variant={'h1'}>
                    {query.id}&apos;s Contribution
                </Typography>
                <Grid container spacing={2}>
                    {/*<Grid*/}
                    {/*    item*/}
                    {/*    md={6}*/}
                    {/*    sx={{*/}
                    {/*        width: "100%",*/}
                    {/*    }}*/}
                    {/*>*/}
                    {/*    <ContributionProportion data={props.doughnutData}/>*/}

                    {/*</Grid>*/}
                    {/*<Grid*/}
                    {/*    item*/}
                    {/*    md={6}*/}
                    {/*    sx={{*/}
                    {/*        width: "100%",*/}
                    {/*    }}*/}
                    {/*>*/}
                    {/*    <ContributionHistory data={props.lineChartData}/>*/}
                    {/*</Grid>*/}
                    <Grid item xs={12}>
                        <ContributionDetailsList
                            crops={props.contributionDetails}
                        />
                    </Grid>
                </Grid>
            </Box>
        </Box>
    )
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
    const { id } = context.query

    return {
        props: {
            contributionDetails: await getUserCrops(id as string),
            // doughnutData: await getUserContributionProportion(id),
        },
    }
}

async function getUserCrops(id: string) {
    const client = new MongoClient(process.env.MONGODB_URI!)
    const db = client.db('crowdmon')
    const collection = db.collection('crops')
    const crops = await collection
        .find({
            contributorId: id,
        })
        .toArray()
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

// async function getUserContributionProportion(id: string){
//     const crops = await getUserCrops(id)
//     const accumulator: Record<string, number> = {}
//     for (const crop of crops) {
//         if (crop.video_id in accumulator) {
//             accumulator[crop.video_id] += 1
//         } else {
//             accumulator[crop.video_id] = 1
//         }
//     }
//     const length = Object.keys(accumulator).length
//     const data = {
//         labels: Object.keys(accumulator),
//         datasets: {
//             label: "Contribution Per Video",
//             backgroundColor: colors.slice(0, length),
//             borderColor: borderColors.slice(0, length),
//             data: Object.values(accumulator)
//         }
//     }
//     return data
// }
