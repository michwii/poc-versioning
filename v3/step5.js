var userServices = require("./services/userServices");

userServices.findUsers({c:3}, function(err, results){
	var userToUpdate = results[0];
	
	console.log(userToUpdate);
	
	userToUpdate.d = 4;//We pass through the manual setter just to modify a variable;
	userToUpdate.save(function(err, result){//We pass through the override save method
		console.log(userToUpdate);
	});
});

