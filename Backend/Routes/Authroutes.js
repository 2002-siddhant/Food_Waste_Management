const express = require("express");
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../Models/users');
const bcrypt  = require('bcryptjs');

router.post("/register", async (req,res)=>{
    const {name,email,password,phone,address,role} = req.body;
    const normalizedRole = role?.toLowerCase();
    const allowedRoles = ['donor','delivery','ngos','admin'];

    try{
        if(!allowedRoles.includes(normalizedRole)){
            return res.status(400).json({message:"Invalid role"});
        }

        let user = await User.findOne({email});
        if(user){
            return res.status(400).json({message:"User already exists"});
        }
        const hashedPassword = await bcrypt.hash(password,10);
        user = new User({
            name,
            email,
            password:hashedPassword,
            phone,
            address,
            role: normalizedRole
        });
        await user.save();
        res.status(201).json({message:"User registered successfully"});
        
    }
    catch(err){
        console.log(err);
        res.status(500).json({message:"Server error"});
    }

});

router.post("/login", async (req,res)=>{
    const {email,password} = req.body;
    try{
        let user = await User.findOne({email});
        if(!user){
            console.log(user)
            return res.status(400).json({message:"Invalid credentials"});
        }
        const isMatch = await bcrypt.compare(password,user.password);
        if(!isMatch){
            console.log(isMatch)
            return res.status(400).json({message:"Invalid credentials"});
        }
        const payload = {
            user:{
                id:user.id,
                role:user.role,
                email:user.email,
            }
        }
        const token = jwt.sign(payload, "123456", {expiresIn:'90h'});
        res.json({message:"Login successful", token});

    }
    catch(err){
        console.log(err);
        res.status(500).json({message:"Server error"});
    }
})

module.exports = router;