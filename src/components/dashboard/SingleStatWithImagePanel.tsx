import { Avatar, Box, Paper, Typography } from '@mui/material'
import { NextPage } from 'next'
import { CheckBox, FileOpen, FileOpenOutlined } from '@mui/icons-material'
import Image from 'next/image'

type Props = { value: number | string; subtitle: string; url: string }

const SingleStatWithImagePanel: NextPage<Props> = (props) => {
    return (
        <Box sx={{ width: '100%' }}>
            <Paper elevation={6} sx={{ display: 'flex', alignItems: 'center' }}>
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center',
                        flex: 1,
                        p: 4,
                    }}
                >
                    <Box
                        sx={{
                            flex: 2,
                        }}
                    >
                        <Box
                            component={'img'}
                            src={props.url}
                            sx={{ width: 'auto', height: '150px' }}
                        />
                    </Box>
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            flex: 3,
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
export default SingleStatWithImagePanel
