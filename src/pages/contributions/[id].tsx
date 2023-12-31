import { Box, Typography } from '@mui/material'
import Navbar from '@/components/Navbar'
import Grid from '@mui/system/Unstable_Grid'
import { Container } from '@mui/material'
import { useCookies } from 'react-cookie'
import SingleStatWithImagePanel from '@/components/dashboard/SingleStatWithImagePanel'
import ChartPanelWithTitle from '@/components/dashboard/ChartPanelWithTitle'
import { EChartsOption } from 'echarts'
import { GetServerSideProps, GetServerSidePropsContext, NextPage } from 'next'
import React, { useEffect, useState } from 'react'
import sql from '@/lib/postgres'
import { firebaseAuth } from '@/lib/firebase'
import { useAuthState } from 'react-firebase-hooks/auth'
import {
    getContributionByType,
    getContributionGroupedByVideoId,
    getContributionRankAndPercentage,
    getContributionsByDay,
    getNumberOfDaysLoggedIn,
    getTotalAnnotations,
} from '@/lib/dashboardQueries'
import dayjs from 'dayjs'
import { useRouter } from 'next/router'
import Loading from '@/components/Loading'

interface Props {
    contributionByTypeData: EChartsOption
    contributionByDayData: EChartsOption
    contributionGroupedByVideoIdData: EChartsOption
    daysLoggedIn: number
    totalContributions: number
    topContributor: string
    overallContribution: string
}

const ContributionsPage: NextPage<Props> = (props) => {
    const [cookie] = useCookies(['username'])
    const [username, setUsername] = useState<string>('')
    const [user, loading, error] = useAuthState(firebaseAuth)
    const router = useRouter()
    // data for the charts
    const [donutData, setDonutData] = useState<any>({})
    const [timelineData, setTimelineData] = useState<any>({})
    const [multiBarChartData, setMultiBarChartData] = useState<any>({})
    const [daysLoggedIn, setDaysLoggedIn] = useState<number>(NaN)
    const [totalContributions, setTotalContributions] = useState<number>(NaN)
    const [topContributor, setTopContributor] = useState<string>('')
    const [overallContribution, setOverallContribution] = useState<string>('')

    useEffect(() => {
        setUsername(cookie.username)
    }, [cookie])

    useEffect(() => {
        setDonutData(contributionByTypeTemplate(props.contributionByTypeData))
    }, [props.contributionByTypeData])

    useEffect(() => {
        setTimelineData(contributionByDayTemplate(props.contributionByDayData))
    }, [props.contributionByDayData])

    useEffect(() => {
        setMultiBarChartData(
            multiBarChartTemplate(props.contributionGroupedByVideoIdData)
        )
    }, [props.contributionGroupedByVideoIdData])

    useEffect(() => {
        setDaysLoggedIn(props.daysLoggedIn)
    }, [props.daysLoggedIn])

    useEffect(() => {
        setTotalContributions(props.totalContributions)
    }, [props.totalContributions])

    useEffect(() => {
        setTopContributor(props.topContributor)
    }, [props.topContributor])

    useEffect(() => {
        setOverallContribution(props.overallContribution)
    }, [props.overallContribution])

    // handle auth
    useEffect(() => {
        if (!user) {
            router.push('/')
        }
    }, [user])

    if (loading || !user) {
        return <Loading />
    }

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Navbar />
            <Box sx={{ width: '100vw', flex: 1, p: 4 }}>
                <Container>
                    <Typography variant={'h1'} textAlign={'center'}>
                        {username}&apos;s contributions
                    </Typography>
                </Container>
                <Grid container spacing={3}>
                    <Grid xs={12} md={6} xl={3}>
                        <SingleStatWithImagePanel
                            value={daysLoggedIn}
                            subtitle={'days logged in'}
                            url={
                                'https://res.cloudinary.com/dmqxgg2mj/image/upload/v1691120500/crowdmon-website-assets/f6d9vwyjtbvqjhyll5yx.png'
                            }
                        />
                    </Grid>
                    <Grid xs={12} md={6} xl={3}>
                        <SingleStatWithImagePanel
                            value={totalContributions}
                            subtitle={'total contributions'}
                            url={
                                'https://res.cloudinary.com/dmqxgg2mj/image/upload/v1691122210/crowdmon-website-assets/zytomni6waus6vezkip9.png'
                            }
                        />
                    </Grid>
                    <Grid xs={12} md={6} xl={3}>
                        <SingleStatWithImagePanel
                            value={topContributor}
                            subtitle={'top contributor'}
                            url={
                                'https://res.cloudinary.com/dmqxgg2mj/image/upload/v1691122746/crowdmon-website-assets/bqwjb4xc6ccuhf4hjfqi.png'
                            }
                        />
                    </Grid>
                    <Grid xs={12} md={6} xl={3}>
                        <SingleStatWithImagePanel
                            value={overallContribution}
                            subtitle={'of overall contribution'}
                            url={
                                'https://res.cloudinary.com/dmqxgg2mj/image/upload/v1691125914/crowdmon-website-assets/fcgfwxuzounnme7bncmf.png'
                            }
                        />
                    </Grid>
                    <Grid xs={12} md={6} lg={4}>
                        <ChartPanelWithTitle
                            options={donutData}
                            title={'Contribution by type'}
                        />
                    </Grid>
                    <Grid xs={12} md={6} lg={8}>
                        <ChartPanelWithTitle
                            options={timelineData}
                            title={'Contribution timeline'}
                        />
                    </Grid>
                    <Grid xs={12}>
                        <ChartPanelWithTitle
                            options={multiBarChartData}
                            title={'Annotations grouped by video name'}
                        />
                    </Grid>
                    {/*TODO : add annotation speed to crop table, so can show average annotation speed */}
                    {/**/}

                    {/*    <Grid xs={6}>*/}
                    {/*        <ChartPanelWithTitle*/}
                    {/*            options={{*/}
                    {/*                title: [*/}
                    {/*                    {*/}
                    {/*                        text: 'Michelson-Morley Experiment',*/}
                    {/*                        left: 'center',*/}
                    {/*                    },*/}
                    {/*                    {*/}
                    {/*                        text: 'upper: Q3 + 1.5 * IQR \nlower: Q1 - 1.5 * IQR',*/}
                    {/*                        borderColor: '#999',*/}
                    {/*                        borderWidth: 1,*/}
                    {/*                        textStyle: {*/}
                    {/*                            fontWeight: 'normal',*/}
                    {/*                            fontSize: 14,*/}
                    {/*                            lineHeight: 20,*/}
                    {/*                        },*/}
                    {/*                        left: '10%',*/}
                    {/*                        top: '90%',*/}
                    {/*                    },*/}
                    {/*                ],*/}
                    {/*                dataset: [*/}
                    {/*                    {*/}
                    {/*                        // prettier-ignore*/}
                    {/*                        source: [*/}
                    {/*                            [850, 740, 900, 1070, 930, 850, 950, 980, 980, 880, 1000, 980, 930, 650, 760, 810, 1000, 1000, 960, 960],*/}
                    {/*                            [960, 940, 960, 940, 880, 800, 850, 880, 900, 840, 830, 790, 810, 880, 880, 830, 800, 790, 760, 800],*/}
                    {/*                            [880, 880, 880, 860, 720, 720, 620, 860, 970, 950, 880, 910, 850, 870, 840, 840, 850, 840, 840, 840],*/}
                    {/*                            [890, 810, 810, 820, 800, 770, 760, 740, 750, 760, 910, 920, 890, 860, 880, 720, 840, 850, 850, 780],*/}
                    {/*                            [890, 840, 780, 810, 760, 810, 790, 810, 820, 850, 870, 870, 810, 740, 810, 940, 950, 800, 810, 870]*/}
                    {/*                        ],*/}
                    {/*                    },*/}
                    {/*                    {*/}
                    {/*                        transform: {*/}
                    {/*                            type: 'boxplot',*/}
                    {/*                            config: {*/}
                    {/*                                itemNameFormatter:*/}
                    {/*                                    'expr {value}',*/}
                    {/*                            },*/}
                    {/*                        },*/}
                    {/*                    },*/}
                    {/*                    {*/}
                    {/*                        fromDatasetIndex: 1,*/}
                    {/*                        fromTransformResult: 1,*/}
                    {/*                    },*/}
                    {/*                ],*/}
                    {/*                tooltip: {*/}
                    {/*                    trigger: 'item',*/}
                    {/*                    axisPointer: {*/}
                    {/*                        type: 'shadow',*/}
                    {/*                    },*/}
                    {/*                },*/}
                    {/*                grid: {*/}
                    {/*                    left: '10%',*/}
                    {/*                    right: '10%',*/}
                    {/*                    bottom: '15%',*/}
                    {/*                },*/}
                    {/*                xAxis: {*/}
                    {/*                    type: 'category',*/}
                    {/*                    boundaryGap: true,*/}
                    {/*                    nameGap: 30,*/}
                    {/*                    splitArea: {*/}
                    {/*                        show: false,*/}
                    {/*                    },*/}
                    {/*                    splitLine: {*/}
                    {/*                        show: false,*/}
                    {/*                    },*/}
                    {/*                },*/}
                    {/*                yAxis: {*/}
                    {/*                    type: 'value',*/}
                    {/*                    name: 'km/s minus 299,000',*/}
                    {/*                    splitArea: {*/}
                    {/*                        show: true,*/}
                    {/*                    },*/}
                    {/*                },*/}
                    {/*                series: [*/}
                    {/*                    {*/}
                    {/*                        name: 'boxplot',*/}
                    {/*                        type: 'boxplot',*/}
                    {/*                        datasetIndex: 1,*/}
                    {/*                    },*/}
                    {/*                    {*/}
                    {/*                        name: 'outlier',*/}
                    {/*                        type: 'scatter',*/}
                    {/*                        datasetIndex: 2,*/}
                    {/*                    },*/}
                    {/*                ],*/}
                    {/*            }}*/}
                    {/*            title={'Average annotation speed by video'}*/}
                    {/*        />*/}
                    {/*    </Grid>*/}
                </Grid>
            </Box>
        </Box>
    )
}

const contributionByTypeTemplate = (data: any) => {
    return {
        // doughnut chart
        tooltip: {
            trigger: 'item',
        },
        legend: {
            top: '5%',
            left: 'center',
        },
        series: [
            {
                name: 'Access From',
                type: 'pie',
                radius: ['40%', '70%'],
                avoidLabelOverlap: false,
                label: {
                    show: false,
                    position: 'center',
                },
                emphasis: {
                    label: {
                        show: true,
                        fontSize: 40,
                        fontWeight: 'bold',
                    },
                },
                labelLine: {
                    show: false,
                },
                data,
            },
        ],
    }
}

const contributionByDayTemplate = (data: any) => {
    return {
        xAxis: {
            type: 'category',
            data: data.slice(0, 7).map((d: any) => d.day_of_week),
        },
        yAxis: {
            type: 'value',
            name: 'Number of annotations',
            nameLocation: 'center',
            nameGap: 50,
        },
        series: [
            {
                data: data.slice(0, 7).map((d: any) => d.annotation_count),
                type: 'line',
                name: 'Last week',
                smooth: true,
            },
            {
                data: data.slice(7, 14).map((d: any) => d.annotation_count),
                type: 'line',
                name: 'This week',
                smooth: true,
            },
        ],
        tooltip: {
            trigger: 'axis',
        },
        legend: {
            show: true,
        },
    }
}

const multiBarChartTemplate = (data: any) => {
    return {
        tooltip: {
            trigger: 'axis',
        },
        legend: {
            show: true,
        },
        yAxis: {
            type: 'value',
        },
        xAxis: {
            type: 'category',
            data: data.map((d: any) => d.video_id),
        },
        series: [
            {
                name: 'No Paimon',
                type: 'bar',
                data: data.map((d: any) => d.num_no_crops),
            },
            {
                name: 'Paimon',
                type: 'bar',
                data: data.map((d: any) => d.num_crops),
            },
        ],
    }
}

export const getServerSideProps = async (
    context: GetServerSidePropsContext
) => {
    const contributionByTypeData = await getContributionByType(
        context.query.id as string
    )
    const contributionByDayData = await getContributionsByDay(
        context.query.id as string
    )
    const contributionGroupedByVideoIdData =
        await getContributionGroupedByVideoId(context.query.id as string)

    const daysLoggedIn = await getNumberOfDaysLoggedIn(
        context.query.id as string
    )

    const totalContributions = await getTotalAnnotations(
        context.query.id as string
    )

    const contributionRankAndPercentage =
        await getContributionRankAndPercentage(context.query.id as string)

    const ranking = contributionRankAndPercentage?.rank
    const percentage = contributionRankAndPercentage?.percentage

    return {
        props: {
            contributionByTypeData,
            contributionByDayData,
            contributionGroupedByVideoIdData,
            daysLoggedIn,
            totalContributions,
            topContributor: ranking ? `# ${ranking}` : 'N/A',
            overallContribution: percentage ? `${percentage} %` : 'N/A',
        },
    }
}

export default ContributionsPage
