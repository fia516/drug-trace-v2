'use strict';

const { Contract } = require('fabric-contract-api');

class DrugContract extends Contract {
    async addDrug(ctx, data) {
        const reqDrug = JSON.parse(data);
        const { id, quantity } = reqDrug;

        console.info(`Creating new drug batch with id: ${id}`);
        // Create individual items of a drug batch
        let qtyTemp = Number(quantity);
        let itemsArr = [];
        while (qtyTemp != 0) {
            let drugItem = {
                owner: 'none'
            };
            itemsArr.push(drugItem);
            qtyTemp--;
        }
        const drugBatch = {
            ...reqDrug,
            availableStock: quantity,
            state: 'distribution',
            items: itemsArr
        };
        await ctx.stub.putState(id, Buffer.from(JSON.stringify(drugBatch)));
        console.info(`Drug batch with id (${id}) has been added to the blockchain.`);
    }
    
    async order(ctx, data) {
        const reqData = JSON.parse(data);
        const { id } = reqData;
        await ctx.stub.putState(id, Buffer.from(JSON.stringify(reqData)));
        console.info(`Order no. ${id} has been added.`);
    }

    async ownershipTransfer(ctx, data) {
        const reqData = JSON.parse(data);
        const { id, retailerId, quantity } = reqData;
        const asset = await ctx.stub.getState(id);
        const drugBatch = JSON.parse(asset);
        console.info(`Transferring drug batch with id ${id} to ${retailerId}...`);

        const qtyNum = Number(quantity);
        const stockNum = Number(drugBatch.availableStock);
        const drugQtyNum = Number(drugBatch.quantity);
        
        // Initialize the index into the index of first available stock (itemNum)
        let itemNum = drugQtyNum - stockNum;
        let len = itemNum + qtyNum;
        for (let i = itemNum; i < len; i++) {
            if (drugBatch.items[i].owner === 'none') {
                drugBatch.items[i].owner = retailerId;
                await ctx.stub.putState(id, Buffer.from(JSON.stringify(drugBatch)));
            }
        }
        drugBatch.availableStock =  stockNum - qtyNum;
        await ctx.stub.putState(id, Buffer.from(JSON.stringify(drugBatch)));
        console.info(`${quantity} drug batch with id ${id} has been successfully transferred to ${retailerId}.`);
    }
    
    async recallRequest(ctx, data) {
        const reqData = JSON.parse(data);
        const { id } = reqData;
        await ctx.stub.putState(id, Buffer.from(JSON.stringify(reqData)));
        console.info(`Request no. ${id} has been added.`);
    }

    async recallDrug(ctx, id) {
        const asset = await ctx.stub.getState(id);
        const drugBatch = JSON.parse(asset);
        drugBatch.state = 'recalled';
        await ctx.stub.putState(id, Buffer.from(JSON.stringify(drugBatch)));
        console.info(`Drug batch with id ${id} has been recalled.`);
    }

    /* Query functions */
    async queryAllDrugs(ctx) {
        const iterator = await ctx.stub.getStateByRange('', '');
        const results = await this.getAllQueryResults(iterator, false);
        return JSON.stringify(results);
    }

    async queryDrugBatch(ctx, id) {
        console.info(`Querying drug batch ${id}`);
        const drugBatch = await ctx.stub.getState(id);
        const objDrugBatch = JSON.parse(drugBatch);

        const retailers = {};
        objDrugBatch.items.forEach(owners => retailers[owners.owner] = (retailers[owners.owner] || 0) + 1);
        objDrugBatch.retailers = retailers;

        delete objDrugBatch.items;
        return JSON.stringify(objDrugBatch);
    }

    async querySelector(ctx, selector) {
        const iterator = await ctx.stub.getQueryResult(selector);
        const results = await this.getAllQueryResults(iterator, false);
        return JSON.stringify(results);
    }

    async getAllQueryResults(iterator, isHistory) {
        let allResults = [];
        let res = await iterator.next();
        while (!res.done) {
            if (res.value && res.value.value.toString()) {
                let jsonRes = {};
                if (isHistory && isHistory === true) {
                    jsonRes.TxId = res.value.txId;
                    jsonRes.Timestamp = res.value.timestamp;
                    try {
                        jsonRes.Value = JSON.parse(res.value.value.toString('utf8'));
                    } catch (err) {
                        console.log(err);
                        jsonRes.Value = res.value.value.toString('utf8');
                    }
                } else {
                    console.log(`Key: ${res.value.key}`);
                    jsonRes.Key = res.value.key;
                    try {
                        jsonRes.Record = JSON.parse(res.value.value.toString('utf8'));
                        console.log(`Value: ${jsonRes.Record}`);
                    } catch (err) {
                        console.log(err);
                        jsonRes.Record = res.value.value.toString('utf8');
                    }
                }
                delete jsonRes.Record.items;
                allResults.push(jsonRes);
            }
            res = await iterator.next();
        }
        iterator.close();
        return allResults;
    }

    /* User functions */
    async addUser(ctx, data) {
        const reqData = JSON.parse(data);
        const { email } = reqData;

        console.info(`Inserting new company account to ledger with email: ${email}`);
        await ctx.stub.putState(email, Buffer.from(JSON.stringify(reqData)));
        console.info(`Added: ${JSON.stringify(reqData)}`);
    }

    async checkData(ctx, id) {
        console.info(`Checking data with id: ${id}`);
        const assetJSON = await ctx.stub.getState(id);
        return assetJSON && assetJSON.length > 0;
    }

    async getData(ctx, id) {
        console.info(`Getting data with id: ${id}`);
        const record = await ctx.stub.getState(id);
        return record.toString();
    }
}
module.exports = DrugContract;