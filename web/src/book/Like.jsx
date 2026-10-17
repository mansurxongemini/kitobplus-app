import ThumbUpOutlinedIcon from "@mui/icons-material/ThumbUpOutlined";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbDownOutlinedIcon from "@mui/icons-material/ThumbDownOutlined";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import { Stack } from "@mui/material";
import React from "react";
import { like as updateLike} from "../lib/like.ts";
import LikeDislikeButton from "./LikeDislikeButton.jsx";
import T from "../lib/translator.js";

const LikeSection = ({book}) => {
    const likesCount = (parseInt(book?.likes_count, 10) || 0) + (Number(book?.like) === 1 ? -1 : 0);
    const dislikesCount = (parseInt(book?.dislikes_count, 10) || 0) + (Number(book?.like) === -1 ? -1 : 0);
    const [like, setLike] = React.useState();
    const handleLike = () => {const l = Number(like) === 1 ? 0 : 1; updateLike(book?.id, l); setLike(l);}
    const handleDislike = () => {const l = Number(like) === -1 ? 0 : -1; updateLike(book?.id, l); setLike(l);}

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
            active={Number(like) === 1}
            count={likesCount + (Number(like) === 1 ? 1 : 0)}
            icon_active={<ThumbUpIcon aria-hidden="true" sx={{ width: 26, height: 26 }} />}
            icon_inactive={<ThumbUpOutlinedIcon aria-hidden="true" sx={{ width: 26, height: 26 }} />}
            ariaLabel={T("Нравится")}
        />

        <LikeDislikeButton
            action={handleDislike}
            active={Number(like) === -1}
            count={dislikesCount + (Number(like) === -1 ? 1 : 0)}
            icon_active={<ThumbDownIcon aria-hidden="true" sx={{ width: 26, height: 26 }} />}
            icon_inactive={<ThumbDownOutlinedIcon aria-hidden="true" sx={{ width: 26, height: 26 }} />}
            ariaLabel={T("Не нравится")}
        />
    </Stack>
};

export default LikeSection;