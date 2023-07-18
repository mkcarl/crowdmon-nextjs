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
import { getAuth, signOut } from '@firebase/auth'
import { firebaseApp } from '@/firebase'
import { useRouter } from 'next/router'
import { useAuthState } from 'react-firebase-hooks/auth'

export default function Navbar() {
    const router = useRouter()
    const firebaseAuth = getAuth(firebaseApp)
    const handleLogout = async () => {
        await signOut(firebaseAuth)
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
                <Chip
                    variant={'filled'}
                    label={firebaseAuth.currentUser?.displayName}
                    color={'secondary'}
                />
                <Tooltip title={'Home'}>
                    <IconButton href={'/home'}>
                        <Home sx={{ color: 'primary.contrastText' }} />
                    </IconButton>
                </Tooltip>
                <Tooltip title={'Contribution'}>
                    <IconButton href={'/contributions'}>
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
