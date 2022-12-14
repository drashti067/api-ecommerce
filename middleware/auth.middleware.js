
const jwt = require("jsonwebtoken");
// const bcrypt = require("bcrypt");
const User = require("../models/users.model");
const { decrypt } = require("../utils/crypto");

const UserAuthCheck = async (req, res, next) => {
	let token = req.headers.authorization || req.cookies.cwtct;
    // const token = req.cookies.authorization || req.cookies.token;

    try {
        if(!token) throw new Error("Not Authorised!");

		token = decrypt(token);

        const verify = jwt.verify(token, process.env.JWT_SECRET);
        const mobile = verify.id;

        if(!mobile) throw new Error("Not Authorised!");

        const user = await User.findOne({mobile});
        if(!user) throw new Error('Invalid credentials.');
		if(user.status === 'banned') throw new Error('user have been banned or removed', 403);

		req.user = user;
        next();
    } catch (err) {
		let message;
		let tokenExpire = false;
		let tokenError = false;
        if(err.name == "TokenExpiredError") {
			message = "Login Session Expired. Please Login Again.";
			tokenExpire = true;
		}
        if(err.name == "JsonWebTokenError") {
			message = "Login Session Expired. Please Login Again.";
			tokenError = true;
		}

        res.json({
			status: 'fail',
			error: true,
			tokenExpire,
			tokenError,
			message: message || err.message
		});
    }
}

const AdminAuthCheck = async (req, res, next) => {
    let token = req.headers.authorization || req.cookies?.cwtct;
	
    // const token = req.cookies.authorization || req.cookies.token;

    try {
        if(!token) throw new Error("Not Authorised!");

		token = decrypt(token);

        const verify = jwt.verify(token, process.env.JWT_SECRET);
        const {email, password} = verify.id;
		
        if(!email) throw new Error("Not Authorised!");
        if(!password) throw new Error("Not Authorised!");

        const user = await User.findOne({email}).select('+password');
        if(!user) throw new Error('Invalid credentials.');

		if(user.role !== 'administrator') throw new Error('Not Authorised!');

		// console.log(password, user.password)
		if(password !== user.password) throw new Error("Invalid credentials. Please check Email and Password");
		// const valid = await bcrypt.compare(password, user?.password);
        // if(!valid) throw new Error("Invalid credentials. Please check Email and Password");
		
		req.user = user;
        next();
    } catch (err) {
		let message;
		let tokenExpire = false;
		let tokenError = false;
        if(err.name == "TokenExpiredError") {
			message = "Login Session Expired. Please Login Again.";
			tokenExpire = true;
		}
        if(err.name == "JsonWebTokenError") {
			message = "Invalid token. Please Login Again.";
			tokenError = true;
		}

        res.json({
			status: 'fail',
			error: true,
			tokenExpire,
			tokenError,
			message: message || err.message
		});
    }
}

module.exports = {UserAuthCheck, AdminAuthCheck};