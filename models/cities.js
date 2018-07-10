

//connection
var mysql= require('mysql');
var connection=mysql.createConnection({
      host:"localhost",
      user:"root",
      password:"abhi",
      database:"concrete"

});

//creating CitySchema table
 
connection.connect(function(err){
	//if(err) throw err;
	console.log("Connected");
    var sql = "CREATE TABLE IF NOT EXISTS cities (cityName VARCHAR(255))";
    connection.query(sql,function(err,result){
   if(err) throw err;
   console.log("Table created for cities");

    });
});



var City = module.exports ;  // ={connection.query("select * from CitySchema",function(err,result,function(result){
   // if(err) throw err;
    
 //) };

// = mongoose.model('City', CitySchema);

/*
module.exports.saveCity = function (newCity, callback) {
    newCity.save(newCity, callback);
};

 function getAllCities(callback){
	//City.find({}, callback);
  var a;
   connection.connect(function(err){
   if(err) throw err;
   var sql="select * from CitySchema";
   connection.query(sql,function(err,result,field){
      if(err) throw err;
     a=result[0];
   });

});
console.log("hello");
	callback(a);
	//query
	//if 
	//else{
	//	res.json
	//}
}

*/





/**
 * Created by glitch on 27/11/17.
 */
/*
var mongoose = require('mongoose');
var connection = mongoose.connect(process.env.DB);//('mongodb://localhost:27017/concrete');//connecting to our database named concrete

//creating the USER Schema
var CitySchema = mongoose.Schema({
    cityName:{
        type:String
    }
});
*/
/*
var City = module.exports = mongoose.model('City', CitySchema);


module.exports.saveCity = function (newCity, callback) {
    newCity.save(newCity, callback);
};

module.exports.getAllCities = function(callback){
	City.find({}, callback);
}.*/