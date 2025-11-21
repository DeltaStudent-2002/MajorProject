const express = require("express");
const router = express.Router();


//Index Users
router.get("/", (req,res)=>{
    res.send("GET for users");
})

//Show - users
router.get("/:id", (req, res)=>{
    res.send("GET for users id")
})

//post -users
router.post("/",(req,res)=>{
    res.send("Post for users");
}),

//Delete-users
router.delete("/:id", (req,res)=>{
    res.send("Delete for user")
})
module.exports = router;