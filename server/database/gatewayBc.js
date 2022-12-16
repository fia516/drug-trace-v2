'use strict';

const { Gateway, Wallets } = require('fabric-network');
const path = require('path');
const fs = require('fs');

class GatewayBc {
    constructor() {
        try {
            this.ccpPath = path.resolve(__dirname, '..', '..', '..', 'fabric-samples', 'test-network', 'organizations', 'peerOrganizations', 'org1.example.com', 'connection-org1.json');
            this.ccp = JSON.parse(fs.readFileSync(this.ccpPath, 'utf8'));
            this.walletPath = path.join(process.cwd(), 'wallet');
            this.wallet = new Wallets();
            this.identity = null;
        } catch(err) {
            console.error(`Failed to initialize GatewayBc: ${err}`);
            process.exit(1);
        }
        this.utf8Decoder = new TextDecoder();
    }

    async initialize() {
        try {
            this.wallet = await Wallets.newFileSystemWallet(this.walletPath);
            this.identity = await this.wallet.get('pharmanetUser');
            if (!this.identity) {
                console.log('An identity for the user "pharmanetUser" does not exist in the wallet');
                console.log('Run the registerUser.js application before retrying');
                return;
            }
        } catch(err) {
            console.error(`Failed to evaluate wallet transaction: ${err}`);
            process.exit(1);
        }
    }

    static async startNetwork() {
        const network = new GatewayBc();
        await network.initialize();
        return network;
    }

    async checkLogin(query) {
        try {
            const gateway = new Gateway();
            await gateway.connect(this.ccp, { wallet: this.wallet, identity: 'pharmanetUser', discovery: { enabled: true, asLocalhost: true } });
            const network = await gateway.getNetwork('mychannel');
            const contract = network.getContract('drugcontract');

            let result = await this.checkData(query);

            await gateway.disconnect();
            
            if (result == 'true') {
                const account = await this.getData(query);
                console.log(`Query password is: ${query.password}. Account password is: ${account.password}.`);
                return query.password == account.password ? true : false;
            }
            return false;
        } catch(err) {
            console.error(`Failed to evaluate check transaction: ${err}`);
            process.exit(1);
        }
    }

    async checkData(query) {
        try {
            const gateway = new Gateway();
            await gateway.connect(this.ccp, { wallet: this.wallet, identity: 'pharmanetUser', discovery: { enabled: true, asLocalhost: true } });
            const network = await gateway.getNetwork('mychannel');
            const contract = network.getContract('drugcontract');

            let queryResult = await contract.evaluateTransaction('checkData', query.email);

            await gateway.disconnect();

            return JSON.stringify(JSON.parse(this.utf8Decoder.decode(queryResult)));
        } catch(err) {
            console.error(`Failed to evaluate check transaction: ${err}`);
            process.exit(1);
        }
    }

    async getData(query) {
        try {
            if (Object.keys(this.wallet).length === 0) {
                await this.initialize();
            }

            const gateway = new Gateway();
            await gateway.connect(this.ccp, { wallet: this.wallet, identity: 'pharmanetUser', discovery: { enabled: true, asLocalhost: true } });
            const network = await gateway.getNetwork('mychannel');
            const contract = network.getContract('drugcontract');

            let queryResult = await contract.evaluateTransaction('getData', query.email);
            let result = JSON.parse(this.utf8Decoder.decode(queryResult));

            await gateway.disconnect();

            return result;
        } catch(err) {
            console.error(`Failed to evaluate read transaction: ${err}`);
            process.exit(1);
        }
    }

    async insertUser(data) {
        try {
            const gateway = new Gateway();
            await gateway.connect(this.ccp, { wallet: this.wallet, identity: 'pharmanetUser', discovery: { enabled: true, asLocalhost: true } });
            const network = await gateway.getNetwork('mychannel');
            const contract = network.getContract('drugcontract');

            await contract.submitTransaction('addUser', JSON.stringify(data));

            await gateway.disconnect();
        } catch (err) {
            console.error(`Failed to submit write transaction: ${err}`);
            process.exit(1);
        }
    }

    async add(batch) {
        try {
            const gateway = new Gateway();
            await gateway.connect(this.ccp, { wallet: this.wallet, identity: 'pharmanetUser', discovery: { enabled: true, asLocalhost: true } });
            const network = await gateway.getNetwork('mychannel');
            const contract = network.getContract('drugcontract');

            await contract.submitTransaction('addDrug', JSON.stringify(batch));

            await gateway.disconnect();
        } catch(err) {
            console.error(`Failed to submit write transaction: ${err}`);
            process.exit(1);
        }
    }

    async order(data) {
        try {
            const gateway = new Gateway();
            await gateway.connect(this.ccp, { wallet: this.wallet, identity: 'pharmanetUser', discovery: { enabled: true, asLocalhost: true } });
            const network = await gateway.getNetwork('mychannel');
            const contract = network.getContract('drugcontract');

            await contract.submitTransaction('order', JSON.stringify(data));

            await gateway.disconnect();
        } catch (err) {
            console.error(`Failed to submit write transaction: ${err}`);
            process.exit(1);
        }
    }

    async distribute(data) {
        try {
            const gateway = new Gateway();
            await gateway.connect(this.ccp, { wallet: this.wallet, identity: 'pharmanetUser', discovery: { enabled: true, asLocalhost: true } });
            const network = await gateway.getNetwork('mychannel');
            const contract = network.getContract('drugcontract');

            await contract.submitTransaction('ownershipTransfer', JSON.stringify(data));
            console.log(`distribute data: ${JSON.stringify(data)}`);

            await gateway.disconnect();
        } catch(err) {
            console.error(`Failed to submit transfer transaction: ${err}`);
            process.exit(1);
        }
    }

    async complain(data) {
        try {
            const gateway = new Gateway();
            await gateway.connect(this.ccp, { wallet: this.wallet, identity: 'pharmanetUser', discovery: { enabled: true, asLocalhost: true } });
            const network = await gateway.getNetwork('mychannel');
            const contract = network.getContract('drugcontract');

            await contract.submitTransaction('recallRequest', JSON.stringify(data));

            await gateway.disconnect();
        } catch (err) {
            console.error(`Failed to submit write transaction: ${err}`);
            process.exit(1);
        }
    }

    async recall(id) {
        try {
            const gateway = new Gateway();
            await gateway.connect(this.ccp, { wallet: this.wallet, identity: 'pharmanetUser', discovery: { enabled: true, asLocalhost: true } });
            const network = await gateway.getNetwork('mychannel');
            const contract = network.getContract('drugcontract');

            await contract.submitTransaction('recallDrug', id);

            await gateway.disconnect();
        } catch(err) {
            console.error(`Failed to submit recall transaction: ${err}`);
            process.exit(1);
        }
    }

    async queryBatch(id) {
        try {
            const gateway = new Gateway();
            await gateway.connect(this.ccp, { wallet: this.wallet, identity: 'pharmanetUser', discovery: { enabled: true, asLocalhost: true } });
            const network = await gateway.getNetwork('mychannel');
            const contract = network.getContract('drugcontract');

            let queryResult = await contract.evaluateTransaction('queryDrugBatch', id);
            let result = JSON.parse(this.utf8Decoder.decode(queryResult));

            await gateway.disconnect();

            return result;
        } catch(err) {
            console.error(`Failed to evaluate getBatch transaction: ${err}`);
            process.exit(1);
        }
    }

    async querySelector(state) {
        try {
            const gateway = new Gateway();
            await gateway.connect(this.ccp, { wallet: this.wallet, identity: 'pharmanetUser', discovery: { enabled: true, asLocalhost: true } });
            const network = await gateway.getNetwork('mychannel');
            const contract = network.getContract('drugcontract');

            let queryResult = await contract.evaluateTransaction('querySelector', state);
            let result = JSON.parse(this.utf8Decoder.decode(queryResult));

            await gateway.disconnect();

            return result;
        } catch(err) {
            console.error(`Failed to evaluate querySelector transaction: ${err}`);
            process.exit(1);
        }
    }

    async queryAll() {
        try {
            const gateway = new Gateway();
            await gateway.connect(this.ccp, { wallet: this.wallet, identity: 'pharmanetUser', discovery: { enabled: true, asLocalhost: true } });
            const network = await gateway.getNetwork('mychannel');
            const contract = network.getContract('drugcontract');

            let queryResult = await contract.evaluateTransaction('queryAllDrugs');
            let result = JSON.parse(this.utf8Decoder.decode(queryResult));

            await gateway.disconnect();

            return result;
        } catch(err) {
            console.error(`Failed to evaluate queryAll transaction: ${err}`);
            process.exit(1);
        }
    }
}
module.exports.GatewayBc = GatewayBc;