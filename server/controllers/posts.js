import express from 'express';
import mongoose from 'mongoose';

import PostMessage from '../models/postMessage.js';

const router = express.Router();

export const getPosts = async (req, res) => { 
    const {page} = req.query;
    try {
        const LIMIT =8;
        const startIndex = (Number(page)-1)*LIMIT; // getting the starting index
        
        const total = await PostMessage.countDocuments({}); //getting total number of documents
         
        const posts = await PostMessage.find({}).sort({_id:-1}).limit(LIMIT).skip(startIndex);
        // const postMessages = await PostMessage.find({});
           res.status(200).json({
               data: posts,
               numberOfPages: Math.ceil(total / LIMIT),
               currentPage: Number(page)
           })     
        // res.status(200).json(postMessages);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

export const getPostsBySearch = async(req,res)=>{
    // search by tags or searchQuery
    
    const { searchQuery,tags} = req.query;
    // console.log("search: ", searchQuery);
    //  console.log("tags :",tags);
    try {
        const title = new RegExp(searchQuery,"i");
        const posts = await PostMessage.find({ $or:[ {title:title}, {tags:{$in: tags.split(',')}} ] })
      
        res.status(200).json({
            data: posts
        })
    } catch (error) {
        res.status(404).json({
            message: "check in try/catch block",
            error: error
        })
    }
    
}

export const commentPost=async(req,res)=>{
    const {id}= req.params;
    const {value} = req.body;
    console.log("value is: ",value);
    try {
         const post = await PostMessage.findById(id);
        // console.log("post: ",post.comments);
        post.comments.push(value);  
         const updatedPost = await PostMessage.findByIdAndUpdate(
             id,
             post,
             {
                 new:true,
                 runValidators:true
             }
         )
         //console.log("Finally Post are:",post.comments)
         res.status(200).json(updatedPost);
    } catch (error) {
        console.log("Error is updating post",error);
        res.status(500).json(error);
    }
}
// export const getPost = async (req, res) => { 
//     const { id } = req.params;

//     try {
//         const post = await PostMessage.findById(id);
        
//         res.status(200).json(post);
//     } catch (error) {
//         res.status(404).json({ message: error.message });
//     }
// }
export const getPost = async (req, res) => { 
    const { id } = req.params;

    try {
        const post = await PostMessage.findOne({_id:id});
        
        res.status(200).json(post);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

export const createPost = async (req, res) => {
    //const { title, message, selectedFile, creator, tags } = req.body;
    const post = req.body;
    
    const newPostMessage = new PostMessage({ ...post, creator: req.userId, createdAt:new Date().toISOString()})
    // const newPostMessage = new PostMessage({ title, message, selectedFile, creator, tags })

    try {
        await PostMessage.create(newPostMessage);

        res.status(201).json(newPostMessage );
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
}

export const updatePost = async (req, res) => {
    const { id } = req.params;
    const { title, message, creator, selectedFile, tags } = req.body;
    
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No post with id: ${id}`);

    const updatedPost = { creator, title, message, tags, selectedFile, _id: id };

    await PostMessage.findByIdAndUpdate(id, updatedPost, { new: true, runValidators:true });

    res.json(updatedPost);
}

export const deletePost = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No post with id: ${id}`);

    await PostMessage.findByIdAndRemove(id);

    res.json({ message: "Post deleted successfully." });
}

export const likePost = async (req, res) => {
    const { id } = req.params;

    if (!req.userId) {
        return res.json({ message: "Unauthenticated" });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No post with id: ${id}`);
    
    const post = await PostMessage.findById(id);

    const index = post.likes.findIndex((id) => id ===String(req.userId));
    
    if (index === -1) {
        post.likes.push(req.userId);
      } else {
        post.likes = post.likes.filter((id) => id !== String(req.userId));
      }
    // const updatedPost = await PostMessage.findByIdAndUpdate(id, { likeCount: post.likeCount + 1 }, { new: true , runValidators:true});
    const updatedPost = await PostMessage.findByIdAndUpdate(id, post, { new: true , runValidators:true});
    res.status(200).json(updatedPost);
}


export default router;