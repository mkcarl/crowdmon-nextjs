import {Box, Paper, Typography} from "@mui/material";
import {Bar} from "react-chartjs-2";

interface ContributionLineChartData {
    labels: string[],
    datasets: {
        label: string,
        data: number[],
        borderColor: string,
        backgroundColor: string,
        borderWidth: number
    }[],
    options?:{
        scales:{
            x: {
                type: "time"
            }
        }
    },
    hoverOffset: number
}

interface ContributionHistoryProps {
    data: ContributionLineChartData
}

export function ContributionHistory(props: ContributionHistoryProps) {
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
                    Past 7 days contributions
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
                    <Bar
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
