const { Request } = require('express');

class RequestWithEmail extends Request {
    email;
}
module.exports.RequestWithEmail = RequestWithEmail;