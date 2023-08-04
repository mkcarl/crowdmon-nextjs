import {
    AppBar,
    Chip,
    IconButton,
    Link,
    Toolbar,
    Tooltip,
    Typography,
} from '@mui/material'
import Home from '@mui/icons-material/Home'
import Leaderboard from '@mui/icons-material/Leaderboard'
import Logout from '@mui/icons-material/Logout'
import { firebaseAuth } from '@/lib/firebase'
import { useRouter } from 'next/router'
import { useAuthState, useSignOut } from 'react-firebase-hooks/auth'
import { useCookies } from 'react-cookie'
import { useEffect, useState } from 'react'

export default function Navbar() {
    const router = useRouter()
    const [signOut, loading, error] = useSignOut(firebaseAuth)
    const [user, userLoading, userError] = useAuthState(firebaseAuth)
    const [usernameCookies, _, removeUsernameCookies] = useCookies(['username'])
    const [username, setUsername] = useState('')

    useEffect(() => {
        if (user) {
            setUsername(usernameCookies.username)
        } else {
            if (!loading) {
                handleLogout()
            }
        }
    }, [user, usernameCookies])

    const handleLogout = async () => {
        await signOut()
        removeUsernameCookies('username')
        await router.push('/')
    }

    return (
        <AppBar position="static" color={'primary'} enableColorOnDark={true}>
            <Toolbar>
                <Typography
                    variant="h6"
                    component="div"
                    sx={{ flexGrow: 1, userSelect: 'none' }}
                >
                    <Link
                        href={'/'}
                        underline={'none'}
                        color={'primary.contrastText'}
                    >
                        Crowdmon
                    </Link>
                </Typography>
                <Chip variant={'filled'} label={username} color={'secondary'} />
                <Tooltip title={'Home'}>
                    <IconButton onClick={() => router.push('/home')}>
                        <Home sx={{ color: 'primary.contrastText' }} />
                    </IconButton>
                </Tooltip>
                <Tooltip title={'Contribution'}>
                    <IconButton
                        onClick={() =>
                            router.push(`/contributions/${user?.uid}`)
                        }
                    >
                        <Leaderboard sx={{ color: 'primary.contrastText' }} />
                    </IconButton>
                </Tooltip>
                <Tooltip title={'Logout'}>
                    <IconButton onClick={handleLogout}>
                        <Logout sx={{ color: 'primary.contrastText' }} />
                    </IconButton>
                </Tooltip>
            </Toolbar>
        </AppBar>
    )
}
