const jwt = require('jsonwebtoken');
const asyncHandler = require('./async');
const ErrorResponse = require('../utils/errorResponse');
const User = require('../models/User');

exports.protect = asyncHandler(async(req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        // Set token from req header
        token = req.headers.authorization.split(' ')[1];
    }
    // else if (req.cookies.token) {
    //     // Set token from cookie
    //     token = req.cookies.token;
    // }

    // Making sure token exists
    if (!token)
        return next(new ErrorResponse('Not authorized to access this route'), 401);

    // Verifying the received token
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        console.log(decoded);

        req.user = await User.findById(decoded.id);
        next();
    } catch (err) {
        return next(new ErrorResponse('Not authorized to access this route'), 401);
    }
});

// Grant access to specific role
exports.authorize = (...roles) => {
    return (req, res, next) => {
        console.log('Route accessible by:' + roles);
        if (!roles.includes(req.user.role)) {
            return next(
                new ErrorResponse(
                    'User role ' +
                    req.user.role +
                    ' is not authorized to access this route',
                    403
                )
            );
        }
        next();
    };
};