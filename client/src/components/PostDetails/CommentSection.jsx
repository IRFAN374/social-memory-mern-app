import React, { useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import useStyles from './postDetailsStyles';

import {Typography,Button,TextField} from '@material-ui/core';
import {commentPost} from '../../actions/posts'
const CommentSection = ({post}) => {
  // coming from pageDetails
    const user = JSON.parse(localStorage.getItem('profile'));
    const [comment, setComment] = useState('');
    const dispatch = useDispatch();
    const classes = useStyles();
    const [comments, setComments ] = useState(post?.comments);
    const commentsRef = useRef();

    const handleComment=async()=>{
        const newComments = await dispatch(commentPost(`${user?.result?.name}:${comment}`,post._id));
        setComments(newComments);
        setComment('');
        commentsRef.current.scrollIntoView({behaviour: 'smooth'});
    }

    return (
        <div>
            <div className={classes.commentsOuterContainer}>
                <div className={classes.commentsInnerContainer}>
                    <Typography gutterBottom variant="h6">Comments</Typography>
                    {
                        comments?.map((comment,index)=>(
                            <Typography key={index} gutterBottom variant="subtitle1">
                               <strong>{comment.split(':')[0]}::</strong> 
                                
                               {comment.split(":")[1]}
                            </Typography>
                        ))
                    }
                    
                    <div ref={commentsRef} />
                </div>
                {user?.result?.name && (
                <div style={{width: '70%'}}>
                    <Typography gutterBottom variant="h6">Write a comment</Typography>
                    <TextField fullWidth rows={4} variant="outlined" label="comment" multiline value={comment} onChange={(event)=>setComment(event.target.value)} />
                    <br></br>
                    <Button style={{marginTop:'10px'}} fullWidth disabled={!comment.length} color="primary" variant="contained" onClick={handleComment} > Comment </Button>
                </div>
                )}
            </div>
        </div>
    );
};

export default CommentSection;