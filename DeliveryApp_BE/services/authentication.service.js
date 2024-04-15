//authenication.service.js
const MongoDB = require("./mongodb.service")
const {mongoConfig, tokenSecrect} = require("../config")
const { route } = require("../routes")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const { query } = require("express")


const userRegister = async (user) => {
    try {
        if (!user?.username || !user?.email || !user?.password || !user?.phonenumber)
        return { status: false, message: "Please fill up all the fields" };
        const passwordHash = await bcrypt.hash(user?.password, 10)
        let userObject = {
            username: user?.username,
            phonenumber: user?.phonenumber,
            email : user?.email,
            password: passwordHash
        }
        let savedUser = await MongoDB.db
        .collection(mongoConfig.collections.USERS)
        .insertOne(userObject);
        if (savedUser?.acknowledged && savedUser?.insertedId){
           let token = jwt.sign({username: userObject?.username,phonenumber: userObject?.phonenumber, email: userObject?.email}, 
            tokenSecrect, 
            {expiresIn: "24h"} )
            return {
                status: true,
                message: "User registered successfully",
                data: token,
              };
            } else {
              return {
                status: false,
                message: "User registered failed",
               
              };
        }
        
    } catch (error) {
        console.log(error);
       let errorMessage = "Users registered faile";
       error?.code === 11000 && error?.keyPattern?.username
       ? (errorMessage = "Username already exits")
       : null;
       error?.code === 11000 && error?.keyPattern?.email
       ? (errorMessage = "Email already exits")
       : null;
       
        return{
            status : false,
            message : errorMessage,
            error : error?.toString(),
        }
    }
}

const userLogin = async (user) => {
    try {
        if (!user?.username || !user?.password)
        return { status: false, message: "Please fill up all the fields" };
        let userObject = await MongoDB.db
        .collection(mongoConfig.collections.USERS)
        .findOne({username: user?.username});

        if(userObject) {
            let isPasswordVerfied = await bcrypt.compare(user?.password, userObject?.password)
            if(isPasswordVerfied) {
            let token = jwt.sign({username: userObject?.username, email: userObject?.email}, 
                tokenSecrect, 
                {expiresIn: "24h"} 
                );
                return {
                    status: true,
                    message: "User login successfully",
                    data: token,
                  };
        } else {
            return {
              status: false,
              message: "Incorrect Password",
             
            };
        }
    } else {
        return {
            status: false,
            message: "No user found",
           
          };
    }
    } catch (error) {
        console.log(error);
        return{
            status : false,
            message : "User login failed",
            error : error?.toString(),
        } 
    }
};

const checkUserExist = async (query) => {
    let messages = {
      email: "User already exist",
      username: "This username is taken",
    };
    try {
      let queryType = Object.keys(query)[0];
      let userObject = await MongoDB.db
        .collection(mongoConfig.collections.USERS)
        .findOne(query);
      return !userObject
        ? { status: true, message: `This ${queryType} is not taken` }
        : { status: false, message: messages[queryType] };
    } catch (error) {}
  };

module.exports = {userRegister, userLogin , checkUserExist }