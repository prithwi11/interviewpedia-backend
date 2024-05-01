const { resolve } = require('path');

const commonFunc = class CommonCls {
	constructor() {
		// this.jwt = require('jsonwebtoken');
		this.bcrypt = require('bcrypt');
		// const Cryptr = require('cryptr');		
		// const util = require('util');
		// const fs = require('fs');						
		// this.crypto = require("crypto");
		// this.fetch = require('node-fetch');
		// this.readFile = util.promisify(fs.readFile);
		// this.cryptr = new Cryptr('1');

		// const userLoginTokensModel = require('../app/api/models/customerModels/model.customer_login_tokens');
        // this.userLoginTokensModel = new userLoginTokensModel();

		//Starts of connection with email transporter
		const connection = require("../config/configuration");
		this.mailTransportObj = new connection;
		// this.mailTransportObj.transporter();
		//Ends of connection with email transporter
        console.log('constant', process.env.APP_ENV)
		this.api_var = {
			'version': global.CONFIG.constants.API_VERSION,
			'developer': global.CONFIG.constants.API_DEVELOPER
		};
	}

	// For Token Creation
	createToken(userdtls) {
		let jwtToken = this.jwt.sign(userdtls, global.CONFIG.JWTSETTINGS.accessTokenKey, {
			algorithm: global.CONFIG.JWTSETTINGS.jwtAlgorithm,
			expiresIn: global.CONFIG.JWTSETTINGS.accessTokenExpire
		});
		return jwtToken;
	}

	// For Token Creation
	createRefreshToken(userdtls) {
		let jwtToken = this.jwt.sign(userdtls, global.CONFIG.JWTSETTINGS.refreshTokenKey, {
			algorithm: global.CONFIG.JWTSETTINGS.jwtAlgorithm,
			expiresIn: global.CONFIG.JWTSETTINGS.refreshTokenExpire
		});
		return jwtToken;
	}

	// For Token Verify
	verifyToken(token) {
		let that = this;
		return new Promise(function (resolve, reject) {
			that.jwt.verify(token, global.CONFIG.JWTSETTINGS.accessTokenKey, global.CONFIG.JWTSETTINGS.jwtAlgorithm, function (err, result) {
				
				if (result)
					return resolve(result);
				else
					return reject(err);
			});
		});
	}

	// For Refresh Token Verify
	verifyRefreshToken(token) {
		let that = this;
		return new Promise(function (resolve, reject) {
			that.jwt.verify(token, global.CONFIG.JWTSETTINGS.refreshTokenKey, global.CONFIG.JWTSETTINGS.jwtAlgorithm, function (err, result) {
				
				if (result)
					return resolve(result);
				else
					return reject(err);
			});
		});
	}

	// For Expired Token Verify
	ExpverifyToken(token) {
		let that = this;
		return new Promise(function (resolve, reject) {
			that.jwt.verify(token, global.CONFIG.JWTSETTINGS.accessTokenKey, global.CONFIG.JWTSETTINGS.jwtAlgorithm, function (err, result) {
				
				if (result)
					return resolve(result);
				else
				if(err.message == "jwt expired"){
					return resolve(global.Helpers.removeBearer(token));
				} else {
					return reject(err);
				}
					
			});
		});

	}

	// CREATE UNIQUE USER NAME
	uniqueCSUsername(id){
		let userName = '';
		if(id <= 9){
			userName = global.CONFIG.UNIQUE_INITIALS.CS_USERNAME+"00"+id;
		} else if(id >= 10 && id <= 99) {
			userName = global.CONFIG.UNIQUE_INITIALS.CS_USERNAME+"0"+id
		} else {
			userName = global.CONFIG.UNIQUE_INITIALS.CS_USERNAME+id
		}
		return userName;
	}

	// CREATE UNIQUE USER NAME
	uniquePropertyID(id){
		let propertyid = 0;
		if(id <= 9){
			propertyid = global.CONFIG.UNIQUE_INITIALS.PROPERTY_ID+"000"+id;
		} else if(id >= 10 && id <= 99) {
			propertyid = global.CONFIG.UNIQUE_INITIALS.PROPERTY_ID+"00"+id
		} else if(id >= 100 && id <= 999) {
			propertyid = global.CONFIG.UNIQUE_INITIALS.PROPERTY_ID+"0"+id
		} else {
			propertyid = global.CONFIG.UNIQUE_INITIALS.PROPERTY_ID+id
		}
		return propertyid;
	}

	TokenExpiryDate(token) {
		const moment = require('moment-timezone');
		let date = new Date();
		const dateNew = moment.utc(date, null).tz(process.env.TZ).add(global.CONFIG.JWTSETTINGS.accessToken_DB_expTime, 'second').format('YYYY-MM-DD HH:mm:ss');
		return dateNew
	}

	RefreshTokenExpiryDate(token) {
		const moment = require('moment-timezone');
		let date = new Date();
		const dateNew = moment.utc(date, null).tz(process.env.TZ).add(global.CONFIG.JWTSETTINGS.refreshToken_DB_expireTime, 'second').format('YYYY-MM-DD HH:mm:ss');
		return dateNew
	}

	verifyPrimaryToken(p_token) {
		let verifyStatus = false;
		if(global.CONFIG.primary_auth.CS_BEARER_TOKEN == p_token) {
			verifyStatus = true;
		}
		return verifyStatus;
	}

	// For Password Encryption
	hashPassword(passsword) {
		let salt = this.bcrypt.genSaltSync(10);
		let hash = this.bcrypt.hashSync(passsword, salt);
		return hash;
	}


	// For Password Decryption
	comparePassword(password, hash) {
		let comparePwdStatus = false;
		if (this.bcrypt.compareSync(password, hash)) {
			comparePwdStatus = true;
		}
		return comparePwdStatus;
	}

	// For Remove Bearer
	removeBearer(token) {
		if (token.startsWith('Bearer ') || token.startsWith('bearer ')) {
			// Remove Bearer from string
			token = token.slice(7, token.length);
		}
		return token;
	}

	numberToUuid = (num) => {
		const { v5: uuidv5, v4: uuidv4 } = require('uuid');
		const hex = num.toString(16);
		const uuid = uuidv5(hex, uuidv4());
		return uuid;
	}

	// id encryption
	encryptId(id) {
		const encryptedId = this.cryptr.encrypt(id);
		return encryptedId;
	}

	// ID Decryption
	decryptId(encId) {
		const decryptedId = this.cryptr.decrypt(encId);
		return decryptedId;
	}

	// ENCRYPTION FOR FORGOT PASS LINK
	encryptedInput(input) {
		// The CipherIV methods must take the inputs as a binary / buffer values.
		let binaryEncryptionKey = new Buffer.from( global.CONFIG.crypto.EncKey, "base64" );
		let binaryIV = new Buffer.from( global.CONFIG.crypto.IntVector, "base64" );
		let cipher = this.crypto.createCipheriv( "AES-128-CBC", binaryEncryptionKey, binaryIV );

		// When encrypting, we're converting the UTF-8 input to base64 output.
		let encryptedInput = (
			cipher.update( input, "utf8", "base64" ) +
			cipher.final( "base64" )
		);
		return encryptedInput;
	}

	// DECRYPTION OF FORGOT PASS LINK
	decryptedOutput(encryptedInput) {
		// The CipherIV methods must take the inputs as a binary / buffer values.
		let binaryEncryptionKey = new Buffer.from( global.CONFIG.crypto.EncKey, "base64" );
		let binaryIV = new Buffer.from( global.CONFIG.crypto.IntVector, "base64" );
		let decipher = this.crypto.createDecipheriv( "AES-128-CBC", binaryEncryptionKey, binaryIV );
		try {
			// When decrypting we're converting the base64 input to UTF-8 output.
			let decryptedInput = (
				decipher.update( encryptedInput, "base64", "utf8" ) +
				decipher.final( "utf8" )
			);
			return decryptedInput;
		} catch (error) {
			return false;
		}
	}

	startsWith(value){
		return value.trim()+"%";
	}
	contains(value){
		return "%"+value.trim()+"%";
	}
	notContains(value){
		return "%"+value.trim()+"%";
	}
	endsWith(value){
		return "%"+value.trim();
	}
	equals(value){
		return value.trim();
	}
	notEquals(value){
		return value.trim();
	}
	globalFilter(value){
		let stats = "%"+value+"%";
		if(typeof value === 'string') {
			stats = "%"+value.trim()+"%";
		}
		return stats;
	}
	checkWhiteSpaceNullBlank(checkStr){
		let retval = true;
		if(checkStr === null){
			retval = false;
		} else if(typeof checkStr === 'string'){
			if(checkStr.trim() == ""){
				retval = false;
			}
		}
		return retval;
	}

	getCurrentTimestampUTCunix() {
		let utc = Math.floor(Date.now() / 1000)
		return utc;
	  }

	// For Modified Date
	getCurrentTimestampUTC() {
		let moment = require('moment-timezone');
		let date = new Date();
		const dateNew = moment.utc(date, null).tz(process.env.TZ).format('YYYY-MM-DD HH:mm:ss');
		return dateNew
	}
	// For Modified Date
	getCurrentTimestampUTCforFILE_NAME() {
		let moment = require('moment-timezone');
		let date = new Date();
		const dateNew = moment.utc(date, null).tz(process.env.TZ).format('YYYY-MM-DD-HH-mm-ss');
		return dateNew
	}
	getDateOnly(date) {
		let moment = require('moment-timezone');
		date = new Date(date);
		const dateNew = moment.utc(date, null).tz(process.env.TZ).format(global.CONFIG.DATE_FORMAT[3]);
		return dateNew
	}
	getDateTimeOnly(date) {
		let moment = require('moment-timezone');
		date = new Date(date);
		const dateNew = moment.utc(date, null).tz(process.env.TZ).format(global.CONFIG.DATE_FORMAT[4]);
		return dateNew
	}
	getTimeOnly(date) {
		let moment = require('moment-timezone');
		date = new Date(date);
		const dateNew = moment.utc(date, null).tz(process.env.TZ).format('HH:mm a');
		return dateNew
	}

	getDateTimeOnlyWithFormat(date, format_type) {
		let moment = require('moment-timezone');
		date = new Date(date);
		const dateNew = moment.utc(date, null).tz(process.env.TZ).format(global.CONFIG.DATE_FORMAT[format_type]);
		return dateNew
	}

	secondsToHourAndMin(totalSeconds){
		const totalMinutes = Math.floor(totalSeconds / 60);
		const hours = Math.floor(totalMinutes / 60);
		const minutes = totalMinutes % 60;
		let time = hours+'h '+minutes+'m'
		return time;
	}

	transactionExpireTime() {
		let moment = require('moment-timezone');
		let date = new Date();
		const dateNew = moment.utc(date, null).add(15, 'minute').tz(process.env.TZ).format('YYYY-MM-DD HH:mm:ss');
		
		return dateNew;
	}
	
	badRequestStatusBuild(res, msg, dataset = []) {
		let response_raws = {};
		if (Object.keys(dataset).length === 0) {
			dataset = {};
		}
		response_raws.data = dataset;
		this.status = {
			'message': msg,
			'action_status': false
		};
		response_raws.status = this.status;
		response_raws.publish = this.api_var;
		response_raws.status_code = global.CONFIG.constants.HTTP_RESPONSE_BAD_REQUEST
		// res.status(global.CONFIG.constants.HTTP_RESPONSE_BAD_REQUEST);
		res.send({ response: response_raws});
	}

	unauthorizedStatusBuild(res, msg,dataset = []) {
		let response_raws = {};
		response_raws.message = msg;
		if (Object.keys(dataset).length === 0) {
			dataset = {};
		}
		response_raws.data = dataset;
		response_raws.publish = this.api_var;
		res.status(global.CONFIG.constants.HTTP_RESPONSE_UNAUTHORIZED);
		res.send({ response: response_raws});
	}

	forbiddenStatusBuild(res, msg,dataset = []) {
		let response_raws = {};
		if (Object.keys(dataset).length === 0) {
			dataset = {};
		}
		response_raws.data = dataset;
		this.status = {
			'message': msg,
			'action_status': false
		};
		response_raws.status = this.status;
		response_raws.publish = this.api_var;
		res.status(global.CONFIG.constants.HTTP_RESPONSE_UNAUTHORIZED);
		res.send({ response: response_raws});
	}

	successStatusBuild(res, dataset, msg) {
		let response_raws = {};
		if (Object.keys(dataset).length === 0) {
			dataset = {};
		}
		response_raws.data = dataset;
		this.status = {
			'message': msg,
			'action_status': true
		};
		response_raws.status = this.status;
		response_raws.publish = this.api_var;
		res.status(global.CONFIG.constants.HTTP_RESPONSE_OK);
		res.send({ response: response_raws});
	}

	notAcceptableStatusBuild(res, msg) {
		let response_raws = {};
		let response_dataset = [];
		response_raws.message = msg;
		response_raws.data = response_dataset;
		response_raws.publish = this.api_var;
		res.status(global.CONFIG.constants.HTTP_RESPONSE_NOT_ACCEPTABLE);
		res.send({ response: {"raws":response_raws}});
	}

	methodNotAllowedStatusBuild(res, msg) {
		let response_raws = {};
		let response_dataset = [];
		response_raws.message = msg;
		response_raws.data = response_dataset;
		response_raws.publish = this.api_var;
		res.setHeader('content-type', 'application/json');
		res.status(global.CONFIG.constants.HTTP_RESPONSE_METHOD_NOT_ALLOWED);
		res.send({ response: {"raws":response_raws}});
	}
	
	upgradeRequiredStatusBuild(res, msg, dataset = []) {
		let response_raws = {};
		response_raws.message = msg;
		if (Object.keys(dataset).length === 0) {
			dataset = [];
		}
		response_raws.data = dataset;
		response_raws.publish = this.api_var;
		res.status(global.CONFIG.constants.HTTP_RESPONSE_UPGRADE_REQUIRED);
		res.send({ response: {"raws":response_raws}});
	}
	
	//4 digit random number for otp
	async randomNumber() {
		let ranNum = Math.floor(1000 + Math.random() * 9000);
		return ranNum;
	}

	async randomNumber6Dig() {
		let ranNum = Math.floor(100000 + Math.random() * 900000);
		return ranNum;
	}

	randomPaswordGenerator() {
		var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
		var string_length = 8;
		var randomstring = '';
		for (var i = 0; i < string_length; i++) {
			var rnum = Math.floor(Math.random() * chars.length);
			randomstring += chars.substring(rnum, rnum + 1);
		}
		return randomstring;
	}

	async createTransactionId(data) {
		let unixToHex = data.toString(16).toUpperCase(); // UNIX TO HEX OF LENGTH 8
		let ranNumPrefix = this.crypto.randomBytes(6).toString('hex').toUpperCase().substring(0, 11); // LENGTH 11
		let ranNumSuffix = this.crypto.randomBytes(6).toString('hex').toUpperCase().substring(0, 11); // LENGTH 11
		let finalString = ranNumPrefix + unixToHex + ranNumSuffix
		
		return finalString;
	}

	// For Token Verify
	verifyTokenForRegenerate(token) {
		let that = this;
		return new Promise(function (resolve, reject) {
			that.jwt.verify(token, global.CONFIG.JWTSETTINGS.accessTokenKey, global.CONFIG.JWTSETTINGS.jwtAlgorithm, function (err, result) {
				if (result)
					return resolve({ error: false, result: result });
				else
					return resolve({ error: true, result: err.name });
			});
		});

	}


	decrypt = async(finalEnc)=>{
		let temp = finalEnc.replace("ft", "");

		if (temp == finalEnc) {
			return false;
		}

		finalEnc = temp;
		let alphabets = ["G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"];
		let alphabets1 = ["g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z"];

		for (let i = 0; i < alphabets.length; i++) {
			temp = temp.split(alphabets[i]).join("|"); //removing all occurences
		}
		if (temp == finalEnc) {
			return false;
		}
		finalEnc = temp;
		let finalEncArr = finalEnc.split('|')
		let shuffled = finalEncArr[0];
		temp = shuffled;

		for (let j = 0; j < alphabets1.length; j++) {
			temp = temp.split(alphabets1[j]).join("|"); //removing all occurences
		}
		if(temp == shuffled){
			return false;
		}
		shuffled = temp;
		let shuffledArr = shuffled.split('|');

		finalEncArr.splice(0, 1); //removing 1st element of the array

		let finalNameDecr = '';
		for (let k = 0; k < finalEncArr.length; k++) {
			if(finalEncArr[k] != ''){
				let value = parseInt(finalEncArr[k], 16).toString(); //hex to decimal then toString
				let retStr = String.fromCharCode(value); //convert ASCII to character equivalent to chr(value) in php
				finalNameDecr += retStr;
			}
		}
		let charArr1 = finalNameDecr.trim(); //last part
		
		finalNameDecr = '';
		let shuffledArr1 = [];
		let j=0;
		//changing positions of the array
		for (let i = 0; i < shuffledArr.length; i++) {
			if(shuffledArr[i] != ''){
				shuffledArr1[shuffledArr[i]] = charArr1[j];
				j++;
			}
		}

		for (let i = 0; i < shuffledArr1.length; i++) {
			finalNameDecr +=shuffledArr1[i];
		}

		return finalNameDecr;
	}

	encrypt = async(unEnc)=>{
		unEnc = unEnc.trim();
		let charArr = unEnc.split('');
		let ascii = '';
		let numRange = [];
		for (let i = 0; i < charArr.length; i++) {
			numRange.push(i);
		}		
		this.shuffle(numRange);
		
		let alphabets = ["G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"];
		let alphabets1= ["g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z"];
		
		for (let j = 0; j < numRange.length; j++) {
			let ordVal = charArr[numRange[j]].charCodeAt(0); //character to ascii -  value of charArr in position of numRange[i]
			let randomCHAR = alphabets[this.getRandomInt(0, 19)]; //get random integer from 0 to 19 position and get alphabet value of that position
			let hexString = ordVal.toString(16);
			ascii += `${hexString}${randomCHAR}`;
		}
		
		let firstBit = 'ft';
		for (let k = 0; k < numRange.length; k++) {			
			let randomChar = alphabets1[this.getRandomInt(0, 19)]; //get random integer from 0 to 19 and get alphabets1 value of that position
			firstBit += `${numRange[k]}${randomChar}`;
		}
		let numRangeArr = ['6', '7', '8', '9', '10', '11', '12'];
		let randomNum = this.getRandomInt(0, numRangeArr.length-1);
		
		let stringLen = numRangeArr[randomNum];
		let randomChar2 = '';

		for (let i = 0; i < stringLen ; i++) {
			randomChar2 += alphabets[this.getRandomInt(0, 19)];			
		}
		let finalEnc = firstBit + randomChar2 + ascii;
		return finalEnc;
	}

	shuffle = (a)=> {
		let j, x, i;
		for (i = a.length - 1; i > 0; i--) {
			j = Math.floor(Math.random() * (i + 1));
			x = a[i];
			a[i] = a[j];
			a[j] = x;
		}
		return a;
	}

	getRandomInt = (min, max)=> {
		return Math.floor(Math.random() * (max - min) + min);
	}

	apiCall(api_url, data_array = []) {
		let nodefetch = require('node-fetch');
		return new Promise(function(resolve,reject){
			let username = global.CONFIG.PROPERTY_AUTH_SETTINGS.username;
			let password = global.CONFIG.PROPERTY_AUTH_SETTINGS.password;
			
			let auth_key = "Basic " + new Buffer.from(username + ":" + password).toString("base64");
            nodefetch(global.CONFIG.PROPERTY_API_URL + api_url,{
                method: 'POST',
                headers: {
					'content-type': 'application/json',
					"Authorization": auth_key
				},
                body: JSON.stringify(data_array)
            })
            .then(resp =>{
                try{
					return resolve(resp.json());
				}catch(er){					
					return reject(er);
				}
            })
            .catch(err=>{				
                return reject(err);
            });
        });

    }

	emailUser(to, from, subject, reply_to, emailbody) {
		let that = this;
		return new Promise(function (resolve, reject) {
			that.mailTransportObj.transporter().sendMail({
				to: to,
				from: from,
				replyTo: reply_to,
				subject: subject,
				html: emailbody

			}, function (err, mail) {
				if (err) {
					return resolve('error');
				} else if (mail) {
					return resolve(mail);
				}
			});

		});
	}

	/**
		* @developer : Sumit Sil
	    * @date : 21-07-2023
	    * @description : Function For common invitaion mail
	*/
	async commonInvitationHelpers(type, dataSet, email_heading) {
		try {
			let err = 0;
			let subject = '';
			let template_name = '';
			let mailRoutes = '';

			if(type == 0){ // FOR VERIFICATION CODE
				subject = 'Complx user verification code';
				template_name = global.CONFIG.MAIL_TEMPLATES.VERIFICATION_CODE_TEMPLATE;
				mailRoutes = global.CONFIG.MAIL_ROUTES.VERIFICATION_CODE_MAIL;
			} if(type == 1){ // FOR RESIDENT REFERRAL CODE, RESIDENT INVITATION MAIL
				subject = 'A parking Space has been assigned to you';
				template_name = global.CONFIG.MAIL_TEMPLATES.INVITATION_RESIDENT_TEMPLATE;
				mailRoutes = global.CONFIG.MAIL_ROUTES.INVITATION_RESIDENT;
			} if(type == 2){
				subject = 'Complx Customer New Password';
				template_name = global.CONFIG.MAIL_TEMPLATES.FORGOT_PWD;
				mailRoutes = global.CONFIG.MAIL_ROUTES.FORGOT_PWD_PATH;
			}
			let encData = {
				'email': dataSet.email,
				'enc_time': Math.floor(new Date() / 1000)
			}
			let encCode = await global.Helpers.encryptedInput(JSON.stringify(encData));
			// CREATE UNSUBSCRIBE LINK

			let unsubscribe_link = global.CONFIG.constants.COMPLX_ADMIN_FRONTEND_URL + global.CONFIG.IDENTIFIER_URLs.SUBSCRIPTION + encodeURIComponent(btoa(encCode))+"&email="+dataSet.email;
			// MAIL DATA
			const mailData = {
				email: dataSet.email,
				subject: subject,
				message: dataSet,
				unsubscribe_link : unsubscribe_link,
				template_name: template_name,
				email_heading: email_heading
			};
			let mailsend = await this.ApiCallWithPost(mailData, global.CONFIG.constants.MESSAGE_SERVICE_BASE_URL, mailRoutes)
			if (!mailsend) {
				err++;
			}
			return err;
			
		} catch (error) {
			return error;
		}
	}

	ApiCallWithPost = async(data_array, base_url, api_url, data_headers={'content-type' : 'application/json'}) => {
		const invalidEmail = require('../app/api/models/invalidEmailsModel/model.invalidEmails');
		const InvalidEmailModel = new invalidEmail();
		let invalidMailCheck = await InvalidEmailModel.countAllByAny({
			where: {
				email_address: data_array.email
			}
		})
		if(invalidMailCheck > 0){
			return;
			// IGNORE THAT MAIL ID WHICH IS INVALID, REST OF THE CODE FOR INVALID MAIL GOES HERE
		} else {
			// IF MAIL ID IS NOT FOUND IN INVALID MAIL TABLE THEN SEND MAIL
			let fetch = this.fetch;
			return new Promise(function(resolve,reject){
				fetch(base_url + api_url,{
					method: 'POST',
					headers: data_headers,
					body: JSON.stringify(data_array)
				})
				.then(resp => resp.json())
				.then(jsons =>{
					return resolve(jsons);
				})
				.catch(err=>{
					return reject(err);
				});
			});
		}
	}

	getCurrentDateTime = (format = "YYYY-MM-DD HH:mm:ss") => {
		let moment = require('moment-timezone')
		return moment(new Date()).format(format);
	}

	
    //get specific previous date : 
    prevSpecificDateFunction = (todayDate, count)=>{
        let moment = require('moment-timezone');
        return moment(todayDate).subtract(count, 'd').format('YYYY-MM-DD HH:mm:ss');
    }

    //get specific next date : 
    nextSpecificDateFunction = (todayDate, count)=>{
        let moment = require('moment-timezone');
        return moment(todayDate).add(count, 'd').format('YYYY-MM-DD HH:mm:ss');
    }

	
    //get next day
    nextDateFunction = (todayDate)=>{
        let moment = require('moment-timezone');
        return moment(todayDate).add(1, 'd').format('YYYY-MM-DD HH:mm:ss');
    }

	/*Function for image upload local folder Start*/
	uploadFileInLocalFolder(img_folder_name) {
		let multer = require('multer');
		this.fs = require('fs');

		/*Disk storage creation*/
		this.storage = multer.diskStorage({
			destination: './public/uploads/' + '' + img_folder_name,
			filename: function (req, file, cb) {
				let received_image = file.originalname;
				let image_nm = received_image.split('.');
				let imglen = image_nm.length;
				let img_type = image_nm[imglen - 1];
				let currentTime = Date.now();
				let fileName = currentTime + "." + img_type;
				cb(null, fileName)
			}
		})
		
		/*End*/
		/*Rules set up for Uploading*/
		this.upload = multer({
			storage: this.storage,
			limits: {
				fileSize: 5000000
			},
			fileFilter: function (req, file, cb) {
				/*Define the allowed extension*/
				let fileExts = ['png', 'jpg', 'jpeg', 'pdf', 'doc']
				let length_Str = file.originalname.split('.').length;
				/*Check allowed extensions*/
				let isAllowedExt = fileExts.includes(file.originalname.split('.')[length_Str-1].toLowerCase());
				/*Mime type must be an image*/
				if (isAllowedExt) {
					return cb(null, file) // no errors
				} else {
					/*Pass error msg to callback, which can be displaye in frontend*/
					cb('Error: Only png, jpg, jpeg, pdf, doc file are allowed !!');
				}
			}

		});
		return this.upload;
		/*End*/
	}

	/*File delete from local server*/
	fileDelete(path) {
		this.fs = require('fs');
		if (this.fs.existsSync(path)) {
			this.fs.unlink(path, (err) => {
				if (err)
					throw err;
				return 0;
			});
		}
	}
	/*End*/

	/*File upload to AWA S3 server*/

	fileUploadToS3(fromPath, topath) {
		this.fs = require('fs');
		let that = this;
		return new Promise(function (resolve, reject) {
			const AWS = require('aws-sdk');
			// AWS Crenditial
			const BUCKET_NAME = global.CONFIG.S3_BUCKET_NAME;
			const IAM_USER_KEY = global.CONFIG.S3_ACCESSKEYID;
			const IAM_USER_SECRET = global.CONFIG.AWS_S3_SECRET_KEY;

			let s3bucket = new AWS.S3({
				accessKeyId: IAM_USER_KEY,
				secretAccessKey: IAM_USER_SECRET,
				Bucket: BUCKET_NAME,
			});

			let fileName = fromPath;
			that.fs.readFile(fileName, (err, data) => {
				if (err) {
					return reject(err);
				}
				else {
					let currentTime = Math.floor(Date.now() / 1000);
					let expTime = Number(currentTime) + Number(5);
					const params = {
						Bucket: BUCKET_NAME, // pass your bucket name
						Key: topath, // file will be saved as /folder/filename
						Body: data,
						ACL: 'public-read',
						Expires: expTime
					};

					s3bucket.upload(params, function (s3Err, data) {
						if (s3Err) {
							return reject(s3Err);
						} else {
							that.fileDelete(fileName);
							return resolve(data);
						}
					});
				}

			});
		});
	}

	/*Upload File Deletd to AWA S3 server*/
	uploadedFileDeletedToS3(topath) {
		return new Promise(function (resolve, reject) {
			const AWS = require('aws-sdk');
			// AWS Crenditial
			const BUCKET_NAME = global.CONFIG.S3_BUCKET_NAME;
			const IAM_USER_KEY = global.CONFIG.S3_ACCESSKEYID;
			const IAM_USER_SECRET = global.CONFIG.AWS_S3_SECRET_KEY;

			let s3bucket = new AWS.S3({
				accessKeyId: IAM_USER_KEY,
				secretAccessKey: IAM_USER_SECRET,
				Bucket: BUCKET_NAME,
			});

			const params = {
				Bucket: BUCKET_NAME, // pass your bucket name
				Key: topath // file will be saved as /folder/filename
			};

			s3bucket.deleteObject(params, function (s3Err, data) {
				if (s3Err) {
					return reject(s3Err);
				} else {
					return resolve(data);
				}
			});
		});
	}
	/*Quickview order date details*/	
	getQuickViewDateDetails() {
		const moment = require('moment-timezone');
		let date = new Date();
		const currentDate = moment.utc(date, null).tz(process.env.TZ).format('YYYY-MM-DD'); //2021-10-07 
		const day_name = moment.utc(date, null).tz(process.env.TZ).format('ddd'); //Thu 
		let day_type = "";
		let order_date = "";
		const currentTime = moment.utc(date, null).tz(process.env.TZ).format('h:mm A'); //11:30 AM
		let student_Hour = process.env.STUDENT_ORDER_TIME;
		let teacher_Hour = process.env.TEACHER_ORDER_TIME;

		let checkTimeVal = this.checkEnvTimeBeforeOrAfter(student_Hour, teacher_Hour);

		let checkTimeVal2;
		if(checkTimeVal == 0 || checkTimeVal == 1){
			checkTimeVal2 = this.checkEnvTimeBeforeOrAfter(student_Hour, currentTime);
		}else{ //2
			checkTimeVal2 = this.checkEnvTimeBeforeOrAfter(teacher_Hour, currentTime);
		}
		//if 1 then its before time, 2 then its after time
		if(day_name == 'Sat') //send monday
		{
			order_date = moment(currentDate, "YYYY-MM-DD").add(2, 'days');
			day_type = 'N';
		} 
		else if(day_name == 'Sun') //send MOnday
		{
			order_date = moment(currentDate, "YYYY-MM-DD").add(1, 'days');
			if(checkTimeVal2 == 0 || checkTimeVal2 == 1)
			{
				day_type = 'N';
			}
			else if(checkTimeVal2 == 2)
			{
				day_type = 'C';
			}
		} 
		else 
		{
			if(checkTimeVal2 == 2) //after time
			{
				if(day_name == 'Fri') //send monday
				{
					order_date = moment(currentDate, "YYYY-MM-DD").add(3, 'days');
					day_type = 'N';
				} 
				else 
				{ //send next day
					order_date = moment(currentDate, "YYYY-MM-DD").add(1, 'days');
					day_type = 'C';
				}
			} 
			else if(checkTimeVal2 == 0 || checkTimeVal2 == 1) //send current date
			{
				order_date = currentDate;
				day_type = 'C';
			}
		}

		let week_day = moment(order_date).isoWeekday(); //4 (for thursday)
		
		let obj = {
			order_date	:order_date,
			day_type	:day_type,
			week_day	:week_day

		}
		return obj;
	}

	checkEnvTimeBeforeOrAfter(student_Hour, teacher_Hour){
		let check_student = '';
		let check_teacher = '';
		
		if(student_Hour.split(" ")[1] == 'PM' && teacher_Hour.split(" ")[1] == 'PM'){ //both PM
			if(student_Hour.split(":")[0] != '12'){
				check_student = parseInt(student_Hour.split(":")[0]) + 12;
			}else{
				check_student = parseInt(student_Hour.split(":")[0]);
			}
			if(teacher_Hour.split(":")[0] != '12'){
				check_teacher = parseInt(teacher_Hour.split(":")[0]) + 12;
			}else{
				check_teacher = parseInt(teacher_Hour.split(":")[0]);
			}

			if(check_student == check_teacher){ //same hour, then check minute
				check_student = student_Hour.split(" ")[0].split(":")[1];
				check_teacher = teacher_Hour.split(" ")[0].split(":")[1];
			}
		}
		else if(student_Hour.split(" ")[1] == 'AM' && teacher_Hour.split(" ")[1] == 'AM'){ //both AM			
			check_student = parseInt(student_Hour.split(":")[0]); //getting hour
			check_teacher = parseInt(teacher_Hour.split(":")[0]); //getting hour		

			if(check_student == check_teacher){ //same hour, then check minute
				check_student = student_Hour.split(" ")[0].split(":")[1]; //getting minute
				check_teacher = teacher_Hour.split(" ")[0].split(":")[1];
			}
		}else{ // AM/PM combination in time from env
			if(student_Hour.split(" ")[1] == 'PM'){
				check_student = parseInt(student_Hour.split(":")[0]) + 12;
			}else{
				check_student = parseInt(student_Hour.split(":")[0]);
			}

			if(teacher_Hour.split(" ")[1] == 'PM'){
				check_teacher = parseInt(teacher_Hour.split(":")[0]) + 12;
			}else{
				check_teacher = parseInt(teacher_Hour.split(":")[0]);
			}
		}		
		if(check_student == check_teacher){
			return 0;
		}else if(check_student > check_teacher){
			return 1;
		}else if(check_student < check_teacher){
			return 2;
		}
	}

	getDayNumberByDate(dayDate) {
		const moment = require('moment-timezone');
		const date = moment(dayDate); 
		const dow = date.day();
		return dow;
	}

	encrypt128(plainText, key, outputEncoding = "base64") {
	  const cipher = this.crypto.createCipheriv("aes-128-ecb", key, null);
	  return Buffer.concat([
		cipher.update(plainText),
		cipher.final(),
	  ]).toString(outputEncoding);
	}

	decrypt128(cipherText, key, outputEncoding = "utf8") {
	  const cipher = this.crypto.createDecipheriv("aes-128-ecb", key, null);
	  return Buffer.concat([
		cipher.update(cipherText),
		cipher.final(),
	  ]).toString(outputEncoding);
	}

	getDateOnlyFormat(date,format) {
		const moment = require('moment-timezone');
		date = new Date(date);
		const dateNew = moment.utc(date, null).tz(process.env.TZ).format(format);
		return dateNew
	}

	encrypt_decrypt_object_key(res, data, key_name = null, method_function = "encrypt") {
		if (data == null || typeof (data) == 'undefined') {
			return;
		}
		if (Array.isArray(data)) {
			for (let i = 0; i < data.length; i++) {
				for (let property in data[i]) {
					if (Array.isArray(data[i][property])) {
						this.encrypt_decrypt_object_key(data[i][property], key_name)
					}
					else {
						if (property == key_name) {
							if (method_function == 'encrypt') {
								if (data[i][property] != null) {
									data[i][property] = this.encryptbase64(data[i][property])
								}
							}
							else {
								data[i][property] = this.decryptbase64(res, data[i][property])
							}
						}
					}
				}
			}
		}
		else if (typeof (data) == 'object') {
			for (let property in data) {
				if (Array.isArray(data[property])) {
					this.encrypt_decrypt_object_key(data[property], key_name)
				}
				else {
					if (property == key_name) {
						if (method_function == 'encrypt') {
							if (data[property] != null) {
								data[property] = this.encryptbase64(data[property])
							}
						}
						else {
							data[property] = this.decryptbase64(res, data[property])
						}
					}
				}
			}
		}
		else {
			if (method_function == 'encrypt') {
				if (data != null) {
					data = this.encryptbase64(data)
				}
			}
			else {
				data = this.decryptbase64(res, data)
			}
		}
		return data;
	}

	encryptbase64(data) {
		const md5 = require('md5');
		const { base64encode } = require('nodejs-base64');
		let returns = md5('123') + '' + base64encode(data);
		return returns;
	}

	decryptbase64(res, data) {
		let info = data.split("202cb962ac59075b964b07152d234b70");
		if (info.length == 1) {
			return this.unauthorizedStatusBuild(res, 'You are not Authorized')

		}
		const { base64decode } = require('nodejs-base64');
		let returns = base64decode(info[1]);

		return returns;
	}

	temporaryRedirectStatusBuild(res, msg, dataset = []) {

		let response_raws = {};
		response_raws.message = msg;
		if (Object.keys(dataset).length === 0) {
			dataset = [];
		}
		response_raws.data = dataset;
		response_raws.publish = this.api_var;
		res.status(global.CONFIG.constants.HTTP_RESPONSE_TEMPORARY_REDIRECT);
		res.send({ response: {"raws":response_raws}});
	}
	/**
	 * @developer : Sumit Sil
	 * @date : 05-01-2023
	 * @description : Function to validate App
	*/
	validateApp = async (req) => {
		try{
			//Get Login Data from the token
			let request_arr = req.body.loginDetails;
			let app_version = request_arr.app_version;
			let device_uid = request_arr.device_uid;
			let device_token = request_arr.device_token;
			let device_name = request_arr.device_name;
			let device_model = request_arr.device_model;
			let device_version = request_arr.device_version;
			let device_os = request_arr.device_os;
	
			let access_token = await this.removeBearer(req.headers['authorization']);
			let count = await this.userLoginTokensModel.checkUserExists_API(access_token, app_version, device_uid, device_token, device_name, device_model, device_version, device_os);
			return count;
		}
		catch(error){
		}
    }

	/**
	 * @developer : Sumit Sil
	 * @date : 05-01-2023
	 * @description : Function to validate App Device for Registration OTP
	*/
	validateAppDeviceforOTP = async (req) => {
		try{
			//Get Login Data from the token
			let request_arr = req.body.loginDetails;
			let app_version = request_arr.app_version;
			let device_uid = request_arr.device_uid;
			let device_token = request_arr.device_token;
			let device_name = request_arr.device_name;
			let device_model = request_arr.device_model;
			let device_version = request_arr.device_version;
			let device_os = request_arr.device_os;
	
			let access_token = await this.removeBearer(req.headers['authorization']);
			let count = await this.userLoginTokensModel.checkUserExists_forOTP(access_token, app_version, device_uid, device_token, device_name, device_model, device_version, device_os);
			return count;
		}
		catch(error){
		}
    }

	/**
	 * @developer : Sumit Sil
	 * @date : 09-01-2023
	 * @description : Function to validate App Device ONLY FOR Regenerate token.
	*/
	validateAppDevicefor_RegenerateToken = async (req) => {
		try{
			//Get Login Data from the token
			let request_arr = [];
			if(req.body.expired_loginDetails){
				request_arr = req.body.expired_loginDetails;
			} else if(req.body.valid_loginDetails){
				request_arr = req.body.valid_loginDetails;
			}
			let app_version = request_arr.app_version;
			let device_uid = request_arr.device_uid;
			let device_token = request_arr.device_token;
			let device_name = request_arr.device_name;
			let device_model = request_arr.device_model;
			let device_version = request_arr.device_version;
			let device_os = request_arr.device_os;
	
			let access_token = await this.removeBearer(req.headers['authorization']);
			let refresh_token = req.body.refresh_token;
			let count = await this.userLoginTokensModel.checkUserExists(refresh_token, access_token, app_version, device_uid, device_token, device_name, device_model, device_version, device_os);
			return count;
		}
		catch(error){
		}
    }

	getTimeDiff(end_time, start_time, type = 'minutes') {
		const moment = require('moment-timezone');
		end_time = moment(end_time);//Last Time
		start_time = moment(start_time); // First Time
		let diff_time = end_time.diff(start_time, type);
		return diff_time;
	}

}
module.exports = commonFunc;