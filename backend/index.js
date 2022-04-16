const express = require('express');
const app = express();
const port = 3000;
var config = require('./config');
var cors = require("cors")
var fetch = require('node-fetch')
const { ApiPromise, WsProvider } = require('@polkadot/api');

const axios = require('axios').default

var runtime = {
}
var lastAuthor;

var minedblocks = []
var allBlocks = []

async function getChain() {
    const provider = new WsProvider('wss://mainnet.creditcoin.network');
    const api = await ApiPromise.create({ provider });
    const chainInfo = await api.registry.getChainProperties()
    return chainInfo
}

async function getBalance() {
    const provider = new WsProvider('wss://mainnet.creditcoin.network');
    const api = await ApiPromise.create({ provider });
    const ADDR = '5Dqn27bMY3zxpNWV4gHwoLAThTuGSMkegKPiFEJBNSWiBZMQ';

    // Retrieve the last timestamp
    const now = await api.query.timestamp.now();
    
    // Retrieve the account balance & nonce via the system module
    const { nonce, data: balance } = await api.query.system.account(ADDR);
    
    return balance.free / 1000000000000000000
}

async function getBlock() {
    const provider = new WsProvider('wss://mainnet.creditcoin.network');
    const api = await ApiPromise.create({ provider });
    let count = 0;
    const unsubscribe = await api.derive.chain.subscribeNewHeads((header) => {
        console.log(`Chain is at block: #${header.number} and was mined by ${header.author}`);
        lastAuthor=header.author
        var minedblock = {
                
        }
        minedblock[header.number] = header
        if (header.author == '5Dqn27bMY3zxpNWV4gHwoLAThTuGSMkegKPiFEJBNSWiBZMQ') {
            console.log('we mined a block!')
            minedblocks.push(minedblock)
        }
        allBlocks.push(minedblock)
    });
}
getBlock()
app.use(cors())


function make_api_call(ip, port, user, name){
    if (runtime[user] == null){
        runtime[user] = {
            nodes: {
            }
        }
    }
    if (runtime[user]['nodes'][name] == null){
        runtime[user]['nodes'][name] = {
            'name': name,
            'node_total': 0,
            'prev': -1,
            'curr': 0
        }
    }

    var options = {
        method: 'POST',
        url: 'http://'+ip+':'+port,
        headers: {'Content-Type': 'application/json'},
        data: {id: 1, jsonrpc: '2.0', method: 'creditcoin_hashrate'}
    };

    axios.request(options).then(function (response) {
        runtime[user]['nodes'][name]['curr'] = response.data.result.hash_count
        if ( runtime[user]['nodes'][name]['prev']  > runtime[user]['nodes'][name]['curr'] || runtime[user]['nodes'][name]['prev'] == -1){
            runtime[user]['nodes'][name]['prev'] = runtime[user]['nodes'][name]['curr']
        }

        runtime[user]['nodes'][name]['node_total'] += runtime[user]['nodes'][name]['curr'] - runtime[user]['nodes'][name]['prev']
        runtime[user]['nodes'][name]['prev'] = runtime[user]['nodes'][name]['curr']

        
    }).catch(function (error) {
        console.error(user+"'s node: "+ name+ "couldnt connect");
    });
}

// collect starting num
async function collect_stats(){ 
    var result;
    for(var user in config.users) {
        for (var node in config.users[user].nodes){
            result = await make_api_call(config.users[user].nodes[node].ip, config.users[user].nodes[node].rpc_port, user ,config.users[user].nodes[node].name);
        }
    }
}


var stats_loop = setInterval(collect_stats, 1000);

app.get('/stats', (req, res) => {
    res.json(runtime);
});

app.get('/', (req, res) => {
    res.redirect('/pool');
});

app.get('/getChain', async (req, res) => {
    response = await getChain()
    res.json(response)
});

app.get('/getBlock', async (req, res) => {
    res.json(lastAuthor)
});

app.get('/getBlocks', async (req, res) => {
    res.json(allBlocks.slice(-10))
});

app.get('/minedBlocks', (req, res) => {
    res.json(minedblocks)
})

app.get('/balance', async (req, res) => {
    response = await getBalance()
    res.json(response)
})

app.get('/pool', (req, res) => {
    var payout = new Object()
    payout.total_hashes = 0
    for(var user in runtime) {
        runtime[user].total=0
        for (var node in runtime[user].nodes){
            runtime[user].total +=  runtime[user].nodes[node].node_total
        }
        payout.total_hashes += runtime[user].total
        payout[user] = {num_hashes: runtime[user].total}
    }

    for(var user in payout) {
        payout[user]['percentage'] = (payout[user].num_hashes / payout['total_hashes']) * 100
    }

    res.json(payout);
    
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
