
import React from 'react';
import megaStruct from '../data/data.json';

class TemplateUrl extends React.Component {

    render() {
        let body = this.generateBody(this.props.min, this.props.max, this.props.ilvlMin, this.props.ilvlMax);
        let url = this.getSearchUrl(body);

        return (
            <div>
                <span style={{textDecoration: "underline"}}>{this.props.description + ":"}</span><span> </span>
                <a href={url} target={"_blank"}  rel={"noreferrer"}>Open Trade</a>
            </div>
        );
    }


    getSearchUrl(body) {
        var queryStringified = JSON.stringify(body);
        var queryUrlEncoded = encodeURIComponent(queryStringified);
        return this.props.tradePathBase + queryUrlEncoded;
    }

    generateBody(min, max, ilvlMin = null, ilvlMax = null) {
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

        let numPassives = {
            value: {max: max, min: min},
            id: megaStruct.TradeStats.Enchant["Adds # Passive Skills"]["id"]
        };

        and_body.filters.push(numPassives);

        let enchants = {
            id: megaStruct.TradeStats.Enchant["Added Small Passive Skills grant: #"]["id"],
            value: {
            }
        };
        
        and_body.filters.push(enchants);

        base_request.query.stats.push(and_body);

        if (ilvlMin != null 
            || ilvlMax != null) {
            base_request.query.filters = {
                misc_filters: {
                    filters: {
                        ilvl: {
                        }
                    }
                }
            }
        }
        if (ilvlMin != null) {
            base_request.query.filters.misc_filters.filters.ilvl.min = ilvlMin;
        }

        if (ilvlMax != null) {
            base_request.query.filters.misc_filters.filters.ilvl.max = ilvlMax;
        }


        return base_request;
    }
}

export default TemplateUrl;