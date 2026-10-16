import ThumbUpOutlinedIcon from "@mui/icons-material/ThumbUpOutlined";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbDownOutlinedIcon from "@mui/icons-material/ThumbDownOutlined";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import { Box, IconButton, Stack, Typography } from "@mui/material";
import React from "react";
import { like as updateLike} from "../lib/like.ts";
import LikeDislikeButton from "./LikeDislikeButton.jsx";

const LikeSection = ({book}) => {
    const likesCount = parseInt(book?.likes_count) + (parseInt(book?.like) == 1 ? -1 : 0);
    const dislikesCount = parseInt(book?.dislikes_count) + (parseInt(book?.like) == -1 ? -1 : 0);
    const [like, setLike] = React.useState();
    const handleLike = () => {const l = like == 1 ? 0 : 1; updateLike(book?.id, l); setLike(l);}
    const handleDislike = () => {const l = like == -1 ? 0 : -1; updateLike(book?.id, l); setLike(l);}

    React.useEffect(() => {
        if (book) {
            setLike(book?.like);
        }
    }, [book]);

    return <Stack
        direction="row"
        spacing={1}
        alignItems="center"
        sx={{
        }}
    >
        <LikeDislikeButton
            action={handleLike}
            active={like == 1}
            count={likesCount + (like == 1 ? 1 : 0)}
            icon_active={<ThumbUpIcon sx={{ width: 26, height: 26 }} />}
            icon_inactive={<ThumbUpOutlinedIcon sx={{ width: 26, height: 26 }} />}
        />

        <LikeDislikeButton
            action={handleDislike}
            active={like == -1}
            count={dislikesCount + (like == -1 ? 1 : 0)}
            icon_active={<ThumbDownIcon sx={{ width: 26, height: 26 }} />}
            icon_inactive={<ThumbDownOutlinedIcon sx={{ width: 26, height: 26 }} />}
        />
    </Stack>
};

export default LikeSection;