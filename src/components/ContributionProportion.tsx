import {Box, Paper, Typography} from "@mui/material";
import {Doughnut} from "react-chartjs-2";

import {
    ArcElement,
    BarElement,
    CategoryScale,
    Chart,
    Legend,
    LinearScale,
    LineElement,
    PointElement,
    TimeScale,
    Title,
    Tooltip,
} from "chart.js";


Chart.register(
    ArcElement,
    Tooltip,
    Legend,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    TimeScale,
    CategoryScale,
    BarElement
);

interface ContributionDoughnutChartData {
    labels: string[],
    datasets: {
        label: string,
        backgroundColor: string[],
        borderColor: string[],
        data: number[]
    }[]
}

interface ContributionProportionProps {
    data: ContributionDoughnutChartData
}

export function ContributionProportion(props: ContributionProportionProps) {

    return (
        <Paper elevation={1}>
            <Box
                component={"div"}
                sx={{
                    padding: "1rem",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                }}
            >
                <Typography variant={"h4"}>
                    Contributions per video
                </Typography>
                <Box
                    component={"div"}
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                        width: "100%",
                        height: "30vh",
                    }}
                >
                    <Doughnut
                        data={props.data}
                        options={{
                            maintainAspectRatio: false,
                        }}
                    />
                </Box>
            </Box>
        </Paper>
    );
}
