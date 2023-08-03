import { Box, Typography } from '@mui/material'
import Navbar from '@/components/Navbar'
import Grid from '@mui/system/Unstable_Grid'
import { Container } from '@mui/material'
import { useCookies } from 'react-cookie'
import SingleStatPanel from '@/components/dashboard/SingleStatPanel'

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
                    <Grid xs={3}>
                        <SingleStatPanel
                            value={123}
                            subtitle={'days logged in'}
                            icon={null}
                        />
                    </Grid>
                    <Grid xs={3}>
                        <SingleStatPanel
                            value={1111}
                            subtitle={'total contributions'}
                            icon={null}
                        />
                    </Grid>
                    <Grid xs={3}>
                        <SingleStatPanel
                            value={'#1'}
                            subtitle={'top contributor'}
                            icon={null}
                        />
                    </Grid>
                    <Grid xs={3}>
                        <SingleStatPanel
                            value={'30%'}
                            subtitle={'overall contribution'}
                            icon={null}
                        />
                    </Grid>
                </Grid>
            </Box>
        </Box>
    )
}
