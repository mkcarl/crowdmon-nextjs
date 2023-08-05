import { Avatar, Box, Paper, Typography } from '@mui/material'
import { NextPage } from 'next'
import { CheckBox, FileOpen, FileOpenOutlined } from '@mui/icons-material'

type Props = { value: number | string; subtitle: string; icon: any }

const SingleStatPanel: NextPage<Props> = (props) => {
    return (
        <Box sx={{ width: '100%' }}>
            <Paper elevation={6} sx={{ display: 'flex', alignItems: 'center' }}>
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: '100%',
                        width: '100%',
                        p: 4,
                    }}
                >
                    <Box
                        component={props.icon}
                        sx={{ fontSize: 72, color: 'primary.main' }}
                    />
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            flex: 1,
                            alignItems: 'flex-end',
                        }}
                    >
                        <Typography variant={'h2'} component={'p'}>
                            {props.value}
                        </Typography>
                        <Typography
                            variant={'subtitle1'}
                            fontSize={'1.25rem'}
                            color={'secondary.light'}
                        >
                            {props.subtitle}
                        </Typography>
                    </Box>
                </Box>
            </Paper>
        </Box>
    )
}
export default SingleStatPanel
