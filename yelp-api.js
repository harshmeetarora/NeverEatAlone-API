let yelp = require('yelp-fusion');
const apiKey = 'GRKfXDrk_H5DsAW-4sOo3HndzNa_NwXPlwXSks0Mhy37dHaRSmL9eOC6rmDrt88JMcfA8IiQUJaxH3ZCgIva66wLMSQYRFmr6_IeRcz3HJx5zq_YmdZpJz85D1nvW3Yx';

var latitude = '49.246292' ;
var longitude = '-123.116226' ;
var radius ='10';
var term = "bar";

var getYelpRecommendation = function(latitude, longitude, radius, keyword){
    const client = yelp.client(apiKey);
    const searchRequest = { 'latitude': latitude,
                        'longitude': longitude,
                        'radius': radius,
                        'term': keyword};
    client.search(searchRequest).then(response => {
        const prettyJson = JSON.stringify(response, null, 4);
        console.log(prettyJson);
    }).catch(e => {
        console.log(e);
    });
};

module.exports = {
    getYelpRecommendation : getYelpRecommendation
}