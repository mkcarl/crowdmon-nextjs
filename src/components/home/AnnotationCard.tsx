import { AnnotationOption } from '@/types/home'
import {
    Button,
    Card,
    CardActions,
    CardContent,
    CardMedia,
    Typography,
} from '@mui/material'
import { useRouter } from 'next/router'

export default function AnnotationCard(props: AnnotationOption) {
    const router = useRouter()
    const handleOnClick = () => {
        router.push(props.href)
    }

    return (
        <Card
            sx={{
                width: { xs: '1', md: '320px' },
            }}
        >
            <CardMedia
                sx={{ height: '200px' }}
                image={props.image}
                title={'display image'}
            />
            <CardContent>
                <Typography variant={'h5'}>{props.name}</Typography>
                <Typography variant={'body1'} color={'text.secondary'}>
                    {props.description}
                </Typography>
            </CardContent>
            <CardActions>
                <Button
                    size={'small'}
                    color={'primary'}
                    onClick={handleOnClick}
                >
                    Select
                </Button>
            </CardActions>
        </Card>
    )
}
