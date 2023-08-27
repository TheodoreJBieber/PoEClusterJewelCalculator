import React from 'react';
import { getEnchantKey } from './Calculator';
import megaStruct from '../data/data.json';
import { enchantMap } from './Calculator';

class TradeUrl extends React.Component {

    render() {
        if (this.props.allDesired != null) {
            let enchantDescription = "Any selected notables";
            let body = this.generateBodyAnySelected(this.props.allDesired, this.props.allUndesired);
            let url = this.getSearchUrl(body);
            return (
                <div>
                    <span style={{textDecoration: "underline"}}>{enchantDescription + ":"}</span><span> </span>
                    <a href={url} target={"_blank"}  rel={"noreferrer"}>Go to trade</a>
                </div>
            );
        }

        let enchantDescription = "Any Enchant";
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
                <span style={{textDecoration: "underline"}}>{enchantDescription + ":"}</span><span> </span>
                <a href={url} target={"_blank"}  rel={"noreferrer"}>Go to trade</a>
            </div>
        );
    }

    getSearchUrl(body) {
        var queryStringified = JSON.stringify(body);
        var queryUrlEncoded = encodeURIComponent(queryStringified);
        return this.props.tradePathBase + queryUrlEncoded;
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

        return base_request;
    }



    generateBodyAnySelected(allDesired, allUndesired) {let base_request = {
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

    let count_body_desired = {
        "type":"count",
        "value":{"min":2},
        "filters":[]
    };

    let count_body_undesired = {
        "type":"count",
        "value":{"min":1},
        "filters":[]
    }

    let numPassives = {
        value: {max: 8, min: 8},
        id: megaStruct.TradeStats.Enchant["Adds # Passive Skills"]["id"]
    };

    and_body.filters.push(numPassives);

    for (const de of allDesired) {
        let id = this.getNotableTradeId(de);
        let filter = {"id": id};
        count_body_desired.filters.push(filter);
    }

    for (const oth of allUndesired) {
        let id = this.getNotableTradeId(oth);
        let filter = {"id": id};
        count_body_undesired.filters.push(filter);
    }

    base_request.query.stats.push(and_body);
    base_request.query.stats.push(count_body_desired);
    base_request.query.stats.push(count_body_undesired);

    return base_request;
        
    }
    
    getNotableTradeId(notable) {
        return megaStruct.TradeStats.Explicit[notable];
    }
}

export default TradeUrl;