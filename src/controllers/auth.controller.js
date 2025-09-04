// const httpStatus = require("http-status")
const {IsUserPresentUsingEmailService, CreateNewUserService} = require("./../services/user.service")
const {CreateNewOrganizationService} = require("./../services/organization.service")
require("dotenv").config()
const jwt = require('jsonwebtoken')

const NODE_ENV = process.env.NODE_ENV

const JWT_SECRET_KEY = process.env[`${NODE_ENV}_JWT_SECRET_KEY`]

const bcrypt = require('bcrypt')

const SignupController = async (req, res)=>{
    try{

        const {fullName, email, password} = req.body

        if(!fullName){
            const err = new Error("fullName is required in the body")
            err.statusCode = 400
            throw err
        }

        if(!email){
            const err = new Error("email is required in the body")
            err.statusCode = 400
            throw err
        }

        if(!password){
            const err = new Error("password is required in the body")
            err.statusCode = 400
            throw err
        }


        // if user is already present, then return error
        const IsUserPresentUsingEmailServiceResult = await IsUserPresentUsingEmailService(email)
        if(IsUserPresentUsingEmailServiceResult.success){
            const err = new Error("User already present")
            err.statusCode = 400
            throw err
        }

        // The old logic for checking personal vs. business emails is removed.
        // Now, we create a personal organization for every new user.

        // 1. Create a personal organization for the new user.
        const organizationName = `${fullName}'s Organization`;
        // We pass `null` for the domain, as it's a personal workspace.
        const CreateNewOrganizationServiceResult = await CreateNewOrganizationService(null, organizationName);

        if (!CreateNewOrganizationServiceResult.success) {
            const err = new Error(`Unable to create personal organization for user: ${email}`);
            err.statusCode = 500;
            throw err;
        }

        const organizationId = CreateNewOrganizationServiceResult.data._id;
        // The user is the admin of their own personal organization.
        const organizationRole = "ORG_ADMIN";

        // 2. Create the user.
        const salt = await bcrypt.genSalt()
        const encryptedPassword = await bcrypt.hash(password, salt)

        const CreateNewUserServiceResult = await CreateNewUserService(fullName, email, encryptedPassword, organizationId, organizationRole)

        if(!CreateNewUserServiceResult.success){
            const err = new Error(`Unable to create user with email : ${email}`)
            err.statusCode = 500
            throw err
        }

        const {fullName : fullNameDB, email : emailDB, organizationId : organizationIdDB, _id : userId} = CreateNewUserServiceResult.data

        res.status(201).json({
            success : true,
            message : "User is created",
            data : {
                fullname : fullNameDB,
                email : emailDB,
                organizationId : organizationIdDB,
                userId
            }
        });
        

    }catch(err){
        console.log(`Error in SignupController with err : ${err}`)
        res.status(err.statusCode ? err.statusCode : 500).json({
            success : false,
            message : err.message
        })
    }
}

const SigninController = async (req, res)=>{
    try{

        const {email, password} = req.body


        if(!email){
            const err = new Error("email is required in the body")
            err.statusCode = 400
            throw err
        }

        if(!password){
            const err = new Error("password is required in the body")
            err.statusCode = 400
            throw err
        }  
        
        // If user is already present, then return error
        const IsUserPresentUsingEmailServiceResult = await IsUserPresentUsingEmailService(email)
        if(!IsUserPresentUsingEmailServiceResult.success){
            const err = new Error("Invalid Credentials")
            err.statusCode = 400
            throw err
        }

        const {data : {fullName : fullNameInDB, email : emailInDB, password : encryptedPasswordInDB, _id : userIdInDB, organizationId : organizationIdInDB, role : roleInDB}} = IsUserPresentUsingEmailServiceResult

        const passwordCheck = await bcrypt.compare(password, encryptedPasswordInDB)

        if(!passwordCheck){
            const err = new Error("Invalid Credentials")
            err.statusCode = 400
            throw err
        }

        // generate token for the user, and return back the token to the user
        const payload = {
            userId : userIdInDB,
            role : roleInDB
        }

        const token = await jwt.sign(payload, JWT_SECRET_KEY, {expiresIn : '24h'})

        res.status(201).json({
            success : true,
            token : token
        })

    }catch(err){
        console.log(`Error in SigninController with err : ${err}`)
        res.status(err.statusCode ? err.statusCode : 500).json({
            success : false,
            message : err.message
        })
    }
}

module.exports = {
    SignupController,
    SigninController
}
