var Model = require("./GenericModel");

var UserModel = Model.generate("user", ["_id","a","b","c"]);

module.exports = UserModel;