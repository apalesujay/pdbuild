'use Strict'

var commonService=require('../services/commonService');

exports.getLoctaion = function (req, res) {
var citylist=["pune","bengaluru"];
var resp=commonService.detectLocation(req.query.lat,req.query.lon);
resp.then(function(data) {
    console.log(data);
    if (data != undefined && data[0] != undefined && data[0].city != "undefined" && citylist.indexOf(data[0].city.toLowerCase()) > -1) {
        res.status(200).send(data[0].city.toLowerCase());
    } else {
        res.status(200).send("wrongLocation");
    }
    
}).catch(function(err)
{
    console.log(err);
    res.status(500).send("error");
})

}