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

 
connection.connect(function(err){
    //if(err) throw err;
   // console.log("Connected");
    var sql = "CREATE TABLE IF NOT EXISTS Issues (title VARCHAR(255), type VARCHAR(255), description VARCHAR(255), orderId int, userId int, date VARCHAR(255) , status VARCHAR(255)  )";
    connection.query(sql,function(err,result){
   if(err) throw err;
   console.log("Table created  for Issues");

    });
});




var Issue = module.exports;

















/*
var mongoose = require('mongoose');
var connection = mongoose.connect('mongodb://localhost:27017/concrete'); //('mongodb://localhost:27017/concrete');//connecting to our database named concrete

//creating the USER Schema
var IssueSchema = mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    type:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    resolved:{
        type:Boolean,
        required:true,
        default:false
    },
    orderId:{
        type:mongoose.Schema.Types.ObjectId
    },
    status:{
        type:String,
        required:true
    },
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true
    },
    date:{
        type:String,
        required:true
    }
});


var Issue = module.exports = mongoose.model('Issue', IssueSchema);

module.exports.getAllIssuesByUserId = function(id, callback){
    Issue.find({userId:id}, {} , callback);
}

module.exports.addIssue = function(newIssue, callback){
    newIssue.save(newIssue, callback);
}
*/
