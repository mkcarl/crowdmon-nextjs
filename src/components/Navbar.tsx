import {
    AppBar,
    IconButton,
    Link,
    Toolbar,
    Tooltip,
    Typography,
} from '@mui/material'
import Home from '@mui/icons-material/Home'
import Leaderboard from '@mui/icons-material/Leaderboard'

export default function Navbar() {
    const handleLogout = () => {
        alert('logout')
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
                {/*<Tooltip title={"Logout"}>*/}
                {/*    <IconButton onClick={handleLogout}>*/}
                {/*        <Logout sx={{ color: "primary.contrastText" }} />*/}
                {/*    </IconButton>*/}
                {/*</Tooltip>*/}
            </Toolbar>
        </AppBar>
    )
}
