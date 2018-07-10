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
    //if(err) throw err;
   // console.log("Connected");
    var sql = "CREATE TABLE IF NOT EXISTS purchaseorder (generationDate VARCHAR(255), validTill VARCHAR(255),  quantity VARCHAR(255), quality VARCHAR(255), price VARCHAR(255) , remQuantity VARCHAR(255) , customerSite VARCHAR(255), requestedBy VARCHAR(255) , requestedById int , supplierId int , requestedByCompany VARCHAR(255) , confirmedBySupplier VARCHAR(255), POId int AUTO_INCREMENT PRIMARY KEY)";
    connection.query(sql,function(err,result){
   if(err) throw err;
   console.log("Table created  for purchaseorder");

    });
});















/*
var mongoose = require('mongoose');
var connection = mongoose.connect('mongodb://localhost:27017/concrete'); //('mongodb://localhost:27017/concrete');//connecting to our database named concrete
var bcrypt = require('bcrypt');
//creating the USER Schema
var POSchema = mongoose.Schema({
    generationDate:{
        type:String,
        required:true
    },
    validTill:{
        type:String,
        required:true
    },
    quantity:{
        type:Number,
        required:true
    },
    quality:{
        type:String,
        required:true
    },
    remQuantity:{
        type:Number,
        required:true
    },
    price:{
        type:Number,
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
    supplierId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true
    },
    confirmedBySupplier:{
        type:Boolean,
        default:false
    },
    deletedByContractor:{
        type:Boolean,
        default:false
    }
});


var PO = module.exports = mongoose.model('PO', POSchema);

module.exports.createPO = function(newPO, callback){
    newPO.save(newPO, callback);
}

module.exports.deletePOByContractor = function(id, callback){
    PO.findOneAndUpdate({_id:id}, {deletedByContractor:true}, callback);
}

module.exports.confirmPOBySupplier = function(id, callback){
    PO.findOneAndUpdate({_id:id}, {confirmedBySupplier:true}, callback);
}

module.exports.findPendingPOSupplier = function(id, callback){
    PO.find({supplierId:id}, callback);
}

module.exports.findPoByContractor = function(id, callback){
    PO.find({requestedById: id} , callback);
}

module.exports.findPoBySupplier = function(id, callback){
    PO.find({supplerId:(id)} , callback);
}

module.exports.findPoByPOId = function(id, callback){
    PO.findById({_id: id}, callback);
}*/