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
    if(err) throw err;
   // console.log("Connected");
    var sql = "CREATE TABLE IF NOT EXISTS user (userId int AUTO_INCREMENT PRIMARY KEY, name VARCHAR(255),  email VARCHAR(255), custType VARCHAR(255), contact int(20) , pan VARCHAR(255) , company VARCHAR(255) , gstin VARCHAR(255), password VARCHAR(255) , userType VARCHAR(255) , resetPasswordExpire VARCHAR(255) , resetPasswordToken VARCHAR(255) , verified ENUM ('true', 'false') )";
    connection.query(sql,function(err,result){
   if(err) throw err;
   console.log("Table created  for user");

    });
});

connection.connect(function(err){
   
 var sql = "CREATE TABLE IF NOT EXISTS customerSite (address VARCHAR(255) , lon VARCHAR(255), lat VARCHAR(255) , name VARCHAR(255), customerSiteId int AUTO_INCREMENT PRIMARY KEY , userId  int , city VARCHAR(255))";
    connection.query(sql,function(err,result){
   if(err) throw err;
   console.log("Table created  for customerSite");


});
});

























/*

var mongoose = require('mongoose');
var connection = mongoose.connect('mongodb://localhost:27017/concrete');//('mongodb://localhost:27017/concrete');//connecting to our database named concrete
var bcrypt = require('bcrypt');
//creating the USER Schema
var UserSchema = mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    custType:{
        type:String
    },
    email:{
        type:String,
        required:true
    },
    contact:{
        type:Number,
        required:true
    },
    company:{
        type: String
    },
    userType:{
        type:String,
        required:true
    },
    pan:{
        type:String
    },
    city:{
        type:String
    },
    gstin:{
        type:String
    },
    password:{
        type:String,
        bcrypt:true,
        required:true
    },
    resetPasswordToken:{
        type:String
    },
    resetPasswordExpire:{
        type:String
    },
    customerSite:[{
        name:{
            type:String
        },
        lat:{
            type:String
        },
        city:{
            type:String
        },
        long:{
            type:String
        },
        address:{
            type:String
        }
    }],
    verified:{
        type:Boolean,
        default:false
    }
});


var User = module.exports = mongoose.model('User', UserSchema);

module.exports.findByUsername = function (username, callback) {
    console.log(username);
    User.findOne({email:username}, callback);
};

module.exports.createUser = function (newUser, callback) {
    bcrypt.hash(newUser.password, 10, function(err, hash){
        if(err)throw err;
        newUser.password = hash;
        newUser.save(newUser, callback);
    });
};

module.exports.comparePassword = function(candidatePassword, password, callback){
    bcrypt.compare(candidatePassword, password, function(err, isMatch){
        if(err)return callback(err, false);
        return callback(null, isMatch);
    })
}

module.exports.findOneById = function(id, callback){
    User.findOne({_id:id}, {}, callback);
}

module.exports.findOneByEmail = function(email, callback){
    User.findOne({email:email}, callback);
}
module.exports.findOneForResetPassword = function(resetPasswordToken, callback){
    User.findOne({resetPasswordToken:resetPasswordToken, resetPasswordExpire: {$gt:Date.now()}}, callback)
}
module.exports.saveUserResetPassword = function(user, callback){
    bcrypt.hash(user.password, 10, function(err, hash){
        if(err)throw err;
        user.password = hash;
        user.save(callback); 
    });    
}
module.exports.updateUser = function(id, newUser, callback){
    User.findOneAndUpdate({_id:id}, newUser, callback);
}

module.exports.addSite = function(customerSite, id,callback){
    console.log(customerSite);
    User.findOneAndUpdate({_id:id}, {$push: {'customerSite':customerSite}}, {safe:true, upsert:true}, callback);   
}

module.exports.removeSite = function(userid, siteid, callback){
    User.findOneAndUpdate({_id:userid}, {$pull: {customerSite : {_id:siteid}}},callback);
}

module.exports.getPendingProfilesForVerification = function(callback){
    User.find({verified: false, userType:'supplier'}, callback)
}*/