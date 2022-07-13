const tradePathBase = "https://www.pathofexile.com/trade/search/Sentinel?q=";

function testTradeApi() {
    let rqbody1 = '{"query":{"status":{"option":"onlineleague"},"stats":[{"type":"and","filters":[{"id":"explicit.stat_1625939562"},{"id":"explicit.stat_1705633890"}]},{"filters":[{"id":"explicit.stat_664010431"},{"id":"explicit.stat_2620267328"}],"type":"count","value":{"min":1}}]},"sort":{"price":"asc"}}'
    let rqbody = '{"query":{"status":{"option":"onlineleague"},"stats":[{"type":"and","filters":[{"id":"explicit.stat_1625939562"},{"id":"explicit.stat_164032122 "}]},{"type":"count","value":{"min": 1},"filters":[{"id":"explicit.stat_1543731719"},{"id":"explicit.stat_282062371"}]}]}';
    fetch("https://www.pathofexile.com/api/trade/search/Sentinel", {
        method: "POST",
        headers: {'Content-Type': 'application/json'}, 
        body: rqbody
      }).then(res => {
        console.log(res);
      });
}


function getSearchUrl(body) {
    var queryStringified = JSON.stringify(body);
    var queryUrlEncoded = encodeURIComponent(queryStringified);
    return tradePathBase + queryUrlEncoded;
}

function generateBody3n2d(desired = [], others = [], enchant = null) {
    let base_request = {
        "sort":{"price":"asc"},
        "query":{
            "status":{"option":"onlineleague"},
            "stats": []
        }
    };

    let and_body = {
        "type":"and",
        "filters":[]
    };

    let count_body = {
        "type":"count",
        "value":{"min":1},
        "filters":[]
    }

    let numPassives = {
        value: {max: 8, min: 8},
        id: megaStruct.TradeStats.Enchant["Adds # Passive Skills"]["id"]
    };

    and_body.filters.push(numPassives);

    if (enchant != null) {
        let enchantKey = getEnchantKey(enchant);
        enchants = {
            id: megaStruct.TradeStats.Enchant["Added Small Passive Skills grant: #"]["id"],
            value: {
                option: enchantMap[enchantKey].id
            }
        };
        
        and_body.filters.push(enchants);
    }

    for (const de of desired) {
        let id = getNotableTradeId(de);
        let filter = {"id": id};
        and_body.filters.push(filter);
    }

    for (const oth of others) {
        let id = getNotableTradeId(oth);
        let filter = {"id": id};
        count_body.filters.push(filter);
    }

    base_request.query.stats.push(and_body);
    base_request.query.stats.push(count_body);

    return base_request;
}

function getNotableTradeId(notable) {
    return megaStruct.TradeStats.Explicit[notable];
}