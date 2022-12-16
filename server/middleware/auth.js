'use strict';

const { req, res } = require('express');
const jwt = require('jsonwebtoken');
const jwtConfig = require('../config/jwtConfig');
const webConfig = require('../config/websiteConfig');
// const { RequestWithEmail } = require('../types');
const { GatewayBc } = require('../database/gatewayBc');

module.exports.authenticate = async (req, res, next) => {
    const { auth } = req.cookies;
    if (auth) {
        jwt.verify(auth, jwtConfig.secret, async (err, signedData) => {
            if (err) {
                console.log('Something is wrong with cookie');
                res.clearCookie('auth');
                res.redirect(webConfig.baseUrl + '/interface/login'); // Nope
                return;
            }

            req.email = signedData.email;
            next();
        });
    }
    else {
        res.redirect(webConfig.baseUrl + '/interface/login'); // Nope
    }
};

module.exports.distributorCheck = async (req, res, next) => {
    const gateway = new GatewayBc();
    const account = await gateway.getUser(req);
    if (account) {
        const { accountType } = account;
        if (accountType == 'distributor') {
            next();
        }
        else {
            res.clearCookie('auth');
            res.redirect(webConfig.baseUrl + '/interface/login'); // Nope
        }
    }
};

module.exports.retailerCheck = async (req, res, next) => {
    const gateway = new GatewayBc();
    const account = await gateway.getUser(req);
    if (account) {
        const { accountType } = account;
        if (accountType == 'retailer') {
            next();
        }
        else {
            res.clearCookie('auth');
            res.redirect(webConfig.baseUrl + '/interface/login'); // Nope
        }
    }
};