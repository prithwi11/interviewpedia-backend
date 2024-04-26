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
                    password : password
                }
            }
            const user = await this.userManagementModelObj.findByAnyOne(conditionObj)

            if (user) {
                global.Helpers.successStatusBuild(res, 'Login successfully', user)
            } else {
                global.Helpers.badRequestStatusBuild(res, 'Invalid email or password')
            }
        }
        catch (e) {
            console.log(e)
            global.Helpers.badRequestStatusBuild(res, 'Some error occurred!')
        }
    }
}