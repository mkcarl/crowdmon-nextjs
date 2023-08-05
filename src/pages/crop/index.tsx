import { Box, Typography } from '@mui/material'
import Navbar from '@/components/Navbar'
import CroppingInterface from '@/components/crop/CroppingInterface'
import { useEffect } from 'react'
import Loading from '@/components/Loading'
import { useAuthState } from 'react-firebase-hooks/auth'
import { firebaseAuth } from '@/lib/firebase'
import { useRouter } from 'next/router'
import { NextPage } from 'next'

const Crop: NextPage = () => {
    const [user, loading, error] = useAuthState(firebaseAuth)
    const router = useRouter()

    useEffect(() => {
        if (!user) {
            router.push('/')
        }
    }, [user])

    if (loading || !user) {
        return <Loading />
    }

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
            <Navbar />
            <Box
                sx={{
                    display: 'flex',
                    p: 4,
                    flexDirection: 'column',
                    alignItems: 'center',
                    flex: 1,
                }}
            >
                <Typography variant={'h1'}>Bouding Box</Typography>
                <Typography paragraph>
                    Crop Paimon out by drawing a bounding box around her! Simply
                    drag and release on the image, then click &quot;Send&quot;
                </Typography>
                <CroppingInterface />
            </Box>
        </Box>
    )
}

export default Crop
