import { Avatar, Box, Paper, Typography } from '@mui/material'
import { NextPage } from 'next'
import { CheckBox } from '@mui/icons-material'

type Props = { value: number | string; subtitle: string; icon: null }

const SingleStatPanel: NextPage<Props> = (props) => {
    return (
        <Box sx={{ width: '100%' }}>
            <Paper
                elevation={6}
                sx={{
                    bgcolor: 'secondary.main',
                    color: 'secondary.contrastText',
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: '100%',
                        width: '100%',
                        p: 6,
                    }}
                >
                    <Typography variant={'h1'} component={'p'}>
                        {props.value}
                    </Typography>
                    <Typography variant={'subtitle1'}>
                        {props.subtitle}
                    </Typography>
                </Box>
            </Paper>
        </Box>
    )
}
export default SingleStatPanel
