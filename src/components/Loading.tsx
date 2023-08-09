import { Box, LinearProgress, Typography } from '@mui/material'
import Image from 'next/image'
import Link from 'next/link'

export default function Loading() {
    return (
        <Box
            sx={{
                display: 'flex',
                height: '100vh',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column',
                p: 4,
                gap: 4,
            }}
        >
            <Typography variant={'h1'} textAlign={'center'}>
                Loading
            </Typography>
            <Typography variant={'h5'} fontSize={'2rem'} textAlign={'center'}>
                Please wait a moment
            </Typography>
            <Box
                sx={{
                    width: {
                        xs: '100%',
                        md: '500px',
                    },
                    height: {
                        xs: 'auto',
                        md: '500px',
                    },
                    position: 'relative',
                    aspectRatio: '1/1',
                }}
            >
                <Image
                    src={
                        'https://res.cloudinary.com/dmqxgg2mj/image/upload/v1690792032/crowdmon-website-assets/zinidnhpeexq6mx6nz8g.png'
                    }
                    alt={'loading'}
                    fill
                    sizes={'100%'}
                />
            </Box>
            <LinearProgress sx={{ width: '70%' }} />
            <Typography paragraph>
                If this takes too long, please refresh the page or return to{' '}
                <Link href={'/'}>main page</Link>.
            </Typography>
        </Box>
    )
}
