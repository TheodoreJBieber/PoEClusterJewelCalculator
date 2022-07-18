import React from 'react';
import { getEnchantKey, includesEnchant } from './Calculator';
import megaStruct from '../data/data.json';
import { enchantMap } from './Calculator';


const tradePathBase = "https://www.pathofexile.com/trade/search/Sentinel?q=";

class TradeUrl extends React.Component {
    render() {
        let enchantDescription = "Any Enchant: ";
        let url = null;
        let body = null;
        if (this.props.ench) {
            let enchantKey = getEnchantKey(this.props.ench);
            enchantDescription = enchantMap[enchantKey].text;
            body = this.generateBody3n2d(this.props.desired, this.props.notableNames, this.props.ench);
            url = this.getSearchUrl(body);
        } else {
            body = this.generateBody3n2d(this.props.desired, this.props.notableNames);
            url = this.getSearchUrl(body);
        }
        return (
            <div>
                <div>{enchantDescription}</div>
                <a href={url} target={"_blank"}>Go to trade</a>
            </div>
        );
    }

    getSearchUrl(body) {
        var queryStringified = JSON.stringify(body);
        var queryUrlEncoded = encodeURIComponent(queryStringified);
        return tradePathBase + queryUrlEncoded;
    }

    
    generateBody3n2d(desired = [], others = [], enchant = null) {
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
            let enchants = {
                id: megaStruct.TradeStats.Enchant["Added Small Passive Skills grant: #"]["id"],
                value: {
                    option: enchantMap[enchantKey].id
                }
            };
            
            and_body.filters.push(enchants);
        }
    
        for (const de of desired) {
            let id = this.getNotableTradeId(de);
            let filter = {"id": id};
            and_body.filters.push(filter);
        }
    
        for (const oth of others) {
            let id = this.getNotableTradeId(oth);
            let filter = {"id": id};
            count_body.filters.push(filter);
        }
    
        base_request.query.stats.push(and_body);
        base_request.query.stats.push(count_body);

        console.log(base_request);

        return base_request;
    }
    
    getNotableTradeId(notable) {
        return megaStruct.TradeStats.Explicit[notable];
    }
}

export default TradeUrl;