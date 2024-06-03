module.exports = class userManagementController {
    constructor() {
        const userManagementModel = require('../../Model/Admin/model.user-management')
        this.userManagementModelObj = new userManagementModel()

        const otpManagementModel = require('../../Model/Admin/model.otp.management')
        this.otpManagementModelObj = new otpManagementModel()
    }

    /**
     * @Developer : Prithwiraj Bhadra
     * @Description : This function is used to login
     * @Date : 26.04.2024
     */

    adminUserLogin = async(req, res) => {
        try {
            const { email, password } = req.body
            let conditionObj = {
                where : {
                    email : email,
                }
            }
            const user = await this.userManagementModelObj.findByAnyOne(conditionObj)

            if (user) {
                const comparePassword = await global.Helpers.comparePassword(password, user.password)
                if (comparePassword) {
                    let userDetails = {
                        user_id : user.user_id,
                        first_name : user.first_name,
                        last_name : user.last_name,
                        email : user.email,
                        password : user.password,
                        user_type : user.user_type,
                        status : user.status

                    }
                    let token = await global.Helpers.createToken(userDetails);
                    userDetails.token = token
                    global.Helpers.successStatusBuild(res, userDetails, 'Login successfully')
                }
                else {
                    global.Helpers.badRequestStatusBuild(res, 'Invalid password')    
                }
                
            } else {
                global.Helpers.badRequestStatusBuild(res, 'Invalid email')
            }
        }
        catch (e) {
            console.log(e)
            global.Helpers.badRequestStatusBuild(res, 'Some error occurred!')
        }
    }

    /**
     * @Developer : Prithwiraj Bhadra
     * @Function : Add new user
     * @Date : 26.04.2024
     */

    addNewUser = async(req, res) => {
        try {
            const email = req.body.email
            const password = await global.Helpers.hashPassword(req.body.password)
            const userType = req.body.userType

            let condition = {
                where : {
                    email : email
                }
            }
            try {
                const checkUserByEmail = await this.userManagementModelObj.findByAnyOne(condition)
                if (checkUserByEmail) {
                    global.Helpers.badRequestStatusBuild(res, 'User already exists')
                }
                else {
                    const insertObj = {
                        email : email,
                        password : password,
                        user_type : userType,
                    }
                    const insertUser = await this.userManagementModelObj.addNewRecord(insertObj)
                    global.Helpers.successStatusBuild(res, 'User added successfully', insertUser)
                }
            }
            catch (e) {
                console.log('Error in finding Email', e)
                global.Helpers.badRequestStatusBuild(res, 'Some error occurred!')
            }
                    
        }
        catch (e) {
            console.log(e)
            global.Helpers.badRequestStatusBuild(res, 'Some error occured!')
        }
    }

    createVerification = async(req, res) => {
        try {
            let email = req.body.email
            let userId = req.body.userId
            let verificationCode = global.Helpers.generateRandomNumber()

            const checkUser = await this.userManagementModelObj.findByAnyOne({where : {email : email, status : 'active'}})
            if (checkUser) {    
                const subject = "Verification Code for Sign up"
                const message = "Your verification code is : " + verificationCode

                const sendEmail = await global.Helpers.sendEmail(email, message, subject)
                if (sendEmail) {
                    const verificationObj = {
                        verification_code : verificationCode,
                        fk_user_id : userId,
                        status : 'pending'
                    }

                    const checkVerification = await this.otpManagementModelObj.findByAnyOne({where : {fk_user_id : userId}})
                    if (checkVerification) {
                        if (checkVerification.status == 'verified') {
                            global.Helpers.badRequestStatusBuild(res, 'User already verified')
                        }
                        else {
                            const updateVerification = await this.otpManagementModelObj.updateAnyRecord(verificationObj, {where : {fk_user_id : userId}})
                            
                            const updateUser = await this.userManagementModelObj.updateAnyRecord({is_verified : 0}, {where : {userId : userId}})
                        }
                    }
                    else {
                        const insertVerification = await this.otpManagementModelObj.addNewRecord(verificationObj)
                    }
                    global.Helpers.successStatusBuild(res, userId, 'Verification code sent successfully')
                }
            }
            else {
                global.Helpers.badRequestStatusBuild(res, 'User not found!')
            }
        }
        catch (e) {
            console.log(e)
            global.Helpers.badRequestStatusBuild(res, 'Some error occured!')
        }
    }

    checkVerification = async(req,res) => {
        try {
            const verificationCode = req.body.verificationCode
            const userId = req.body.userId
            
            const checkUserExists = await this.userManagementModelObj.findByAnyOne({where : {user_id : userId}})
            if (checkUserExists) {
                const checkVerification = await this.otpManagementModelObj.findByAnyOne({where : {fk_user_id : userId, verification_code : verificationCode}})

                if (checkVerification) {

                    const updateVerification = await this.otpManagementModelObj.updateAnyRecord({status : 'verified'}, {where : {fk_user_id : userId}})
                    const updateUser = await this.userManagementModelObj.updateAnyRecord({is_verified : 1}, {where : {user_id : userId}})
                    if (updateVerification && updateUser) {
                        global.Helpers.successStatusBuild(res, 'Verification successful!')
                    }
                    else {
                        global.Helpers.badRequestStatusBuild(res, 'Some error occurred!')
                    }
                }
                else {
                    global.Helpers.badRequestStatusBuild(res, 'Verification code is not valid!')
                }
            }
            else {
                global.Helpers.badRequestStatusBuild(res, 'User not found!')
            }
        }
        catch (e) {
            console.log(e)
            global.Helpers.badRequestStatusBuild(res, 'Some error occured!')
        }
    }

    loginUser = async(req, res) => {
        try {
            const {email, password} = req.body
            const checkUserExists = await this.userManagementModelObj.findByAnyOne({where : {email : email}})
            if (checkUserExists) {
                const checkPassword = global.Helpers.comparePassword(password, checkUserExists.password)
                if (checkPassword) {
                    if (checkUserExists.is_verified !== 1) {
                        global.Helpers.badRequestStatusBuild(res, 'Please verify your account!', checkUserExists)
                    }
                    else {
                        const token = global.Helpers.createToken(checkUserExists)
                        global.Helpers.successStatusBuild(res, 'Login successful!', {token : token, user : checkUserExists})
                    }
                }
                else {
                    global.Helpers.badRequestStatusBuild(res, 'Password is not valid!', checkUserExists)
                }
            }
            else {
                global.Helpers.badRequestStatusBuild(res, 'User not found!')
            }
        }
        catch (e) {
            console.log(e)
            global.Helpers.badRequestStatusBuild(res, 'Some error occured!')
        }
    }
}