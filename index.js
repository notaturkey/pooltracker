const express = require('express');
const app = express();
const port = 50406;
var config = require('./config');
var request = require('request');


const e = require('express');

// collect starting num
function collect_stats(){ 
    var options = {};
    for(var user in config.users) {
        var nodes = config.users[user].nodes;
        for (var node in nodes){
            node = config.users[user].nodes[node]
            options = {
                uri: 'http://'+node.ip+':'+node.rpc_port,
                method: 'POST',
                json: {"id":1, "jsonrpc":"2.0", "method": "creditcoin_hashrate"}
            };
            request(options, function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    var hashcount = parseInt(body.result.hash_count)
                    if (node.curr_hashcount == null){
                        node.curr_hashcount = hashcount
                    }
                    else {
                        node.prev_hashcount = node.curr_hashcount;
                        node.curr_hashcount = parseInt(hashcount);
                        
                        node.node_total_hashcount += node.curr_hashcount - node.prev_hashcount;
                    }
                }
                else {
                    node.curr_hashcount = null
                    console.log(error)
                }
            }); 
        }
    }
}

var stats_loop = setInterval(collect_stats, 1000);

app.get('/stats', (req, res) => {
    res.send(config);
});

app.get('/pool', (req, res) => {
    var payout = new Object()
    payout.total_hashes = 0
    for(var user in config.users) {
        var user_total = 0;
        var name = config.users[user].name
        var nodes = config.users[user].nodes
        for (var node in nodes){
            user_total +=  config.users[user].nodes[node].node_total_hashcount
        }
        payout[name] = {num_hashes: user_total}
        payout.total_hashes +=  user_total
    }

    for(var user in config.users) {
        var user_total = 0;
        var name = config.users[user].name
        var nodes = config.users[user].nodes
        for (var node in nodes){
            user_total +=  config.users[user].nodes[node].node_total_hashcount
        }
        payout[name]['percentage'] = (payout[name].num_hashes / payout['total_hashes']) * 100
    }

    res.send(payout);
    
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
