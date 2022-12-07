import { Backdrop, Box, CircularProgress, Typography } from "@mui/material";

export default function loadingComponent(){
    return (
        <Backdrop open={true} invisible={true}>
            <Box display='flex' justifyContent='center' alignItems='center' height='100 vh'>
                <CircularProgress size={100} color = 'secondary'/>
                <Typography variant='h4' sx={{justifyContent:'center', position:'fixed', top:'60%'}}></Typography>
            </Box>
        </Backdrop>
    )
}