import { Box, Button, Grid, Typography } from "@mui/material";


export default function LandingPage() {
  return (
      <Grid container spacing={0}>
        <Grid item xs={12} sm={12} md={6}>
          <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                height: "100vh",
                paddingX: "10vw",
                justifyContent: "center",
                alignItems: "flex-start",
                userSelect: "none",
              }}
              bgcolor={"primary.dark"}
          >
            <Typography variant={"h1"}>Crowdmon</Typography>
            <Typography variant={"h2"}>
              crowd-sourcing for Paimon dataset
            </Typography>
            <Button
                href={"/home"}
                variant={"contained"}
                color={"secondary"}
            >
              Get started
            </Button>
          </Box>
        </Grid>
        <Grid
            item
            xs={0}
            sm={0}
            md={6}
            sx={{ display: { xs: "none", sm: "none", md: "flex" } }}
        >
          <Box
              component={"div"}
              alignSelf={"flex-end"}
              maxHeight={"100%"}
              draggable={"false"}
          >
            <Box
                component={"img"}
                src={"https://res.cloudinary.com/dmqxgg2mj/image/upload/v1687704999/crowdmon-website-assets/paimon_read_c0v37u.png"}
                sx={{
                  width: "auto",
                  maxWidth: "100%",
                  height: "100%",
                  maxHeight: "100vh",
                  transform: "translateX(-20%)",
                  display: "block",
                }}
            />
          </Box>
        </Grid>
      </Grid>
  );
}
