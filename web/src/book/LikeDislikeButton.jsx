import { IconButton, Stack, Typography } from "@mui/material"

const LikeDislikeButton = ({action, active, icon_active, icon_inactive, count}) =>
<Stack direction="row" sx={{alignItems: 'center', gap: '8px', pr: 1}}>
    <IconButton
        onClick={action}
        sx={{
            width: 40,
            height: 40,
            bgcolor: "rgba(0, 0, 0, 0.3)",
            borderRadius: 1,
            color: "white",
            '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.4)' },
        }}
    >
        {active ? icon_active : icon_inactive}
    </IconButton>
    {count > 0 && <Typography
        style={{
            fontFamily: "'PT_Root_UI-Bold', Helvetica",
            color: 'white'
        }}>1</Typography>}
</Stack>



export default LikeDislikeButton;