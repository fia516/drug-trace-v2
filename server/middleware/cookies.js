'use strict';

module.exports.parseCookies = async (req, res, next) => {
    const cookies = (req.headers.cookie || '').split('; ') || [];
    if (cookies) {
        const cookieRecord = {};
        for (const cookie of cookies) {
            const key = cookie.split('=')[0];
            const value = cookie.split('=').slice(1).join('=');
            cookieRecord[key] = value;
        }
        req.cookies = cookieRecord;
    }
    next();
};