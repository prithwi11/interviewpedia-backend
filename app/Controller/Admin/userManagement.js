module.exports = class userManagementController {
    constructor() {
        const userManagementModel = require('../../Model/Admin/model.user-management')
        this.userManagementModelObj = new userManagementModel()
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
            const firstName = req.body.firstName
            const lastName = req.body.lastName
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
                        first_name : firstName,
                        last_name : lastName,
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
}