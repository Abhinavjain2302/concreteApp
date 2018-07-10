/**
 * Created by glitch on 27/11/17.
 */


/// sql logics

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
   /// if(err) throw err;
   // console.log("Connected");
    var sql = "CREATE TABLE IF NOT EXISTS quotes (quantity VARCHAR(255), quality VARCHAR(255), customerSite VARCHAR(255), generationDate VARCHAR(255), requiredDate VARCHAR(255) , requestedBy VARCHAR(255) , requestedByCompany VARCHAR(255), requestedById int, quoteId int AUTO_INCREMENT PRIMARY KEY) ";
    connection.query(sql,function(err,result){
   if(err) throw err;
   console.log("Table created  for quotes");

    });
});
























/*
var mongoose = require('mongoose');
var connection = mongoose.connect('mongodb://localhost:27017/concrete'); //('mongodb://localhost:27017/concrete');//connecting to our database named concrete
var bcrypt = require('bcrypt');
//creating the USER Schema
var QuoteSchema = mongoose.Schema({
    generationDate:{
        type:String,
        required:true
    },
    requiredDate:{
        type:String,
        required:true
    },
    quantity:{
        type:String,
        required:true
    },
    quality:{
        type:String,
        required:true
    },
    customerSite:{
        type:String,
         required:true
    },
    requestedBy:{
        type:String,
        required:true
    },
    requestedByCompany:{
        type:String,
        required:true
    },
    requestedById:{
        type:mongoose.Schema.Types.ObjectId,
        required:true
    },
    responses:[{
        rmxId:mongoose.Schema.Types.ObjectId,
        price:Number,
        validTill:String
    }]
});


var Quote = module.exports = mongoose.model('Quote', QuoteSchema);

module.exports.getAllQuotesForSupplier = function(callback){
    console.log("about to find quotes");
    Quote.find({}, callback);
}
module.exports.getAllQuotesByUserId = function(id, callback){
    Quote.find({requestedById:id}, {} , callback);
}

module.exports.addQuote = function(newQuote, callback){
    newQuote.save(newQuote, callback);
}

module.exports.respondToQuote = function(quoteId, response, callback){
    console.log(response);
    Quote.findOneAndUpdate({_id:quoteId}, {$push : {'responses':response}}, {safe:true, upsert:true} , callback);
}

module.exports.deleteResponse = function(quoteId, responseId, callback){
    Quote.findOneAndUpdate({_id:quoteId}, {$pull: {responses:{_id:responseId}}}, callback);
}

module.exports.cancelQuote = function(quoteId, callback){
    Quote.findOneAndRemove({_id:quoteId}, callback);
}*/