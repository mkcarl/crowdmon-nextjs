import { Box, Button, Grid, Typography } from '@mui/material'
import { getAuth, GoogleAuthProvider, signInWithPopup } from '@firebase/auth'
import { useAuthState } from 'react-firebase-hooks/auth'
import { useRouter } from 'next/router'
import { firebaseApp } from '@/firebase'

export default function LandingPage() {
    const provider = new GoogleAuthProvider()
    const auth = getAuth(firebaseApp)
    const [user, loading] = useAuthState(auth)
    const router = useRouter()

    if (loading) {
        return <Box>Loading...</Box>
    }

    if (user) {
        router.push('/home')
        return <Box>Loading...</Box>
    }

    const signInWithGoogle = async () => {
        const results = await signInWithPopup(auth, provider)
        console.log(results)
    }

    return (
        <Grid container spacing={0}>
            <Grid item xs={12} sm={12} md={6}>
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        height: '100vh',
                        paddingX: '10vw',
                        justifyContent: 'center',
                        alignItems: 'flex-start',
                        userSelect: 'none',
                    }}
                    bgcolor={'primary.dark'}
                >
                    <Typography variant={'h1'}>Crowdmon</Typography>
                    <Typography variant={'h2'}>
                        crowd-sourcing for Paimon dataset
                    </Typography>
                    <Button
                        variant={'contained'}
                        color={'secondary'}
                        onClick={signInWithGoogle}
                    >
                        Get started
                    </Button>
                </Box>
            </Grid>
            <Grid
                item
                xs={0}
                sm={0}
                md={6}
                sx={{ display: { xs: 'none', sm: 'none', md: 'flex' } }}
            >
                <Box
                    component={'div'}
                    alignSelf={'flex-end'}
                    maxHeight={'100%'}
                    draggable={'false'}
                >
                    <Box
                        component={'img'}
                        src={
                            'https://res.cloudinary.com/dmqxgg2mj/image/upload/v1687704999/crowdmon-website-assets/paimon_read_c0v37u.png'
                        }
                        sx={{
                            width: 'auto',
                            maxWidth: '100%',
                            height: '100%',
                            maxHeight: '100vh',
                            transform: 'translateX(-20%)',
                            display: 'block',
                        }}
                    />
                </Box>
            </Grid>
        </Grid>
    )
}
