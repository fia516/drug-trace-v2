'use strict';

const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const webConfig = require('../config/websiteConfig');
const jwtConfig = require('../config/jwtConfig');
const { GatewayBc } = require('../database/gatewayBc');
import { req, res } from 'express';

export async function signUp(req, res) {
    const userData = req.body;
    const { email, password, company, address } = req.body;

    // Check if all fields complete
    if (!email || !password || !company || !address) {
        res.status(400).send({
            success: false,
            error: "Please fill in all fields.",
        });
        return;
    }

    // Check if email is used
    const exists = await couch.get(dbName, email).then(({ data, headers, status }) => {
        if (data) {
            return true;
        }
    }, err => {
        if (err.code == 'EDOCMISSING') {
            return false;
        }
        else {
            console.log('An error checking email has occured: ', err);
            process.exit(1);
        }
    });

    if (exists) {
        res.status(400).send({
            success: false,
            error: 'Email is already in use.'
        });
        return;
    }

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: "pharmanet2022@gmail.com",
            pass: "crkvsgtfaecokkjt",
        }
    });

    console.log("Sending email");

    let base64 = Buffer.from(email).toString('base64');

    transporter.sendMail({
        from: `"PharmaNet" <pharmanet2022@gmail.com>`,
        to: `${email}`,
        subject: "PharmaNet email confirmation",
        text: `Please confirm your email by clicking the following link: ${webConfig.baseURL}/api/verify/${base64}`,
        html: `Please confirm your email by clicking the following link: ${webConfig.baseURL}/api/verify/${base64}`,
    }).then((info) => {
        console.log('Transporter mail info ', info);
    }).catch(console.error);

    const accessToken = jwt.sign(
        { email, iat: Date.now() / 1000 },
        jwtConfig.secret,
        { expiresIn: jwtConfig.duration }
    );

    res.cookie("auth", accessToken);

    // Insert user in database
    userData['_id'] = email;
    userData['verified'] = "no";
    const status = await couch.insert(dbName, userData).then(({ data, headers, status }) => {
        console.log(`User data has been sucessfully added to the database.`);
        return status;
    }, err => {
        console.log('Error in inserting to database.', err);
        process.exit(1);
    });

    if (status === 201) {
        res.status(201).send({
            success: true
        });
        return;
    }
}

export async function signIn(req, res) {
    const { email, password } = req.body;

    // Check if all fields contain anything
    if (!email || !password) {
        res.status(400).send({
            success: false,
            error: "Please fill in all fields.",
        });
        return;
    }

    // Check if email and password is correct
    const match = await couch.get(dbName, email).then(({ data, headers, status }) => {
        if (data.email == email && data.password == password) {
            return true;
        }
        else {
            return false;
        }
    }, err => {
        if (err.code == 'EDOCMISSING') {
            return false;
        }
        else {
            console.log('An error checking email has occurred: ', err);
            process.exit(1);
        }
    });

    if (!match) {
        res.status(400).send({
            success: false,
            error: 'Email or password is incorrect.'
        });
        return;
    }

    // Create and sign authorization cookie
    const accessToken = jwt.sign(
        { email, iat: Date.now() / 1000 },
        jwtConfig.secret,
        { expiresIn: jwtConfig.duration }
    );
    res.cookie("auth", accessToken);
    res.status(200).send({
        success: true
    });
}
