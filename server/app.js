'use strict';

const express = require('express');
const NodeCouchDb = require('node-couchdb');
const bodyParser = require('body-parser');
const { EnrollBc } = require('./database/enrollBc');
const { GatewayBc } = require('./database/gatewayBc');
// const { CouchDb } = require('./database/couchDb');

const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
import webConfig from './config/websiteConfig';
import jwtConfig from './config/jwtConfig';

const enroll = new EnrollBc();
// const couch = new CouchDb();

const app = express();
const PORT = process.env.PORT || 8080;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const couch = new NodeCouchDb({
    port: 5984,
    auth: {
        user: 'admin',
        pass: 'adminpw'
    }
});

const dbName = 'drugtrace';

// Create drugtrace db
couch.createDatabase(dbName).then(() => {
    console.log(`Database ${dbName} has been created for org1.`);
}, (err) => {
    if (err.code === 'EDBEXISTS') {
        console.log(`Database already exists.`);
    }
    else {
        console.error(err);
    }
});

// Homepage
app.get('/', (req, res) => {
    res.send('It\'s fucking working.');
});

// Insert user (not blockchain)
/* app.post('/signUp1', async (req, res) => {
    try {
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
        const exists = await couch.get(dbName, email).then(({data, headers, status}) => {
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
        const status = await couch.insert(dbName, userData).then(({data, headers, status}) => {
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
    } catch (err) {
        console.error(`Failed to send signUp request. Error: ${err}`);
        res.status(400).send({
            success: false,
            error: "Something went wrong with sending a signUp request."
        })
        return;
    }
}); */

// Insert user
app.post('/signUp', async (req, res) => {
    try {
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

        const gateway = await GatewayBc.startNetwork();
        // Check if email is used
        const emailExists = await gateway.checkData(req.body);
        if (emailExists == "true") {
            res.status(400).send({
                success: false,
                error: "Email is already in use.",
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
            console.log(info);
        }).catch(console.error);

        // Insert user in blockchain
        userData['verified'] = "no";
        await gateway.insertUser(userData);
        const accessToken = jwt.sign(
            { email, iat: Date.now() / 1000 },
            jwtConfig.secret,
            { expiresIn: jwtConfig.duration }
        );

        res.cookie("auth", accessToken);
        res.status(201).send({
            success: true
        });
    } catch(err) {
        console.error(`Failed to send signUp request. Error: ${err}`);
        res.status(400).send({
            success: false,
            error: "Something went wrong with sending a signUp request."
        })
        return;
    }
});

// Sign in not blockchain
/* app.post('/signIn1', async (req, res) => {
    try {
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
    } catch (err) {
        console.error(`Failed to send signIn request. Error: ${err}`);
        res.status(400).send({
            success: false,
            error: "Something went wrong with sending a signIn request."
        })
        return;
    }
}); */

// Sign in
app.post('/signIn', async (req, res) => {
    try {
        const { email, password } = req.body;

        //Check if all fields contain anything
        if (!email || !password) {
            res.status(400).send({
                success: false,
                error: "Please fill in all fields.",
            });
            return;
        }

        const gateway = await GatewayBc.startNetwork();

        //Check if the user does not exist in the world state
        const exists = await gateway.checkLogin(req.body);
        if (!exists) {
            res.status(400).send({
                success: false,
                error: "Incorrect email or password.",
            });
            return;
        }
       
        // Create and sign authorization cookie
        const account = await gateway.getData(req.body);
        const accessToken = jwt.sign(
            { email, iat: Date.now() / 1000 },
            jwtConfig.secret,
            { expiresIn: jwtConfig.duration }
        );
        res.cookie("auth", accessToken);
        delete account.password;
        res.status(200).send({
            success: true,
            ...account,
        });
    } catch(err) {
        console.error(`Failed to send signIn request. Error: ${err}`);
        res.status(400).send({
            success: false,
            error: "Something went wrong with sending a signIn request."
        })
        return;
    }
});

// Add drug
app.post('/addDrug', async (req, res) => {
    try {
        const newBatch = req.body;
        const batchId = req.body.distributorId.concat(req.body.batchNum);
        newBatch.id = batchId;

        const gateway = await GatewayBc.startNetwork();
        await gateway.add(newBatch);
        res.status(201).send({
            sucess: true
        })
        return;
    } catch(err) {
        console.error(`Failed to send add request. Error: ${err}`);
        res.status(400).send({
            success: false,
            error: "Something went wrong with sending an add request."
        })
        return;
    }
});

// Order
app.post('/order', async (req, res) => {
    try {
        const order = req.body;
        const date = new Date().valueOf();
        const id = date.toString().concat('O');
        order.id = id;
        const gateway = await GatewayBc.startNetwork();
        await gateway.order(order);
        res.status(200).send({
            success: true
        });
        return;
    } catch(err) {
        console.error(`Failed to send order request. Error: ${err}`);
        res.status(400).send({
            success: false,
            error: "Something went wrong with sending an order request."
        })
        return;
    }
});

// Distribute
app.post('/distribute', async (req, res) => {
    try {
        const drugBatch = req.body;
        const batchId = req.body.distributorId.concat(req.body.batchNum);
        console.log(`/distribute Batch id: ${batchId}`);
        const gateway = await GatewayBc.startNetwork();

        // Check if batch exists
        const exists = gateway.checkData(batchId);
        if (!exists) {
            res.status(400).send({
                success: false,
                error: "Drug batch does not exist.",
            });
        }
        drugBatch.id = batchId;
        await gateway.distribute(drugBatch);
        res.status(200).send({
            success: true
        });
        return;
    } catch(err) {
        console.error(`Failed to send distribute request. Error: ${err}`);
        res.status(400).send({
            success: false,
            error: "Something went wrong with sending a distribute request."
        })
        return;
    }
});

// Complain (request_recall)
app.post('/complain', async (req, res) => {
    try {
        const complaint = req.body;
        const date = new Date().valueOf();
        const id = date.toString().concat('R');
        complaint.id = id;
        const gateway = await GatewayBc.startNetwork();
        await gateway.complain(complaint);
        res.status(200).send({
            success: true
        });
        return;
    } catch (err) {
        console.error(`Failed to send complain request. Error: ${err}`);
        res.status(400).send({
            success: false,
            error: "Something went wrong with sending a complain request."
        })
        return;
    }
});

app.post('/recall', async (req, res) => {
    try {
        const batchId = req.body.distributorId.concat(req.body.batchNum);
        console.log(`/recall Batch id: ${batchId}`);
        const gateway = await GatewayBc.startNetwork();

        // Check if batch exists
        const exists = gateway.checkData(batchId);
        if (!exists) {
            res.status(400).send({
                success: false,
                error: "Drug batch does not exist.",
            });
        }
        await gateway.recall(batchId);
        res.status(200).send({
            success: true
        });
        return;
    } catch(err) {
        console.error(`Failed to send recall request. Error: ${err}`);
        res.status(400).send({
            success: false,
            error: "Something went wrong with sending a recall request."
        })
        return;
    }
});

// Query by state
app.get('/queryState', async (req, res) => {
    try {
        const selector = {
            selector: {
                state: req.body.state
            },
            use_index: "indexQuery"
        }
        const gateway = await GatewayBc.startNetwork();
        const results = await gateway.querySelector(JSON.stringify(selector));
        const resultSet = [];
        for(let i = 0; i < results.length; i++) {
            const value = results[i].Record
            resultSet.push(value);
        }
        res.status(200).send({
            success: true,
            result: resultSet
        });
        return;
    } catch(err) {
        console.error(`Failed to send querySelector request. Error: ${err}`);
        res.status(400).send({
            success: false,
            error: "Something went wrong with sending a querySelector request."
        })
    }
});

// Query description
app.get('/queryDescription', async (req, res) => {
    try {
        const selector = {
            selector: {
                description: req.body.description
            },
            use_index: "indexQuery"
        }
        const gateway = await GatewayBc.startNetwork();
        const results = await gateway.querySelector(JSON.stringify(selector));
        const resultSet = [];
        for (let i = 0; i < results.length; i++) {
            const value = results[i].Record
            resultSet.push(value);
        }
        res.status(200).send({
            success: true,
            result: resultSet
        });
        return;
    } catch(err) {
        console.error(`Failed to send queryDescription request. Error: ${err}`);
        res.status(400).send({
            success: false,
            error: "Something went wrong with sending a queryDescription request."
        })
        return;
    }
});

// Query drug batch
app.get('/queryBatch', async (req, res) => {
    try {
        const batchId = req.body.distributorId.concat(req.body.batchNum);
        console.log(`/queryBatch Batch id: ${batchId}`);
        const gateway = await GatewayBc.startNetwork();

        // Check if batch exists
        const exists = gateway.checkData(batchId);
        if (!exists) {
            res.status(400).send({
                success: false,
                error: "Drug batch does not exist.",
            });
        }
        const result = await gateway.queryBatch(batchId);

        res.status(200).send({
            success: true,
            ...result
        });
        return;
    } catch (err) {
        console.error(`Failed to send queryBatch request. Error: ${err}`);
        res.status(400).send({
            success: false,
            error: "Something went wrong with sending a queryBatch request."
        })
        return;
    }
});

// Query all
app.get('/queryAll', async (req, res) => {
    try {
        const gateway = await GatewayBc.startNetwork();
        const results = await gateway.queryAll();

        const resultSet = [];
        for (let i = 0; i < results.length; i++) {
            const value = results[i].Record
            resultSet.push(value);
        }
        res.status(200).send({
            success: true,
            result: resultSet
        });
    } catch(err) {
        console.error(`Failed to send queryAll request. Error: ${err}`);
        res.status(400).send({
            success: false,
            error: "Something went wrong with sending a queryAll request."
        })
    }
});

// Query owned drug batches by distributor
app.get('/queryOwnedDistributor', async (req, res) => {
    try {
        const selector = {
            selector: {
                distributor: req.body.distributor
            },
            use_index: "indexQuery"
        }
        const gateway = await GatewayBc.startNetwork();
        const results = await gateway.querySelector(JSON.stringify(selector));
        const resultSet = [];
        for (let i = 0; i < results.length; i++) {
            const value = results[i].Record
            resultSet.push(value);
        }
        res.status(200).send({
            success: true,
            result: resultSet
        });
        return;
    } catch (err) {
        console.error(`Failed to send queryOwnedDistributor request. Error: ${err}`);
        res.status(400).send({
            success: false,
            error: "Something went wrong with sending a queryOwnedDistributor request."
        })
        return;
    }
});

// Query owned drug batches by retailer
app.get('/queryOwnedRetailer', async (req, res) => {
    try {
        const selector = {
            selector: {
                items: {
                    $elemMatch: {
                        owner: req.body.retailer
                    }
                } 
            },
            use_index: "indexQuery"
        }
        const gateway = await GatewayBc.startNetwork();
        const results = await gateway.querySelector(JSON.stringify(selector));
        const resultSet = [];
        for (let i = 0; i < results.length; i++) {
            const value = results[i].Record
            resultSet.push(value);
        }
        res.status(200).send({
            success: true,
            result: resultSet
        });
        return;
    } catch (err) {
        console.error(`Failed to send queryOwnedDistributor request. Error: ${err}`);
        res.status(400).send({
            success: false,
            error: "Something went wrong with sending a queryOwnedDistributor request."
        })
        return;
    }
});

enroll.enrollAdmin().then(() => {
    enroll.registerUser().then(() => {
        app.listen(PORT, () => console.log(`Server started at port: ${PORT}`));
    });
});