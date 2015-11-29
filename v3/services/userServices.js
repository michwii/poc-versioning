var UserModel = require("./../models/UserModel");

exports.createUser = function(dataComingFormTheController, callback){
	var user1 = new UserModel(dataComingFormTheController);
	user1.save(callback);
};

exports.updateUsers = function(criterias, newValues, callback){
	UserModel.update(criterias, newValues, callback);
};

exports.findUsers = function(searchCriterias, callback){
	UserModel.find(searchCriterias, callback);
};

exports.deleteUsers = function(criterias, callback){
	UserModel.delete(criterias, callback);
};
