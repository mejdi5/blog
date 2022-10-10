import express from "express";
import { db } from '../database.js'
const router = express.Router();


//Register
router.post("/", (req, res) => {
    const q = "INSERT INTO users(`id`, `username`, `email`, `image`) VALUES (?)";
    const values = [req.body.id, req.body.username, req.body.email, req.body.image];
    db.query(q, [values], (err) => {
        if (err) return res.status(500).json(err.message);
        const savedUser = {
            id: req.body.id,
            username: req.body.username,
            email: req.body.email,
            image: req.body.image
        }
            return res.status(200).json({savedUser, msg: `${savedUser.username} is registered with success`}); 
        });
});

//login
router.get("/:id", (req, res) => {
    const q = "SELECT * FROM users WHERE id=?";
    db.query(q, [req.params.id], (err, data) => {
        if (err) return res.status(500).json(err);
        if(data.length === 0) return res.status(404).json("User not found");
        return res.status(200).json({msg: `user is logged with success`}); 
    })
});

//get all users
router.get("/", (req, res) => {
    const q = "SELECT * FROM users";
    db.query(q, (err, data) => {
        if (err) return res.status(500).json(err);
        return res.status(200).json(data); 
    })
});

//delete user
router.delete("/:id", (req, res) => {
    const q = "DELETE FROM users WHERE `id` = ?";
    db.query(q, [req.params.id], (err) => {
        if (err) return res.status(500).json(err);
        return res.status(200).json("user deleted.."); 
    })
});

//edit user
router.put("/:id", (req, res) => {
    let q = ""
    let values = []
    console.log(req.body)
    if(req.body.username) {
        q = "UPDATE users SET `username`=? WHERE `id` = ?"
        values = [req.body.username]
    } else if (req.body.email) {
        q = "UPDATE users SET `email`=? WHERE `id` = ?"
        values = [req.body.email]
    } else if (req.body.image) {
        q = "UPDATE users SET `image`=? WHERE `id` = ?"
        values = [req.body.image]
    } else {
        return res.status(200).json("Nothing to edit.."); 
    }
    db.query(q, [...values, req.params.id], (err) => {
        if (err) return res.status(500).json(err);
        return res.status(200).json("User edited.."); 
    })
});



export default router;