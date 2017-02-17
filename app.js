var express = require('express'), 
	app = express(),
	bodyParser = require('body-parser'),
	ip2loc = require("ip2location-nodejs");

ip2loc.IP2Location_init("IP2LOCATION-LITE-DB5.BIN/IP2LOCATION-LITE-DB5.BIN");

var port = 5000;

app.use(bodyParser.json());

app.route('/')
	.post(function(req, res) {
	var testip = req.body.list,
		result, 
		results = [],
		countDict = {};	

	//Query the database for each of the IPs
	for (var x = 0; x < testip.length; x++) {
		result = ip2loc.IP2Location_get_all(testip[x]);
	
		results.push({
					"ip": result["ip"],
					"country": result["country_long"],
					"city": result["city"]
		});
	}
	//Count the number of IPs in each of the present cities
	for (var x = 0; x < results.length; x++) {
		if (countDict[results[x].city] === undefined) {
			countDict[results[x].city] = 1;
		} else {
			countDict[results[x].city]++; 
		}
	}
	res.send(countDict);
});

app.listen(5000, function(err) {
	console.log("Running server on port " + port);
});
