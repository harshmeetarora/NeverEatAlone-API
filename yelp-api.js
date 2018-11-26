let yelp = require('yelp-fusion');
const apiKey = 'GRKfXDrk_H5DsAW-4sOo3HndzNa_NwXPlwXSks0Mhy37dHaRSmL9eOC6rmDrt88JMcfA8IiQUJaxH3ZCgIva66wLMSQYRFmr6_IeRcz3HJx5zq_YmdZpJz85D1nvW3Yx';


var getYelpRecommendation = function(latitude, longitude, radius, keyword){
    const client = yelp.client(apiKey);
    const searchRequest = { 'latitude': latitude,
                        'longitude': longitude,
                        'radius': radius,
                        'term': keyword};
    var prettyJson ={};

    return new Promise(function (resolve, reject) {
        client.search(searchRequest).then(response => {
            prettyJson = JSON.stringify(response, null, 4);
            //console.log(prettyJson);
            resolve(prettyJson);
        }).catch(e => {
            console.log(e);
        });
    });


};

module.exports = {
    getYelpRecommendation : getYelpRecommendation
}