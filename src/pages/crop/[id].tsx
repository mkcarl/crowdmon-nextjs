import Navbar from "@/components/Navbar";
import {cookies} from "next/headers";
import {Box, Grid, Typography} from "@mui/material";
import {ImageCropper} from "@/components/ImageCropper";
import Redis from "ioredis";
import {configDotenv} from "dotenv";
import {MongoClient} from "mongodb";
import {useRouter} from "next/router";
import _ from "lodash";
configDotenv()

interface Props{
    videoId: string;
    frame: {
        name: string,
        url: string
    },
    completed: boolean,
    contributorId: 'nextjs'
}

export default function Crop(props: Props){
    const router = useRouter();
    return (
        <Box component={"div"}>
            <Navbar />
            <Box component={"div"} sx={{ padding: "1rem" }}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Typography variant={"h1"}>Paimon cropping</Typography>
                        <Typography variant={"subtitle1"}>
                            Select the area that contains Paimon, then click
                            &quot;Crop&quot;. If Paimon is not in the image, click &quot;Skip&quot;.
                        </Typography>
                    </Grid>
                    <Grid item xs={0} md={3}></Grid>
                    <Grid item xs={12} md={6}>
                        <Box component={"div"}>
                            <ImageCropper
                                videoId={props.videoId}
                                frame={props.frame}
                                completed={props.completed}
                                contributorId={props.contributorId}
                                onRefresh={()=>{
                                    router.replace(router.asPath);
                                }
                                }
                            />
                        </Box>
                    </Grid>
                    <Grid item xs={0} md={3}></Grid>
                </Grid>
            </Box>
        </Box>
    )
}
export async function getServerSideProps(context:any){
    const {id} = context.query;

    const redis = new Redis(process.env.REDIS_URL!);
    const dataInCache = await redis.exists(`frameList:${id}`)
    if (!dataInCache){
        const mongoClient = new MongoClient(process.env.MONGODB_URI!);
        const db = mongoClient.db('crowdmon');
        const video = await db.collection('videos').findOne({name: id});
        if (!video){
            context.res.statusCode = 404;
            return {

            }
        }
        for (const frame of _.shuffle(video.frames)) {
            await redis.rpush(`frameList:${id}`, JSON.stringify(frame));
        }
    }
    const frame = JSON.parse((await redis.lpop(`frameList:${id}`))!);
    return {
        props: {
            frame,
            completed: !frame,
            videoId: id,
            contributorId: 'nextjs'
        }
    }
}
