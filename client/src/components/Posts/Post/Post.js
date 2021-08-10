import React, { useState } from 'react';
import { Card, CardActions,ButtonBase ,CardContent, CardMedia, Button, Typography } from '@material-ui/core/';
import ThumbUpAltIcon from '@material-ui/icons/ThumbUpAlt';
import DeleteIcon from '@material-ui/icons/Delete';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import moment from 'moment';
import { useDispatch } from 'react-redux';
import ThumbUpAltOutlined from '@material-ui/icons/ThumbUpAltOutlined';
import { likePost, deletePost } from '../../../actions/posts';
import useStyles from './postStyles';
import { useHistory } from 'react-router-dom';

const Post = ({post,setCurrentId}) => {
    const dispatch = useDispatch();
    const classes = useStyles();
    const user = JSON.parse(localStorage.getItem('profile'));
    const history=useHistory();  
    const [totalLikes, setTotalLikes] = useState(post?.likes);
    
    const userId= (user?.result?.googleId || user?.result?._id);
    const checkHasLiked = totalLikes.find((like) => like === (user?.result?.googleId || user?.result?._id));
    const handleLikes= async ()=>{
      dispatch(likePost(post._id));
      // if person is already likes then removes likes by one
      // check likes array has personid or not
      // else increase by one
      if(checkHasLiked){
         setTotalLikes(
           totalLikes.filter((like)=> like !==userId)
         );
      }else{
        setTotalLikes([...totalLikes,userId])
      }
  
    }

    const Likes = () => {
      if (totalLikes.length > 0) {
        return totalLikes.find((like) => like === userId)
          ? (
            <><ThumbUpAltIcon fontSize="small" />&nbsp;{totalLikes.length > 2 ? `You and ${totalLikes.length - 1} others` : `${totalLikes.length} like${totalLikes.length > 1 ? 's' : ''}` }</>
          ) : (
            <><ThumbUpAltOutlined fontSize="small" />&nbsp;{totalLikes.length} {totalLikes.length === 1 ? 'Like' : 'Likes'}</>
          );
      }
  
      return <><ThumbUpAltOutlined fontSize="small" />&nbsp;Like</>;
    };
  
   const openPost =(event)=>{
    history.push(`/posts/${post._id}`);
   }
   
    return (
        <Card className={classes.card} raised elevation={6}>
          <ButtonBase className={classes.cardAction} onClick={openPost}>
            <CardMedia className={classes.media} image={post.selectedFile || 'https://user-images.githubusercontent.com/194400/49531010-48dad180-f8b1-11e8-8d89-1e61320e1d82.png'} title={post.title} />
            <div className={classes.overlay}>
              <Typography variant="h6">{post.name}</Typography>
              <Typography variant="body2">{moment(post.createdAt).fromNow()}</Typography>
            </div>
            <div className={classes.overlay2}>
            {(user?.result?.googleId === post?.creator || user?.result?._id === post?.creator) && (
              <Button style={{ color: 'white' }} size="small" onClick={() => { setCurrentId(post._id) }} ><MoreHorizIcon fontSize="default" /></Button>
            )}
              {/* <Button style={{ color: 'white' }} size="small" onClick={() => { setCurrentId(post._id) }} ><MoreHorizIcon fontSize="default" /></Button> */}
            </div>
            
            <div className={classes.details}>
              <Typography variant="body2" color="textSecondary" component="h2">{post.tags.map((tag) => `#${tag} `)}</Typography>
            </div>
            <Typography className={classes.title} gutterBottom variant="h5" component="h2">{post.title}</Typography>
            <CardContent>
              <Typography variant="body2" color="textSecondary" component="p">{post.message}</Typography>
            </CardContent>
          </ButtonBase>
          <CardActions className={classes.cardActions}>
            <Button size="small" color="primary" disabled={!user?.result} onClick={handleLikes}>
              {/* <ThumbUpAltIcon fontSize="small" /> 
              Like {post.likeCount}  */}
                <Likes/>
              </Button>
            
            {(user?.result?.googleId === post?.creator || user?.result?._id === post?.creator) && (
            <Button size="small" color="secondary" onClick={() => dispatch(deletePost(post._id))}>
              <DeleteIcon fontSize="small" /> Delete
            </Button>
             )}
          </CardActions>
        </Card>
      );
};

export default Post;


/**
 * Dispatch post id from post to form 
 */