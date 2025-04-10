module.exports = class userController {
    constructor() {
        const userProfileModel = require('../../Model/User/model.user_profile')
        const userCertificationModel = require('../../Model/User/model.user.certifications')
        const userEducationModel = require('../../Model/User/model.user.education')
        const userExperienceModel = require('../../Model/User/model.user.experience')
        const userSkillsModel = require('../../Model/User/model.user.skills')
        const userModel = require('../../Model/Admin/model.user-management')

        this.userProfileModelObj = new userProfileModel()
        this.userCertificationModelObj = new userCertificationModel()
        this.userEducationModelObj = new userEducationModel()
        this.userExperienceModelObj = new userExperienceModel()
        this.userSkillsModelObj = new userSkillsModel()
        this.userModel = new userModel()
    }

    getUserAllDetails = async(req, res) => {
        try {
            const userId = req.body.userId
            const conditionObj = {where : {fk_user_id : userId}}
            let userData = {}

            const userBasicDetails = await this.userModel.findAllByAny({attributes : ['email', 'added_timestamp', 'user_type'], where : {user_id : userId, status : 'active', is_verified : '1'}})
            const userProfileDetails = await this.userProfileModelObj.findAllByAny(conditionObj)
            const userCertificationsDetails = await this.userCertificationModelObj.findAllByAny(conditionObj)
            const userEducationDetails = await this.userEducationModelObj.findAllByAny(conditionObj)
            const userExperienceDetails = await this.userExperienceModelObj.findAllByAny(conditionObj)
            const userSkillsDetails = await this.userSkillsModelObj.findAllByAny(conditionObj)

            if (userBasicDetails.length > 0) {
                userData['basicDetails'] = userBasicDetails
                userData['profileDetails'] = userProfileDetails
                userData['certificationDetails']= userCertificationsDetails
                userData['educationDetails'] = userEducationDetails
                userData['experienceDetails'] = userExperienceDetails
                userData['skillsDetails'] = userSkillsDetails
                global.Helpers.successStatusBuild(res, userData, 'User details fetched successfully!')
            }
            else {
                global.Helpers.successStatusBuild(res, 'No user found!')
            }
        }
        catch (e) {
            console.log(e)
            global.Helpers.badRequestStatusBuild(res, 'Some error occurred!')
        }
    }

    updateProfile = async(req, res) => {
        try {
            const userId = req.body.userId
            const updateData = {
                full_name : req.body.full_name,
                contact_number : req.body.contact_number,
                location : req.body.location,
                job_title : req.body.job_title,
                company : req.body.company,
                years_of_experience : req.body.years_of_experience,
                preferred_learning_method : req.body.preferred_learning_method
            }

            if (req.body.profile_id) {
                const profileId = req.body.profile_id
                const conditionObj = {where : {fk_user_id : userId, profile_id : profileId}}
                updateData.updated_timestamp = global.Helpers.getCurrentTimestampUTC()
                await this.userProfileModelObj.updateAnyRecord(updateData, conditionObj)
            } 
            else { 
                updateData.fk_user_id = userId
                updateData.added_timestamp = global.Helpers.getCurrentTimestampUTC()
                await this.userProfileModelObj.addNewRecord(updateData)
            }

            global.Helpers.successStatusBuild(res, 'Profile updated successfully')
        }
        catch (e) {
            console.log(e)
            global.Helpers.badRequestStatusBuild(res, "some error occurred!")
        }
    }

    updateUserExperience = async(req, res) => {
        try {
            const userExperienceData = req.body.userExperienceData
            const conditionObj = {where : {fk_user_id : userId}}
            let experienceArr = []

            const deleteOldRecords = await this.userExperienceModelObj.deleteByAny(conditionObj)
            for (let expIndex = 0; expIndex < userExperienceData.length; expIndex++) {
                let experienceData = userExperienceData[expIndex]
                let experienceObj = {
                    fk_user_id : req.body.userId,
                    company : experienceData['company'],
                    role : experienceData['role'],
                    start_date : experienceData['start_date'],
                    end_date : experienceData['end_date'],
                    responsibilities : experienceData['responsibilities']
                }
                experienceArr.push(experienceObj)
            }

            const insertRecords = await this.userExperienceModelObj.addbulkRecord(experienceArr)
            if (insertRecords) {
                global.Helpers.successStatusBuild(res, 'Experience Updated Successfully')
            }
            
        }
        catch (e) {
            console.log(e)
            global.Helpers.badRequestStatusBuild(res, 'Some error occurred!')
        }
    }

    updateUserEducation = async(req, res) => {
        try {
            const userEducationData = req.body.userEducationData
            const conditionObj = {where : {fk_user_id : userId}}
            let educationArr = []

            const deleteOldRecords = await this.userEducationModelObj.deleteByAny(conditionObj)
            for (let educationIndex = 0; educationIndex < userEducationData.length; educationIndex++) {
                let educationData = usereducationData[educationIndex]
                let educationObj = {
                    fk_user_id : req.body.userId,
                    degree : educationData['degree'],
                    institution : educationData['institution'],
                    graduation_year : educationData['graduation_year']
                }
                educationArr.push(educationObj)
            }

            const insertRecords = await this.userEducationModelObj.addbulkRecord(educationArr)
            if (insertRecords) {
                global.Helpers.successStatusBuild(res, 'Experience Updated Successfully')
            }
            
        }
        catch (e) {
            console.log(e)
            global.Helpers.badRequestStatusBuild(res, 'Some error occurred!')
        }
    }

    updateUserCertification = async(req, res) => {
        try {
            const userCertificationData = req.body.userCertificationData
            const conditionObj = {where : {fk_user_id : userId}}
            let certificationArr = []

            const deleteOldRecords = await this.userCertificationModelObj.deleteByAny(conditionObj)
            for (let certIndex = 0; certIndex < userCertificationData.length; certIndex++) {
                let certificationData = userCertificationData[certIndex]
                let certificationObj = {
                    fk_user_id : req.body.userId,
                    name : certificationData['name'],
                    issuing_organization : certificationData['issuing_organization'],
                    issue_date : certificationData['issue_date'],
                }
                certificationArr.push(certificationObj)
            }

            const insertRecords = await this.userCertificationModelObj.addbulkRecord(certificationArr)
            if (insertRecords) {
                global.Helpers.successStatusBuild(res, 'Certification Updated Successfully')
            }
            
        }
        catch (e) {
            console.log(e)
            global.Helpers.badRequestStatusBuild(res, 'Some error occurred!')
        }
    }

    updateUserSkill = async(req, res) => {
        try {
            const userSkillData = req.body.userSkillData
            const conditionObj = {where : {fk_user_id : userId}}
            let skillArr = []

            const deleteOldRecords = await this.userSkillsModelObj.deleteByAny(conditionObj)
            for (let skillIndex = 0; skillIndex < userSkillData.length; skillIndex++) {
                let skillData = userSkillData[skillIndex]
                let skillObj = {
                    fk_user_id : req.body.userId,
                    skill_name : skillData['skill_name'],
                    proficiency_level : skillData['proficiency_level'],
                    type : skillData['type'],
                }
                skillArr.push(skillObj)
            }

            const insertRecords = await this.userSkillsModelObj.addbulkRecord(skillArr)
            if (insertRecords) {
                global.Helpers.successStatusBuild(res, 'Skill Updated Successfully')
            }
            
        }
        catch (e) {
            console.log(e)
            global.Helpers.badRequestStatusBuild(res, 'Some error occurred!')
        }
    }

    deleteAnyField = async(req, res) => {
        try {
            const userId = req.body.userId
            const type = req.body.type
            const conditionObj = {where : {fk_user_id : userId}}

            if (type == 'education') {
                const deleteOldRecords = await this.userEducationModelObj.deleteByAny(conditionObj)
            }
            else if (type == 'certification') {
                const deleteOldRecords = await this.userCertificationModelObj.deleteByAny(conditionObj)
            }
            else if (type == 'experience') {
                const deleteOldRecords = await this.userExperienceModelObj.deleteByAny(conditionObj)
            }
            else if (type == 'skills') {
                const deleteOldRecords = await this.userSkillsModelObj.deleteByAny(conditionObj)
            }
            else {
                global.Helpers.badRequestStatusBuild(res, 'Some error occurred!')    
            }

            if (deleteOldRecords) {
                global.Helpers.successStatusBuild(res, 'Deleted successfully!')
            }

        }
        catch (e) {
            console.log(e)
            global.Helpers.badRequestStatusBuild(res, 'Some error occurred!')
        }
    }
}