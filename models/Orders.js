/**

 * Created by glitch on 27/11/17.
 */
var mysql= require('mysql');
/// sql logics

//connection

var connection=mysql.createConnection({
      host:"localhost",
      user:"root",
      password:"abhi",
      database:"concrete"
     
});

//creating CitySchema table
 
connection.connect(function(err){
   // if(err) throw err;
   // console.log("Connected");
    console.log('Connected');
    //var sql = ;
    connection.query("CREATE TABLE IF NOT EXISTS orders (orderId int AUTO_INCREMENT PRIMARY KEY, generationDate VARCHAR(255), requiredByDate VARCHAR(255), quality VARCHAR(255), quantity VARCHAR(255), requestedBy VARCHAR(255) , requestedById int , supplierId int , companyName VARCHAR(255), customerSite VARCHAR(255) , POId int , statusDate VARCHAR(255) , statusDesc VARCHAR(255))",function(err,result){
   if(err) throw err;
   console.log("Table created  for orders");

    });
});






















/*


var mongoose = require('mongoose');
var connection = mongoose.connect('mongodb://localhost:27017/concrete'); //('mongodb://localhost:27017/concrete');//connecting to our database named concrete
var bcrypt = require('bcrypt');
//creating the USER Schema
var OrderSchema = mongoose.Schema({
    generationDate:{
        type:String,
        required:true
    },
    requiredByDate:{
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
    requestedBy:{
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
    companyName:{
        type:String,
        required:true
    },
    customerSite:{
        type:mongoose.Schema.Types.ObjectId
    },
    POId:{
        type: mongoose.Schema.Types.ObjectId
    },
    status:String,
    statusDate:String,
    statusDesc:String
});


var Order = module.exports = mongoose.model('Order', OrderSchema);

module.exports.getAllOrdersByUserId = function(id, callback){
    Order.find({requestedById:id}, {} , callback);
}

module.exports.getAllOrderdBySupplierId = function(id, date, callback){
    Order.find({supplierId:id, generationDate:{ $lt: date}}, {} , callback);
}

module.exports.createOrder = function(newOrder, callback){
    newOrder.save(newOrder, callback);
}

module.exports.cancelOrder = function(orderId, reason, callback){
    Order.findOne({_id:orderId}, function(err, order){
        if(err)throw err;
        order.statusDesc = reason;
        order.status = 'cancelled';
        order.statusDate = Date.now();
        order.save(function(err){
            callback(err, order);
        });
    })
}   


module.exports.getOrdersForResponseBySupplierId = function(id, date, callback){
    Order.find({ supplierId:id, generationDate: { $gt : date} }, callback);
}

module.exports.getCancelledOrdersForResponseBySupplierId = function(id, date, callback){
    Order.find({ supplierId:id, status: 'cancelled', generationDate: {$gt: date} }, callback);
}

module.exports.updatePendingOrder = function(orderId, status, statusDesc, statusDate, callback){
    Order.findOneAndUpdate({_id:orderId}, {status:status, statusDesc:statusDesc, statusDate:statusDate}, callback);
}

module.exports.getAllOrderdByUserId = function(id, date, callback){
    Order.find({supplierId: id, generationDate: {$lt: date}}, callback);
}*/