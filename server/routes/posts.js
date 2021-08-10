import express from 'express';

import { getPosts,commentPost ,getPost,getPostsBySearch ,createPost, updatePost, likePost, deletePost } from '../controllers/posts.js';
import auth from '../middleware/auth.js'
const router = express.Router();

router.get('/', getPosts);
router.get('/search', getPostsBySearch);
router.get('/:id', getPost);

router.post('/:id/commentPost',auth,commentPost);
router.post('/', auth ,createPost);
router.patch('/:id',auth, updatePost);
router.delete('/:id', auth,deletePost);
router.patch('/:id/likePost',auth, likePost);

export default router;