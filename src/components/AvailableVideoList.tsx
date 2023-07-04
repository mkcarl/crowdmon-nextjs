import {
    Box,
    Chip,
    CircularProgress,
    Divider,
    List,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Paper,
    Typography,
} from "@mui/material";
import VideoLibrary from "@mui/icons-material/VideoLibrary";
import { useEffect, useState } from "react";


interface AvailableVideosListProp {
    cropStatus: Record<string, string>;
}
export function AvailableVideosList(props:AvailableVideosListProp) {

    return (
        <Paper elevation={12}>
            <Box component={"div"} sx={{ padding: "1rem" }}>
                <Typography variant={"h2"} textAlign={"center"}>
                    Available videos
                </Typography>
                <Divider />
                <List>
                    {Object.keys(props.cropStatus).map((video, i) => (
                        <VideoItem name={video} key={video} videoProgress={props.cropStatus[video]}/>
                    ))}
                    {/*{props.videos.map((video, i) => (*/}
                    {/*    <VideoItem name={video.title} key={video.title} videoProgress={video.progress}/>*/}
                    {/*))}*/}
                </List>
            </Box>
        </Paper>
    );
}

interface VideoItemProp {
    name: string;
    videoProgress: string;
}

function VideoItem(props: VideoItemProp) {


    return (
        <ListItemButton href={`/crop/${props.name}`}>
            <ListItemIcon>
                <VideoLibrary color={"primary"} />
            </ListItemIcon>
            <ListItemText>
                <Box component={"div"} sx={{ display: "flex" }}>
                    <Typography variant={"subtitle1"} flexGrow={1}>
                        {props.name}
                    </Typography>
                    <Chip
                        label={props.videoProgress}
                    />
                </Box>
            </ListItemText>
        </ListItemButton>
    );
}
