var MongoClient = require('mongodb').MongoClient;
var async = require("async");

var url = 'mongodb://localhost:27017';


var Model = function(){

}

Model.generate = function(collectionName, schema){
	
	var GenericModel = function(internalProperties){
		if(internalProperties == undefined){
			internalProperties = {};
		}
		/*We put null on every value of the schema*/
		for (var property of GenericModel.schema) {	
			if(this[property] == undefined){
				this[property] = null;
			}
		}
		var cleanedProperties = GenericModel.initializationOfInternalProperties(internalProperties);
		for (var property in cleanedProperties) {	
			this[property] = cleanedProperties[property];
		}

	}

	GenericModel.schema = schema;
	GenericModel.modelName = collectionName;

	GenericModel.initializationOfInternalProperties = function(properties){

		var businessObjectToReturn = {};
				
		Object.keys(properties).forEach(function (element, index) {
			if(GenericModel.schema[index] !== undefined){//Here the strictely different is very important otherwise the null value will be considered as undefined
				businessObjectToReturn[element] = properties[element];
			}
		});
		
		return businessObjectToReturn;
	};

	/*Static method to find documents*/
	GenericModel.find = function(criterias, callback){
		
		GenericModel.login(function(err, db){
			var collection = db.collection(GenericModel.modelName);
			collection.find(criterias).toArray(function(err, result){
				GenericModel.logout(err,db);
				result.forEach(function (element, index) {
					result[index] = new GenericModel(element);
				});
				callback(err, result);
			});
		});
	};

	GenericModel.prototype.save = function(callback){
		
		var referenceThis = this;

		GenericModel.login(function(err, db){
			var collection = db.collection(GenericModel.modelName);
			
			
			//We are fetching all the internal properties of the Model (even the self defined getters)
			var allInternalPropertiesOfTheModel = {};
			for (var property of GenericModel.schema) {	
				allInternalPropertiesOfTheModel[property] = referenceThis[property];
			}
					
			collection.insert(allInternalPropertiesOfTheModel, function(err, result){
				
				if(referenceThis._id == undefined){//In case of update don't enter here
					//Let's give him and internal id.
					referenceThis._id = result.insertedIds[0];
				}				
				GenericModel.logout(err,db);
				callback(err, result);
			});
		});
	};

	GenericModel.update = function(criterias, propertiesToUpdate, callback){
		GenericModel.login(function(err, db){
			var collection = db.collection(GenericModel.modelName);
			collection.update(criterias, {$set:propertiesToUpdate}, { multi: true }, function(err, result){
				GenericModel.logout(err,db);
				callback(err, result);
			});
		});
	};
	
	GenericModel.delete = function(criterias, callback){
		GenericModel.login(function(err, db){
			var collection = db.collection(GenericModel.modelName);
			collection.remove(criterias, function(err, result){
				GenericModel.logout(err,db);
				callback(err, result);
			});
		});
	};

	GenericModel.prototype.delete = function(callback){
		var referenceThis = this;

		GenericModel.login(function(err, db){
			var collection = db.collection(GenericModel.modelName);
			collection.deleteOne({_id : referenceThis._id}, function(err, result){
				GenericModel.logout(err,db);
				callback(err, result);
			});
		});
	};
	
	//We redefine the method that console.log will call. We want to make sure to print all the properties present within the schema.
	GenericModel.prototype.inspect = function test() {
		var objectToReturn = {};
			
		for (var property of GenericModel.schema) {		
			objectToReturn[property] = this[property];
		}
		
		return objectToReturn;
	}

	/*A pool of connection could be used in order to improve performances instead of reconnect to the database for each request*/
	GenericModel.login = function(callback){
		MongoClient.connect(url, function(err, db) {
			callback(err, db);
		});
	};

	GenericModel.logout = function(err, db){
		db.close();
	};

	return GenericModel;
}


module.exports = Model;