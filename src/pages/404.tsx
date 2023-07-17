import { Box, Link, Typography } from '@mui/material'
import Image from 'next/image'

export default function Custom404() {
    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100vh',
                textAlign: 'center',
            }}
        >
            <Typography variant={'h1'}>Error 404</Typography>
            <Typography variant={'h2'} fontSize={'2rem'}>
                Sorry, we can&apos;t find the page you&apos;re looking for.
            </Typography>
            <Image
                src={
                    'https://res.cloudinary.com/dmqxgg2mj/image/upload/v1689610343/crowdmon-website-assets/w6drorzwqv281_qwv7n7.png'
                }
                alt={'paimon derp'}
                width={'500'}
                height={'500'}
            />
            <Typography variant={'body1'}>
                Click <Link href={'/'}>here</Link> to go back to main page.
            </Typography>
        </Box>
    )
}
