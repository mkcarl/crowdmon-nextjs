import {
    Box,
    Chip,
    Divider,
    List,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Paper,
    Typography,
} from '@mui/material'
import VideoLibrary from '@mui/icons-material/VideoLibrary'
import { useRouter } from 'next/router'

interface AvailableVideosListProp {
    cropStatus: Record<string, string>
}
export function AvailableVideosList(props: AvailableVideosListProp) {
    return (
        <Paper elevation={12}>
            <Box component={'div'} sx={{ padding: '1rem' }}>
                <Typography variant={'h2'} textAlign={'center'}>
                    Available videos
                </Typography>
                <Divider />
                <List>
                    {Object.keys(props.cropStatus).map((video, i) => (
                        <VideoItem
                            name={video}
                            key={video}
                            videoProgress={props.cropStatus[video]}
                        />
                    ))}
                    {/*{props.videos.map((video, i) => (*/}
                    {/*    <VideoItem name={video.title} key={video.title} videoProgress={video.progress}/>*/}
                    {/*))}*/}
                </List>
            </Box>
        </Paper>
    )
}

interface VideoItemProp {
    name: string
    videoProgress: string
}

function VideoItem(props: VideoItemProp) {
    const router = useRouter()
    const handleOnClick = () => {
        router.push(`/crop/${props.name}`)
    }
    return (
        <ListItemButton onClick={handleOnClick}>
            <ListItemIcon>
                <VideoLibrary color={'primary'} />
            </ListItemIcon>
            <ListItemText>
                <Box component={'div'} sx={{ display: 'flex' }}>
                    <Typography variant={'subtitle1'} flexGrow={1}>
                        {props.name}
                    </Typography>
                    <Chip label={props.videoProgress} />
                </Box>
            </ListItemText>
        </ListItemButton>
    )
}
