var Model = require("./GenericModel");

var UserModel = Model.generate("user", ["_id","a","b","c", "d"]);

//We can now define custom setter / getter 

//Now each time we will try to get the d variable this getter will return the value a +1.
Object.defineProperty(UserModel.prototype, "d", { 
	get: function () { 
		return this.c + 1; 
	},
	set: function (value) { 
		this.a = value+10;
		this.b = value - 10;
	} 
});

module.exports = UserModel;