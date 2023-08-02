import { Box, Button, Grid, Typography } from '@mui/material'
import { useAuthState, useSignInWithGoogle } from 'react-firebase-hooks/auth'
import { useRouter } from 'next/router'
import { firebaseAuth, firebaseFirestore } from '@/lib/firebase'
import Loading from '@/components/Loading'
import { doc, getDoc, setDoc } from '@firebase/firestore'
import { useCookies } from 'react-cookie'

export default function LandingPage() {
    const [user, loading, userError] = useAuthState(firebaseAuth)
    const [signInWithGoogle, _, __, loginError] =
        useSignInWithGoogle(firebaseAuth)
    const router = useRouter()
    const [userCookies, setUserCookies] = useCookies(['username'])

    if (loading) {
        return <Loading />
    }

    if (user) {
        router.push('/home')
        return <Loading />
    }

    const handleOnLogin = async () => {
        const results = await signInWithGoogle()

        if (!results) return
        const docRef = doc(firebaseFirestore, 'user', results.user.uid)
        const info = await getDoc(docRef)
        const data = {
            uid: results.user.uid,
            name: results.user.displayName,
            bio: '',
        }

        if (!info.exists()) {
            await setDoc(docRef, data)
            setUserCookies('username', results.user.displayName)
        } else {
            setUserCookies('username', info.get('name'))
        }
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
                        onClick={handleOnLogin}
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
