module.exports = class ValidatorCls {
    constructor() {
        const { validationResult } = require('express-validator')
        this.validationResult = validationResult
    }

    checkforerrors = async(req,res,next)=>{
        const errors = this.validationResult(req);
        if (!errors.isEmpty()) {
            let api_var = {
                'version': global.CONFIG.constants.API_VERSION,
                'developer': global.CONFIG.constants.API_DEVELOPER
            };
            let response_raws = {};
            let errorVal = errors.array();
            response_raws.message = errorVal[0].msg;
            response_raws.data = errors.array();
            response_raws.publish = api_var;
            if(errorVal[0].msg == 'Please update your app.') {
                res.status(global.CONFIG.constants.HTTP_RESPONSE_UPGRADE_REQUIRED);
            } else {
                res.status(global.CONFIG.constants.HTTP_RESPONSE_BAD_REQUEST);
            }
            res.send({ response: response_raws});
        } else {   
            next();
        }
    }

    validateFormData = async (req, res, next) => {
        if (typeof (req.body.loginDetails) == 'undefined') {
            req.body.loginDetails = {};
        }
        let localObj = {};

        localObj = req.body;
        let checkMultiparty = 0;
        if (typeof (req.body.loginDetails) != 'undefined') {
            if (Object.keys(req.body).length == 1) {
                //ONLY LOGIN DETAILS EXIST
                checkMultiparty = 1;
            }
        }
        
        if (checkMultiparty == 1) {
            let checkform = (callback) => {
                let sendData = {};
                let multiparty = require('multiparty');
                let form = new multiparty.Form();
                form.parse(req, function (err, fields, files) {
                    if(typeof(fields) != 'undefined'){
                        if(Object.keys(fields).length>0) {
                            Object.keys(fields).forEach(function (key) {
                                sendData[key] = fields[key][0];
                            });
                        }
                    }
                    else{
                        global.Helpers.notAcceptableStatusBuild(res,'Content type mismatch');
                        return; 
                    }

                    if(typeof(files) != 'undefined'){
                        if(Object.keys(files).length>0) {
                            Object.keys(files).forEach(function (key) {
                                sendData[key] = files[key];
                            });
                        }
                    }
                    else{
                        global.Helpers.notAcceptableStatusBuild(res,'Content type mismatch'); 
                        return;
                    }
                    callback(sendData);
                });
            }

            let callbackfun = (sendData) => {
                sendData['loginDetails'] = localObj.loginDetails;
                req.body = sendData;
                next();
            }
            checkform(callbackfun);
        } else {
            next();
        }
    }

    validateToken = async (req, res, next) => {
        let token = req.headers['authorization'];
        if (token) {
            if (token.startsWith('Bearer ') || token.startsWith('bearer ')) {
                // Remove Bearer from string
                token = token.slice(7, token.length);
            }

            // decode token
            if (token) {
                global.Helpers.verifyToken(token)
                    .then(async jwtDecres => {
                        //Decryption Of User_id From LoginDetails
                        // let user_id = await global.Helpers.decryptId(jwtDecres.user_id);
                        // jwtDecres.user_id = user_id;
                        req.body.loginDetails = jwtDecres;
                        next();
                    }).catch(async err => {
                        global.Helpers.forbiddenStatusBuild(res, 'Invalid Token. Access Forbidden.');
                    });
            } else {
                global.Helpers.forbiddenStatusBuild(res, 'Invalid Token. Access Forbidden.');
            }
        } else {
            global.Helpers.forbiddenStatusBuild(res, 'Invalid Token. Access Forbidden.');
        }
    }
}