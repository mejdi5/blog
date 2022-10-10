import express from "express";
import { db } from '../database.js'
const router = express.Router();


//add new post
router.post("/", async (req, res) => {
    const q =  "INSERT INTO posts(`id`, `title`, `description`, `image`, `category`, `date`,`userId`) VALUES (?)";
    const values = [Date.now().toString(), req.body.title, req.body.description, req.body.image, req.body.category, new Date(Date.now()), req.body.userId];
    db.query(q, [values], (err) => {
        if (err) return res.status(500).json(err);
        const savedPost = {
            id: values[0],
            title: values[1],
            description: values[2],
            image: values[3],
            category: values[4],
            date: values[5],
            userId: values[6]
        }
            return res.status(200).json({savedPost, msg: `post added with success`}); 
        });
});

//get all posts
router.get("/", (req, res) => {
    const q = req.query.category ? "SELECT * FROM posts WHERE category=?" :  "SELECT * FROM posts";
    db.query(q, [req.query.category], (err, data) => {
        if (err) return res.status(500).json(err);
        return res.status(200).json(data); 
    })
});

//get one post
router.get("/:id", (req, res) => {
    const q = "SELECT * FROM posts WHERE id=?";
    db.query(q, [req.params.id], (err, data) => {
        if (err) return res.status(500).json(err);
        return res.status(200).json(data[0]); 
    })
});

//delete a post
router.delete("/:id", (req, res) => {
    const q = "DELETE FROM posts WHERE `id` = ?";
    db.query(q, [req.params.id], (err) => {
        if (err) return res.status(500).json(err);
        return res.status(200).json("post deleted.."); 
    })
});

//edit a post 
router.put("/:id", (req, res) => {
    var post = {}
    const query = "SELECT * FROM posts WHERE id=?";
    db.query(query, [req.params.id], (err, data) => {
        if (err) return res.status(500).json(err);
        post = data[0]
        const q = "UPDATE posts SET `title`=?, `description`=?, `image`=?, `category`=? WHERE `id` = ?"
        const values = [
            req.body.title || post.title,
            req.body.description || post.description,
            req.body.image || post.image,
            req.body.category || post.category
        ]
        db.query(q, [...values, req.params.id], (err) => {
            if (err) return res.status(500).json(err);
            return res.status(200).json("post edited.."); 
        })
    })
    
})


export default router