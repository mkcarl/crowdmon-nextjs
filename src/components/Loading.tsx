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
            <Typography variant={'h1'}>Loading</Typography>
            <Typography variant={'h5'} fontSize={'2rem'}>
                Please wait a moment
            </Typography>
            <Image
                src={
                    'https://res.cloudinary.com/dmqxgg2mj/image/upload/v1690792032/crowdmon-website-assets/zinidnhpeexq6mx6nz8g.png'
                }
                alt={'loading'}
                width={'500'}
                height={'500'}
            />
            <LinearProgress sx={{ width: '70%' }} />
            <Typography paragraph>
                If this takes too long, please refresh the page or return to{' '}
                <Link href={'/'}>main page</Link>.
            </Typography>
        </Box>
    )
}
