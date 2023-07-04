import {Chip, Divider, List, ListItem, ListItemIcon, ListItemText, Pagination, Paper, Typography} from "@mui/material";
import {Crop} from "@mui/icons-material";
import dayjs from "dayjs";
import {useState} from "react";
import {CropData} from "@/types";


interface Props{
    crops: CropData[]
}

export function ContributionDetailsList(props: Props){
    const [page, setPage] = useState(1);
    const pageLength = 8;

    const {crops} = props;

    return (
        <Paper
            elevation={1}
            sx={{
                padding: "1rem",
                gap: "1rem",
            }}
        >
            <Typography variant={"h4"} textAlign={"center"}>
                Crop details
            </Typography>
            <Divider />
            <List>
                {Object.values(
                    crops.slice(
                        (page - 1) * pageLength,
                        (page - 1) * pageLength + pageLength
                    )
                ).map((crop, index) => (
                    <ListItem key={index}>
                        <ListItemIcon>
                            <Crop color={"secondary"} />
                        </ListItemIcon>
                        <ListItemText
                            primary={crop.video_id}
                            secondary={dayjs(
                                crop.timestamp
                            ).format(
                                "DD MMM YYYY (HH:mm:ss)"
                            )}
                        />
                        <Chip
                            label={crop.annotation_class}
                            color={
                                crop.annotation_class ===
                                "none"
                                    ? "error"
                                    : "primary"
                            }
                        />
                    </ListItem>
                ))}
            </List>
            <Pagination
                count={Math.ceil(crops.length / pageLength)}
                size={"large"}
                page={page}
                onChange={(e, v) => {
                    setPage(v);
                }}
            />
        </Paper>
    )
}
