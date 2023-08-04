import { Box, Typography } from '@mui/material'
import Navbar from '@/components/Navbar'
import Grid from '@mui/system/Unstable_Grid'
import { Container } from '@mui/material'
import { useCookies } from 'react-cookie'
import SingleStatPanel from '@/components/dashboard/SingleStatPanel'
import {
    FunctionsOutlined,
    LeaderboardOutlined,
    LoginOutlined,
    PercentOutlined,
} from '@mui/icons-material'
import SingleStatWithImagePanel from '@/components/dashboard/SingleStatWithImagePanel'

export default function ContributionsPage() {
    const [cookie] = useCookies(['username'])

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Navbar />
            <Box sx={{ width: '100vw', flex: 1, p: 4 }}>
                <Container>
                    <Typography variant={'h1'}>
                        {'username'}&apos;s Contributions
                    </Typography>
                </Container>
                <Grid container spacing={3}>
                    <Grid xs={12} md={6} lg={3}>
                        <SingleStatWithImagePanel
                            value={123}
                            subtitle={'days logged in'}
                            url={
                                'https://res.cloudinary.com/dmqxgg2mj/image/upload/v1691120500/crowdmon-website-assets/f6d9vwyjtbvqjhyll5yx.png'
                            }
                        />
                    </Grid>
                    <Grid xs={12} md={6} lg={3}>
                        <SingleStatWithImagePanel
                            value={1111}
                            subtitle={'total contributions'}
                            url={
                                'https://res.cloudinary.com/dmqxgg2mj/image/upload/v1691122210/crowdmon-website-assets/zytomni6waus6vezkip9.png'
                            }
                        />
                    </Grid>
                    <Grid xs={12} md={6} lg={3}>
                        <SingleStatWithImagePanel
                            value={'#1'}
                            subtitle={'top contributor'}
                            url={
                                'https://res.cloudinary.com/dmqxgg2mj/image/upload/v1691122746/crowdmon-website-assets/bqwjb4xc6ccuhf4hjfqi.png'
                            }
                        />
                    </Grid>
                    <Grid xs={12} md={6} lg={3}>
                        <SingleStatWithImagePanel
                            value={'30%'}
                            subtitle={'overall contribution'}
                            url={
                                'https://res.cloudinary.com/dmqxgg2mj/image/upload/v1691125914/crowdmon-website-assets/fcgfwxuzounnme7bncmf.png'
                            }
                        />
                    </Grid>
                </Grid>
            </Box>
        </Box>
    )
}
