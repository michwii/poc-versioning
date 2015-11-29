var userServices = require("./services/userServices");

userServices.createUser({a:1, b:2, c:3}, function(err, results){
	console.log(results);
});

