var userServices = require("./services/userServices");

userServices.findUsers({c:3}, function(err, results){
	console.log(results);
});

