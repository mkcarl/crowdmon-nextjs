import { AnnotationOption } from '@/types/home'
import {
    Button,
    Card,
    CardActions,
    CardContent,
    CardMedia,
    Typography,
} from '@mui/material'

export default function AnnotationCard(props: AnnotationOption) {
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
                <Button size={'small'} color={'primary'} href={props.href}>
                    Select
                </Button>
            </CardActions>
        </Card>
    )
}
