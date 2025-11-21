const express = require("express");
const router = express.Router();

//Posts
//Index
app.get("/", (req,res)=>{
    res.send("GET for posts");
})

//Show - users
app.get("/:id", (req, res)=>{
    res.send("GET for posts id")
})

//post -users
app.post("/",(req,res)=>{
    res.send("Post for posts");
}),

//Delete-users
app.delete("/:id", (req,res)=>{
    res.send("Delete for post id")
})

module.exports = router;