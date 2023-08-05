import { FC, useEffect } from 'react'
import { Box, Container, Divider, Paper, Typography } from '@mui/material'
import ReactECharts from 'echarts-for-react'
import { chalkTheme } from '@/styles/echart-theme'

type Props = {
    options: any
    title: string
}

const ChartPanelWithTitle: FC<Props> = (props) => {
    return (
        <Box sx={{ width: '100%' }}>
            <Paper elevation={6}>
                <Typography
                    variant={'h6'}
                    component={'h2'}
                    textAlign={'center'}
                >
                    {props.title}
                </Typography>
                <Divider />
                <Box
                    sx={{
                        flex: 1,
                        p: 2,
                    }}
                >
                    <ReactECharts
                        option={props.options}
                        style={{ height: '24rem' }}
                        theme={chalkTheme}
                    />
                </Box>
            </Paper>
        </Box>
    )
}

export default ChartPanelWithTitle
