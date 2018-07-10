 var express = require('express');
var router = express.Router();
var crypto = require('crypto');
var nodemailer = require('nodemailer');
//this is used for generating SVG Captchas
var svgCaptcha = require('svg-captcha');
var async = require('async');
var jwt = require('jsonwebtoken');
const secret = "supersecretkey";
var mysql= require('mysql');
var bcrypt = require('bcrypt');
//for qr image matrix to pixels
var savePixels = require("save-pixels")
//importing passport and its local strategy
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
//var sync = require('synchronize')
//qr packages
var qr = require('qr-image');
var fs = require('fs');



var sendgridUser = process.env.SENDGRID_USERNAME;
var sendgridPass = process.env.SENDGRID_PASS;
//var LocalStrategy = require('passport-local').Strategy;

//here we import the User model
//var User  = require('../models/User');
var Order = require('../models/Orders');
var Issue = require('../models/Issues');
var Quote = require('../models/Quotations');
var PO    = require('../models/PurchaseOrder');
var City = require('../models/Cities');



// sql functions
// mysql connection establishment
var connection=mysql.createConnection({
      host:"localhost",
      user:"root",
      password:"abhi",
      database:"concrete"

});



//These are all the get requests

/* GET home page. */
router.get('/', isAuthenticated, function(req, res, next){
    console.log(res.locals);
    getAllUserDashboardDetails(req, res, res.locals.userId);
    
});

//for getting signup page
router.get('/signup', function(req, res, next){
    res.render('signup');
});



function getAllUserDashboardDetails(req, res, userId, token){
    

    async.parallel({
        orders: function(callback) {
           // Order.getAllOrdersByUserId(userId, callback)
            connection.connect(function(err){
            // if(err) throw err;
		    console.log("Connected from getAllOrderdByUserId");
		    //requestedById not here
		    var sql="select * from orders where requestedById='"+userId+"'";
		    connection.query(sql,function(err,result,fields){
		     if(err) throw err;
		     callback(err,result);
		   });
	   });
   },


            issues: function(callback) {
             connection.connect(function(err){
             //if(err) throw err;
		    console.log("Connected from getAllIssuesByUserId");
		    connection.query("select * from issues where userId='"+userId+"'",function(err,result,fields){
		     if(err) throw err;
		        callback(err,result);
		        });
	         });
        },

             
        
        quotes: function(callback){
        var quantityArray=[]; 
        var qualityArray=[];    
        var array=[];
         var result=[];
           var temp=[];
           var i,j=0;

           connection.connect(function(err){
             
        connection.query("select distinct customerSite,generationDate,requiredDate,requestedBy,requestedByCompany,requestedById,quoteId from quotes where requestedById='"+userId+"'",function(err,result1,fields){
		     if(err) throw err;
 
          connection.query("select * from quotes where requestedById='"+userId+"' order by quoteId",function(err,result5,fields){
          if(err) throw err;
 


         connection.query("select quoteId , count(quoteId) as number from quotes where requestedById='"+userId+"' group by quoteId having number>1",function(err,result6,fields){
        if(err) throw err;
          else{
            console.log(result5);
            console.log(result6);
           for(var i=0;i<result5.length;i++){
            temp = [];
            console.log("yaha...........................1"+i);
                 //console.log(result6[j].number);
          ///  for(var k=0;k<result6[j].number;k++){
           for(var j=0;j<result6.length;j++)
           {
            console.log("yaha...........................2"+i+j);
            
            if(result5[i].quoteId==result6[j].quoteId)
                  {
                    for(var k =0; k<result6[j].number;k++)
                    {
                      console.log("yaha...........................3"+i+j+k);
                      temp.push(result5[i+k].quality);
                     // i++;
                    }
                    i++;

                }
                  // j=result6.length;
              }
             // console.log(temp.length);
            if(temp.length<=0){
                     
                      console.log(result5[i].quality);
                     temp.push(result5[i].quality);
                   
                    }
              qualityArray.push(temp);      


            }

console.log(qualityArray);
}


        //if(result6.length<0){
          //console.log("no multiple quality and quantity");
         //}
        /*else{

                 for(var j=0;j<result6.length;j++){
                 console.log(result6[j].number);
                 for(var i=0;i<result5.length;i++){
                if(result6[j].quoteId==result5[i].quoteId){
                     for(var k=0;k<result6[j].number;k++){

                    qualityArray[k].push(result5[i].quality);
                     }

               console.log(result5[i].quality);
                }
                else{
                  qualityArray.push([]);
                }

        }
         }
       }*/
         //console.log(result6[0].length);

      /*   if(result5[8].quoteId==10){
          qualityArray[2].push(result5[8].quality);
         }
         console.log(result5[8].quality);*/




/*console.log(result5);
for(var i=0;i<result5.length;i++){
  for(var j=i+1;j<result5.length;j++){
  if(result5[i].quoteId==result5[j].quoteId)
  {
       /* quantityArray[i]=result1[i].quantity;
        quantityArray[i+1]=result1[i+1].quantity;
        qualityArray[i]=result1[i].quality;
        qualityArray[i+1]=result1[i+1].quality;
        quantityArray.push([result5[i].quantity]);
         quantityArray.push([result5[j].quantity]);
          qualityArray.push([result5[i].quality]);
           qualityArray.push([result5[j].quality]);
  }
  else{
            quantityArray.push([result5[i].quantity]);
             qualityArray.push([result5[i].quality]);
}
  }
}
*/
/*
   var sql="select quantity,quality from multipledata where id IN (";
      for(i=0;i<result1.length;i++){
       var sql= sql+result1[i].id+",";
         }
         sql=sql.slice(0,-1);
         sql=sql+")";
         connection.query(sql,function(err,result4,fields){
         if(err) throw err;
         console.log(result4);
        // for(i=0;i<result1.length;i++){*/

      /*  connection.query("select distinct quoteId from quotes where requestedById='"+userId+"'",function(err,result5,fields){
         if(err) throw err;
*/
/*var a="";
connection.query("select quality,quantity from multipledata where quoteId='"+result6[0].quoteId+"'",function(err,result7,fields){
         if(err) throw err;
         for(var i=0;i<result6[0].number;i++){
               //a=a+result7[i].quality+","+'"';
               qualityArray.splice(1,0,[result7[i].quality])
            }
          //  a=a.slice(0,-1);
               
            ///  qualityArray.push([a]);
              console.log(result7);
                //qualityArray[8]=[result7[i].quality]
                    //qualityArray.push([result7[1].quality]);*/

      var sql="select distinct * from responses where userId='"+userId+"' && quoteId IN (";
      for(i=0;i<result1.length;i++){
       var sql= sql+result1[i].quoteId+",";
         }
         sql=sql.slice(0,-1);
         sql=sql+")";

       connection.query(sql,function(err,results,fields){
         //console.log(results);
         if(err) throw err;
             
            for(i=0;i<result1.length;i++)
            {
               
             for(var j=0;j<results.length;j++){

                 if(results[j].quoteId==result1[i].quoteId){
                 
                   
                     array[i].push(results[j]);
                   }
                 else {    
                  array.push([]);  
                }
                            
                         }
                        }
              
              for(i=0;i<result1.length;i++){
           result[i]={
                   "quantity":  quantityArray[i],
                   "quality":   qualityArray[i],
                   "customerSite": result1[i].customerSite,
                   "generationDate": result1[i].generationDate,
                   "requiredDate": result1[i].requiredDate,
                   "requestedBy": result1[i].requestedBy,
                   "requestedByCompany": result1[i].requestedByCompany,
                   "requestedById": result1[i].requestedById,
                   "quoteId": result1[i].quoteId,
                   "responses": array[i]
                 }
  
             }  


//});



    
		        callback(err,result);
         // });
     });
		   });
       })
      });
      })
}
        
},




function(err, results) {
        // results is now equals to: {one: 1, two: 2}
       //console.log("hello");
        if(err){
            return handleError(err);
        }
        return res.json({
            success:true, 
            results:results,
            token:token

        })
    });
}
    


//These are all the POST requests

//POST for login
//this takes username, password and captcha
router.post('/login', function(req, res, next){

    //extracting all the info from request parameters
    var username = req.body.username;
    var password = req.body.password;
    //var captcha = req.body.captcha;
    //console.log(req);
    //checking all the form-data is right
    req.checkBody('username', 'please enter a valid username').isEmail();
    req.checkBody('password', 'please enter a valid password').notEmpty();
    //req.checkBody('captcha', 'Captcha is incorrect').equals(req.session.captcha);
    console.log('login hit');
    //console.log(req.body);
    //getting all the validation errors
    var errors = req.validationErrors();
    if(errors){
        res.send(errors)
    }else{
       
        console.log(username, password);
       
           connection.connect(function(err){
          
		    console.log("Connected from login");
		    //console.log("select * from user where email='"+username+"'");
		    connection.query("select *  from user where email='"+username+"'",function(err,result,fields){
		     if(err){
		     	console.log(err);
                return handleError(err, null, res);
            }

               console.log(result);

		     if(result.length<=0)
		     {
                console.log("user with username : " + username + " not found");
                msg = "user with this username does not exist";
                return handleError(null, msg, res);
            }
            
                // console.log(result[0].user_id);
                 // result[0].password is password field in database
                 bcrypt.compare(password, result[0].password , function(err, isMatch){
			       if(err){
                    return handleError(err, null, res);
                }
                if(!isMatch){
                    return handleError(null, "wrong password", res);
                }
                jwt.sign({id: result[0].userId}, secret, function(err, token){
                    if(err)handleError(err, null, res);
                    return getAllUserDashboardDetails(req, res, result[0].userId, token);
                    
                })
			       
              });

        });

    });
   }
});


//this route is for creating new user
router.post('/signup', function(req, res, next){
    var name = req.body.name;
    var email = req.body.email;
    var custType = req.body.customertype || 'Buyer' ;
    var contact = req.body.contact;
    var pan = req.body.pan || null;
    var gstin = req.body.gstin || null;
    var password = req.body.password;
    var company = req.body.company;
    var password2 = req.body.password2;
    var userType = 'contractor';

    //console.log(req.body.name);
    //console.log(name);

    req.checkBody('name', 'Name cannot be empty').notEmpty();
    req.checkBody('email', 'Email cannot be empty').notEmpty();
    req.checkBody('contact', 'contact cannot be empty').notEmpty();
    //req.checkBody('pan', 'Pan cannot be empty').notEmpty();
    //req.checkBody('gstin', 'GSTIN cannot be empty').notEmpty();
    req.checkBody('email', "Enter a valid email").isEmail();
    req.checkBody('password', 'password cannot be empty').notEmpty();
    req.checkBody('password2', 'confirm password cannot be empty').notEmpty();
    req.checkBody('password', 'Passwords do not match').equals(password2);

    var errors = req.validationErrors();
    //console.log(errors);

    if(errors){
        //console.log(errors);
        return handleError(errors, null, res);
    }else{
        //console.log('else block called');
        var newUser = ({
            name:name,
            email:email,
            custType:custType,
            contact:contact,
            pan:pan,
            company: company,
            gstin:gstin,
            password:password,
            userType:userType
        });

       bcrypt.hash(newUser.password, 10, function(err, hash){
        if(err)throw err;
        newUser.password = hash;




       // User.createUser(newUser, function (err, user) {
            if(err){
                return handleError(err, null, res);
            }else{
               
     connection.connect(function(err){
  // if(err) throw err;
   console.log(newUser.name);
   var sql="Insert into user ( name , email , custType , contact , pan , company , gstin , password , userType) values('"+newUser.name+"','"+newUser.email+"','"+newUser.custType+"','"+newUser.contact+"','"+newUser.pan+"','"+newUser.company+"','"+newUser.gstin+"','"+newUser.password+"','"+newUser.userType+"')";
   connection.query(sql,function(err,result){
      if(err) throw err;
   });

});
                //console.log(user);
                res.json({
                    success:true,
                    msg: 'user created'
                });
            }
        });
    }
});

router.post('/changepass', function(req, res){
	var oldpass = req.body.oldpass;
	var newpass = req.body.newpass;
	var newpass2 = req.body.newpass2;

	jwt.verify(req.headers.authorization, secret, function(err, decoded){
		if(err){
			console.log(req.headers.authorization)
			console.log("%%%%%%%%%%%%%%%%%%%" + err);
			res.json({
				success:false,
				msg:"some error occured"
			})
			return;
		}
		var userId = decoded.id;
// sql syntax


       connection.connect(function(err){
   // if(err) throw err;
    console.log("Connected from changepass");
    connection.query("select * from user where userId='"+userId+"'",function(err,result,fields){
   if(err) throw err;



	/*	User.findById(userId, function(err, user){
			if(err){
				handleError(err, '', res);
				return;
			}*/
			bcrypt.compare(oldpass, result[0].password, function(err, match) {
				if(!match){
					res.json({
						success:false,
						msg:'old password is not correct'
					});
					return;
				}
				if(newpass != newpass2){
					res.json({
						success:false,
						msg:'passwords do not match'
					});
					return;
				}
				bcrypt.hash(newpass, 10, function(err, hash){
					if(err){
						handleError(err, '', res);
						return;
					}
					result[0].password = hash;
				
                     connection.query("update user SET password='"+result[0].password+"' where userId='"+userId+"'",function(err,result,fields){
                       if(err) throw err;

				//	user.save();
					res.json({
						success:true,
						msg:'password updates successfully'
					});
				});
			});
		})
	});
});
});
});

router.get('/getcities', function(req, res){
    
      connection.connect(function(err){
         //if(err) throw err;
    console.log("Connected form getAllCities");
    connection.query("select * from cities",function(err,result,fields){
   if(err) throw err;
   console.log("Query updated");
   res.json({
      success:true,
      cities:result
   
   })
 });
    });
       });



//this api will check for existing users
router.post('/doesexist', function(req, res){
    var email = req.body.email;
    //User.findOneByEmail(email, function(err, user){
        console.log(email);

   connection.connect(function(err){
   //if(err) throw err;
   var sql="select * from user where email='"+email+"'";
   console.log(email);
   connection.query(sql,function(err,result){
      console.log(result);
        if(err){
            return handleError(err, null, res);
        }
        if(result.length>0){
            return res.json({
                success:true,
                user:true
            })
        }else{
            return res.json({
                success:true,
                user:false
            })
        }
    });
});
  });



router.post('/getsuppliername', function(req, res){
    var id = req.body.supplierId;
    console.log(id)
   // User.findOneById(id, function(err, user){
         

     connection.connect(function(err){
   // if(err) throw err;
    console.log("Connected form getsuppliername");
    connection.query("select * from user where userId='"+id+"'",function(err,result,fields){
 

        if(err){
            return handleError(err, null, res);
        }
        
        if(result.length>0){
            return res.json({
                success:true,
                supplierName: result[0].name
            })
        }else{
            return res.json({
                success:false,
                msg:"no user found"
            })
        }
    });
});
});


router.post('/addcity', function(req, res){
    var city = req.body.city;
      connection.connect(function(err){
         if(err) throw err;
    console.log("Connected form addcity");
    connection.query("Insert into cities Values('"+city+"')",function(err,result,fields){
   if(err) throw err;
            res.json({
                success:true,
                city: result
            });
        });
    });


});

//this route is used to add a customer site
router.post('/addsite', function(req, res){

    jwt.verify(req.headers.authorization, secret, function(err, decoded){
        if(err){
            //console.log("%%%%%%%%%%%%%%%%%%%" + err);
            res.json({
                msg:"some error occured"
            })
            return;
        }
        var userId =  decoded.id;
    
        var name = req.body.name;
        var lat = req.body.lat;
        var long = req.body.long;
        var address = req.body.address;
        var city = req.body.city;

        req.checkBody('name', 'Name cannot be empty').notEmpty();
        req.checkBody('lat', 'lat cannot be empty').notEmpty();
        req.checkBody('long', 'long cannot be empty').notEmpty();
        req.checkBody('address', 'address cannot be empty').notEmpty();
        req.checkBody('city', 'city cannot be empty').notEmpty();

        var errors = req.validationErrors();
        //console.log(errors);

        if(errors){
            //console.log(errors);
            res.send(errors);
        }else{
            //console.log('else block called');
            var newCustomerSite = ({
                name:name,
                lat:lat,
                city:city,
                long:long,
                address:address
            });
            //console.log(customerSite);

           // User.addSite(customerSite, userId, function (err, user) {
              
                   connection.connect(function(err){
				    console.log("Connected form addSite");
				    var sql="Insert into customerSite ( address , lon , lat , name , userId,city) values('"+newCustomerSite.address+"','"+newCustomerSite.long+"','"+newCustomerSite.lat+"','"+newCustomerSite.name+"','"+userId+"','"+newCustomerSite.city+"')";
				    connection.query(sql,function(err,result,fields){
				   if(err) throw err;
                
                if(err){
                    return handleError(err, null, res);
                }else{
                    //console.log(user);
                    res.json({
                        success:true,
                        msg: 'user created'
                    });
                }
            })
				})
        }
    });
})


//this route deletes site from the site array in user document
router.post('/deletesite', function(req, res){
    //change this to pick userid from req header and site id  from req.body

    jwt.verify(req.headers.authorization, secret, function(err, decoded){
        if(err){
            //console.log("%%%%%%%%%%%%%%%%%%%" + err);
            res.json({
                msg:"some error occured"
            })
            return;
        }
        var userId =  decoded.id;
        var customerSiteId = req.body.siteid;
       // User.removeSite( userId, req.body.siteid, function(err, site){
       
        connection.connect(function(err){
       console.log("Connected form deletesite");
      // var sql="update customerSite SET address=null,lon=null,lat=null,name=null,userId=null where userId='"+userId+"'";
    var sql="delete from customerSite where customerSiteId='"+customerSiteId+"'";
    connection.query(sql,function(err,result,fields){
  

            if(err){
                return handleError(err, null, res);
            }
            res.json({
                success:true,
                msg:"site deleted",
                site:result[0]
            })
        });
    });
});

});

//this route returns the profile info of the current logged in user
router.get('/profile', function(req,res){

    jwt.verify(req.headers.authorization, secret, function(err, decoded){
        if(err){
            //console.log("%%%%%%%%%%%%%%%%%%%" + err);
            res.json({
                msg:"some error occured"
            })
            return;
        }
        var userId =  decoded.id;
    
        //User.findOneById( userId, function(err, user){
            console.log(userId);
     connection.connect(function(err){
   // if(err) throw err;
    console.log("Connected form profile");
    connection.query("select * from user where userId='"+userId+"'",function(err,results,fields){
   if(err) throw err;
      
//
      //connection.query("select * from user INNER JOIN customerSite ON user.userId=customerSite.userId where userId='"+userId+"'",function(err,results,fields){
   //if(err) throw err;
//connectionsite sql
			    connection.query("select * from customerSite where userId='"+userId+"'",function(err,result,fields){
			   if(err) throw err;

            if(err){
                return handleError(err, null, res);
            }
            res.json({
                success:true,
                user:results[0],
                customerSite:result
            });
        });
    });
});
});
});

//this route is called as POST when profile change is required
router.post('/profile', function(req, res){

    jwt.verify(req.headers.authorization, secret, function(err, decoded){
        if(err){
            //console.log("%%%%%%%%%%%%%%%%%%%" + err);
            res.json({
                msg:"some error occured"
            })
            return;
        }
        var userId =  decoded.id;

    
        var id = userId;
        var name = req.body.name;
        var email = req.body.email;
        var contact = req.body.contact;
        var pan = req.body.pan;
        var gstin = req.body.gstin;

      
//no need to check for id
       // req.checkBody('id', 'id cannot be empty').notEmpty();
        req.checkBody('name', 'Name cannot be empty').notEmpty();
        req.checkBody('email', 'Email cannot be empty').notEmpty();
        req.checkBody('contact', 'contact cannot be empty').notEmpty();
        req.checkBody('email', "Enter a valid email").isEmail();
        
        var errors = req.validationErrors();
        //console.log(errors);

        if(errors){
            //console.log(errors);
            return handleError(errors, null, res);
        }else{
           // User.findOneById(id, function(err, user){
                
		     connection.connect(function(err){
		   // if(err) throw err;
		    console.log("Connected form edit profile");
		  
			    var sql="update user SET name='"+name+"', email='"+email+"',contact='"+contact+"',pan='"+pan+"',gstin='"+gstin+"' where userId='"+id+"'";
			    connection.query(sql,function(err,result,fields){
			   if(err) throw err;

                    if(err){
                        handleError(err, null, res);
                    }
                    res.json({
                        success:true,
                        user:result
                    })
                });
            });
         }
     });
});



//this route returns all the order(cancelled as well as successful)
router.get('/history', function(req, res){

    jwt.verify(req.headers.authorization, secret, function(err, decoded){
        if(err){
            //console.log("%%%%%%%%%%%%%%%%%%%" + err);
            res.json({
                msg:"some error occured"
            })
            return;
        }
        var userId =  decoded.id;
           // sql connection
          connection.connect(function(err){
		    console.log("Connected from history");
		    var sql="select * from orders where requestedBy='"+userId+"'";
		    connection.query(sql,function(err,result,fields){
		     if(err) throw err;
		        res.json({
                orders:result 
            });
        });
    });
});

});

//this is post for forgot password which requires user's email id
router.post('/forgot', function(req, res){
    var email = req.body.email;
    //sql connection
      connection.connect(function(err){
   //if(err) throw err;
   var sql="select * from user where email='"+email+"'";
   console.log(email);
   connection.query(sql,function(err,result){
       //console.log(result);
        if(err){
            return handleError(err, null, res)
        }
        if(result.length<0){
            return handleError(null, "no user with this username exists", res);
        }
        crypto.randomBytes(20, function(err, buf){
            if(err){
                return handleError(err, null, res);
            }
            var token = buf.toString('hex');
            result[0].resetPasswordToken = token;
            result[0].resetPasswordExpire = Date.now() + 3600000; //1hour
            console.log(result);
            //user.save(function(err){
               

		     connection.connect(function(err){
		   //if(err) throw err;
		   var sql="update user set resetPasswordExpire='"+result[0].resetPasswordExpire+"', resetPasswordToken='"+result[0].resetPasswordToken+"' where email='"+email+"'";
		   console.log(email);
		   connection.query(sql,function(err,result){

               
                if(err){
                    return handleError(err, null, res);
                }
            

            var smtpTransport = nodemailer.createTransport({
                service:'SendGrid',
                auth:{
                    user:'jarvis123',
                    pass:'abhansh@123'
                }
            });
            var mailOptions = {
                to:email,
                from:'passwordreset@demo.com',
                subject:'concrete password reset',
                text:'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
                'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
                'http://' + req.headers.host + '/reset/' + token + '\n\n' +
                'If you did not request this, please ignore this email and your password will remain unchanged.\n'
            };
            smtpTransport.sendMail(mailOptions, function(err){
                if(err){
                    return handleError(err,"error me", res);
                }
                res.json({
                    success:true,
                    msg:"a mail has been sent to your registered mail id"
                });
            })
        })
    });
})
});
});
  });

//this route will verify the password token hasn't expire and returns a json response
router.get('/reset/:token', function(req, res) {
   // User.findOneForResetPassword(req.params.token, function(err, user) {
    
     connection.connect(function(err){
    console.log("Connected form resetpasswordget");
    connection.query("select * from user where resetPasswordToken='"+req.params.token+"' &  resetPasswordExpire <'"+Date.now()+"'",function(err,result,fields){
   if(err) throw err;

      if (result.length<=0) {
          var result = {
              err:true,
              msg:'Password reset token is invalid or has expired.'
          }
        return res.status(200).json(result);
      }
      var result = {
          msg:"reset your password", 
          user:result
      }
      res.status(200).json(result);
    });
});
 });

//POST for password reset and if token hasn't expired, the password of user is reset.
router.post('/reset/:token', function(req, res){
    //User.findOneForResetPassword(req.params.token, function(err, user){
        
    connection.connect(function(err){
    console.log("Connected form resetpasswordget");
    connection.query("select * from user where resetPasswordToken='"+req.params.token+"' &  resetPasswordExpire <='"+Date.now()+"'",function(err,result,fields){

        if(err){
            return handleError(err);
        }
        if(result.length<=0){
            var result = {
                msg:"this token has expired"
            }
            return res.status(200).json(result);
        }
        result[0].password = req.body.password;
        result[0].resetPasswordExpire = undefined;
        result[0].resetPasswordToken = undefined;

        //User.saveUserResetPassword(user, function(err){
          
        bcrypt.hash(result[0].password, 10, function(err, hash){
        if(err)throw err;
        result[0].password = hash;
        //user.save(callback); 
          
             connection.query("update user set password='"+result[0].password+"',resetPasswordToken='"+result[0].resetPasswordToken+"' &  resetPasswordExpire='"+result.resetPasswordExpire+"' where email='"+result[0].email+"'",function(err,result,fields){

            if(err){
                return handleError(err, null, res);
            }
            //previous user in place of result in below line 
            req.logIn(result, function(err){
                res.status(200).json("password has been reset successfully");
            });
        });
    });
});
});
});

router.post('/requestquote', function(req, res){



    jwt.verify(req.headers.authorization, secret, function(err, decoded){
        if(err){
            //console.log("%%%%%%%%%%%%%%%%%%%" + err);
            res.json({
                msg:"some error occured"
            })
            return;
        }
        var userId =  decoded.id;
          //console.log(a.quality);
           console.log(userId);
//defining arrays
        var quality = [];
        var quantity = [];
      //  var customerSite = [];
      ///var requiredDate = [];
       // var requestedBy = [];
        //var companyName = [];
        
        console.log(req.body.quality);
         console.log(req.body.quantity);
          console.log(req.body.customerSite);
           console.log(req.body.requiredDate);
/*
//string to array
       var quality = (req.body.quality).split(",");
        var quantity = (req.body.quantity).split(",");
        var customerSite = (req.body.customerSite).split(",");
        var generationDate =  Date.now();
        var requiredDate = (req.body.requiredDate).split(",");
        var requestedBy = (req.body.name).split(",");
        var requestedById = userId;
        var companyName = (req.body.company).split(",");
*/
//list logic
  var quality = req.body.quality;
        var quantity = req.body.quantity;
        var customerSite = req.body.customerSite;
        var generationDate =  Date.now();
        var requiredDate = req.body.requiredDate;
        var requestedBy = req.body.name;
        var requestedById = userId;
        var companyName = req.body.company;

// multiple
       /* var quality = req.body.a2.quality;
        var quantity = req.body.a2.quantity;
        var customerSite = req.body.a2.customerSite;
        var generationDate =  Date.now();
        var requiredDate = req.body.a2.requiredDate;
        var requestedBy = req.body.a2.name;
        var requestedById = userId;
        var companyName = req.body.a2.company;

          
        var generationDate =  Date.now();
        var requestedById = userId;*/
       req.checkBody('quantity', 'quantity cannot be empty').notEmpty();
        req.checkBody('quality', 'quality cannot be empty').notEmpty();
        req.checkBody('customerSite', 'customerSite cannot be empty').notEmpty();
        req.checkBody('requiredDate', 'requiredDate cannot be empty').notEmpty();

        var errors = req.validationErrors();
        console.log(errors);
        
        if(errors){
            return handleError(errors, null, res);
        }else{
             var newQuote = (
            	{
                quantity : quantity,
                quality : quality,
                customerSite : customerSite,
                generationDate : generationDate,
                requiredDate : requiredDate,
                requestedBy : requestedBy,
                requestedByCompany: companyName,
                requestedById : requestedById
            });
                 console.log(newQuote.quantity[0]);

           console.log(quality.length);
			     connection.connect(function(err){
			    var i=0;
			    //console.log(newQuote[0].quantity);
			    //if(err) throw err;
			    for( i;i<quality.length;i++){
			    console.log("Connected form requestquote");
			    var sql="Insert into quotes(quantity,quality,customerSite,generationDate,requiredDate,requestedBy,requestedByCompany,requestedById) values('"+newQuote.quantity[i]+"','"+newQuote.quality[i]+"','"+newQuote.customerSite+"','"+generationDate+"','"+newQuote.requiredDate+"','"+newQuote.requestedBy+"','"+newQuote.requestedByCompany+"','"+requestedById+"')";
			    connection.query(sql,function(err,result,fields){
              if(err){
                    return handleError(err, null, res);
                }
                })
			}
                res.json({
                    success:true,
                    msg: 'new request for quote submitted for ' + newQuote.quantity[0] + ' of ' + newQuote.quality[0]  + ' quality redimix.'
                });
           
        });
   }
});
});

//this route will cancel an existing quote that was created by contractor
router.post('/cancelquote', function(req, res){
  
    var quoteId = req.body.quoteId;
    console.log(quoteId);
    //console.log(req.body);
   // Quote.cancelQuote(quoteId, function(err, quote){
         
             connection.connect(function(err){
			   // if(err) throw err;
			    console.log("Connected form cancelquote");
			    connection.query("delete from quotes where quoteId='"+quoteId+"'",function(err,result,fields){
			  if(err){
            return handleError(err, null, res);
        }
        res.json({
            success:true,
            msg:" quote has been cancelled"
        })
    })
});
});

//this route will create a purchase order between contractor and supplier
router.post('/createpo', function(req, res){
    
    jwt.verify(req.headers.authorization, secret, function(err, decoded){
        if(err){
            //console.log("%%%%%%%%%%%%%%%%%%%" + err);
            res.json({
                msg:"some error occured"
            })
            return;
        }
         
         var quality=[];
         var quantity=[];
         var price=[];
        var userId =  decoded.id;

        var generationDate = Date.now();
        var validTill = req.body.validTill;
        var quantity = req.body.quantity;
        var quality = req.body.quality;
        var price = req.body.price;
        var customerSite = req.body.customerSite;
        var requestedBy = req.body.requestedBy;
        var requestedById = userId;
        var company = req.body.companyName;
        var remQuantity = req.body.quantity;
        var supplierId = req.body.supplierId;
console.log(company);
        var newPO = ({
            generationDate : generationDate,
            validTill : validTill,
            quantity : quantity,
            quality : quality,
            price : price,
            remQuantity: remQuantity,
            customerSite : customerSite,
            requestedBy : requestedBy,
            requestedById : requestedById,
            supplierId : supplierId,
            requestedByCompany: company,
            confirmedBySupplier:false
        });

        //PO.createPO(newPO, function(err, PO){
        
     connection.connect(function(err){
       console.log(quality.length);
   console.log("Connected form createPO");
    for(var i=0;i<quality.length;i++){  
   

    var sql="Insert into purchaseorder(generationDate,validTill,quantity,quality,price,remQuantity,customerSite,requestedBy,requestedById,supplierId,requestedByCompany,confirmedBySupplier) values('"+newPO.generationDate+"','"+newPO.validTill+"','"+newPO.quantity[i]+"','"+newPO.quality[i]+"','"+newPO.price[i]+"','"+newPO.remQuantity+"','"+newPO.customerSite+"','"+newPO.requestedBy+"','"+requestedById+"','"+newPO.supplierId+"','"+newPO.requestedByCompany+"','"+newPO.confirmedBySupplier+"')";
    connection.query(sql,function(err,result,fields){
      if(err){
                return handleError(err, null, res);
            }

      });

  }
            
            res.json('PO created');
        
    });
});
});


//this api will delete PO from from the contractor side but it will still be visible for the sake of history
router.post('/deletepo', function(req, res){

    jwt.verify(req.headers.authorization, secret, function(err, decoded){
        if(err){
            //console.log("%%%%%%%%%%%%%%%%%%%" + err);
            res.json({
                msg:"some error occured"
            })
            return;
        }
        var userId =  decoded.id;

        var id = req.body.id;

      //  PO.deletePOByContractor(id, function(err, po){
            
     connection.connect(function(err){
    console.log("Connected form deletepo");
    var sql="update purchaseorder set deletedByContractor='true' where POId='"+id+"'";
    connection.query(sql,function(err,result,fields){
           if(err){
                return handleError(err, null, res);
            }
            res.json({
                success:true,
                msg: 'the PO has been deleted'
            })
        });
    });
});
});
router.get('/pos', function(req, res){
    jwt.verify(req.headers.authorization, secret, function(err, decoded){
        if(err){
            //console.log("%%%%%%%%%%%%%%%%%%%" + err);
            res.json({
                msg:"some error occured"
            })
            return;
        }
        var userId =  decoded.id;

       // PO.findPoByContractor(userId, function(err, pos){
            
            
                connection.connect(function(err){
			   // if(err) throw err;
			    console.log("Connected form findPoByContractor");
			    connection.query("select * from purchaseorder where requestedById='"+userId+"'",function(err,result,fields){
			   

            if(err){
                return handleError(err, null, res);
            }
            res.json({
                success:true,
                data:result
            })
        });
    });
});
});


//API to add an Order
router.post('/addorder', function(req, res, next){
    
    jwt.verify(req.headers.authorization, secret, function(err, decoded){
        if(err){
            //console.log("%%%%%%%%%%%%%%%%%%%" + err);
            res.json({
                msg:"some error occured"
            });
            return;
        }
        var userId =  decoded.id;


// multiple orders
        var quantity=[];
        var quality=[];
          
        var date = Date.now();
        var requiredByDate = req.body.requiredDate;
        var quantity = req.body.quantity;
        var quality = req.body.quality;
        var requestedBy = req.body.requestedBy;
        var requestedById = userId;
        var supplierId = req.body.supplierId;
        var companyName = req.body.companyName;
        var customerSite = req.body.customerSite;
        var POId = req.body.POId;
        var status = 'submitted';
        var statusDate = Date.now();
        var statusDesc = 'Your orders is submitted and is waiting to get confirmation from seller';


        req.checkBody('quantity', 'quantity cannot be empty').notEmpty();
        req.checkBody('quality', 'quality cannot be empty').notEmpty();
        req.checkBody('requestedBy', 'requestedBy cannot be empty').notEmpty();

        var errors = req.validationErrors();
        //console.log(errors);

        if(err){
            return handleError(err, null, res);
        }else{
            //console.log('else block called');
            var newOrder =({
                generationDate:date,
                requiredByDate:requiredByDate,
                quality:quality,
                quantity:quantity,
                requestedBy:requestedBy,
                requestedById:requestedById,
                supplierId:supplierId,
                companyName:companyName,
                customerSite:customerSite,
                POId: POId,
                status:status,
                statusDate:statusDate,
                statusDesc:statusDesc
            });


            console.log(POId)
           // PO.findPoByPOId(POId, function(err, purOrder){
              
        connection.connect(function(err){
			    console.log("Connected form addorder");
			    connection.query("select * from purchaseorder where POId='"+POId+"'", function(err,result,fields){
                
           //console.log(err);
                // console.log(result.length);
                   if(result.length<=0)
                   {
                    console.log(err);
                  return  res.json({
                        success:false,
                        msg:"there was some error placing order"
                      })
                   }
		                          //console.log(result[0].remQuantity);
		                          console.log(quantity);
               var i=0;
              for(i;i<quality.length;i++)
              {
                      

                if(result[0].remQuantity < quantity[i]){
                    res.json({
                        success:false,
                        msg:"The Purchase Order quantity is not enough to fulfill current Order. Please Order a new PO."
                    })
                }
                else{
                    result[0].remQuantity = result[0].remQuantity-quantity[i];
                    console.log("quantity subtracted");
                   // purOrder.save();
                  
			              connection.query("update purchaseorder set remQuantity='"+result[0].remQuantity+"' where POId='"+POId+"'" ,function(err,result,fields){
                 if(err) throw err;
                 console.log("updated in purchaseorder");
                    //Order.createOrder(newOrder, function (err, order) {
                       });

              var sql="Insert into orders ( generationDate , requiredByDate , quality , quantity , requestedBy , requestedById , supplierId , companyName , customerSite,POId,status, statusDate, statusDesc) values('"+newOrder.generationDate+"','"+newOrder.requiredByDate+"','"+newOrder.quality[i]+"','"+newOrder.quantity[i]+"','"+newOrder.requestedBy+"','"+requestedById+"','"+supplierId+"','"+newOrder.companyName+"','"+newOrder.customerSite+"','"+newOrder.POId+"','"+newOrder.status+"','"+newOrder.statusDate+"','"+newOrder.statusDesc+"')";
					    connection.query(sql,function(err,result,fields){
                         if(err){
                            return handleError(err, null, res);
                        }
                             });
                }
             }
                            res.status(200).json({
                                success:true,
                                msg:'order created'
                                //order:result
                            });
                    
                    });
                });
                     
            }
      });
});

//this api is for cancelling a order and it takes an orderId and cancellation reason
router.post('/cancelorder', function(req, res){
    var orderId = req.body.orderId;
    var reason = req.body.reason;
    console.log(orderId);
    console.log(reason);
    console.log(req.body);
   // Order.cancelOrder(orderId, reason, function(err, order){
        connection.connect(function(err){
    console.log("Connected form cancelOrder");
    connection.query("select * from orders where orderId='"+orderId+"'",function(err,result,fields){
   if(err) throw err;
        result[0].statusDesc = reason;
        result[0].status = 'cancelled';
        result[0].statusDate = Date.now();
        var sql="update orders SET status='"+result[0].status+"', statusDate='"+result[0].statusDate+"',statusDesc='"+result[0].statusDesc+"' where orderId='"+orderId+"'";
                 connection.query(sql,function(err,result,fields){
          if(err) throw err;

  });
     //   order.save(function(err){
            //callback(err, order);

        if(err){
            return handleError(err, null, res);
        }
        res.json({msg:'order is cancelled',
        	result:result
        })
  console.log(result);
});

        });
    });

//this post request is to add issues with some orders
router.post('/addissue', function(req, res){

    jwt.verify(req.headers.authorization, secret, function(err, decoded){
        if(err){
            //console.log("%%%%%%%%%%%%%%%%%%%" + err);
            res.json({
                msg:"some error occured"
            })
            return;
        }
        var userId =  decoded.id;

        //console.log(req.user);
        var title = req.body.title;
        var description = req.body.description;
        var orderId = req.body.orderId;
        var userId = userId;
        var type = req.body.type;
        var date = Date.now();
        var status = 'submitted to manager';

        req.checkBody('title', 'title cannot be empty').notEmpty();
        req.checkBody('description', 'description cannot be empty').notEmpty();
        req.checkBody('orderId', 'orderId cannot be empty').notEmpty();
        req.checkBody('type', 'type cannot be empty').notEmpty();

        var errors = req.validationErrors();
        console.log(errors);
        
        if(errors){
            res.send(errors, null, res);
        }else{
            var newIssue = ({
                title:title,
                type:type,
                description:description,
                orderId:orderId,
                userId:userId,
                date:date,
                status:status
            });

            //Issue.addIssue(newIssue, function(err, issue){
                console.log(newIssue.orderId);
                console.log(newIssue.userId);

                   connection.connect(function(err){
				   console.log("Connected from addIssue");
				   var sql="Insert into issues ( title , type , description , orderId , userId, date , status) values('"+newIssue.title+"','"+newIssue.type+"','"+newIssue.description+"','"+orderId+"','"+userId+"','"+newIssue.date+"','"+newIssue.status+"')";
				    connection.query(sql,function(err,result,fields){
				  if(err){
                    return handleError(err, null, res);
                }
                res.json({
                    success:true,
                    issue:result,
                    msg:"issue raised successfully"
                })
            })
        
          });
  }
})
});


router.post('/qrcode', function(req, res){
   
var totalQuantity=req.body.totalQuantity;
var orderedQuantity=req.body.orderedQuantity;
var quality = req.body.quality;
var customerName=req.body.customerName;
var supplierId=req.body.supplierId;
var date=Date.now();

var result=({
    totalQuantity:totalQuantity,
    orderedQuantity:orderedQuantity,
    quality:quality,
    customerName:customerName,
    supplierId:supplierId,
    date:date

});
var s="totalQuantity='"+totalQuantity+"'              orderedQuantity='"+orderedQuantity+"'         quality='"+quality+"'          customerName='"+customerName+"'         supplierId='"+supplierId+"'            date of dispatch='"+date+"''";
var code= qr.imageSync('I love QR!' , {type:'png'} );
//var code=qr.image(s,{type:'utf-8'});
//var output =fs.createWriteStream('nodejitsu.svg')

//res.type('png');
//savePixels(code, "png").pipe(res);

res.send(code);
console.log(code);
var st= JSON.stringify(code);
console.log(st);
//output=fs.createWriteStream('qr-image');
//code.pipe(output);
//code.pipe(res);
    //console.log(code.pipe(res));
    connection.connect(function(err){
    //console.log("Connected form qrcode");
    /*
    var img1={
        image: fs.readFileSync("C:/Users/Windows/Desktop/concreteApp/bag.jpg")
    };*/

   // var sql="insert into images SET ?";
  var sql ="insert into images(image) value('"+st+"')";
    connection.query(sql,function(err,result,fields){
     if(err) throw err;


    });

  var sql ="select image from  images where imageId=23";
    connection.query(sql,function(err,result,fields){
     if(err) throw err;
     

res.type('png');
//savePixels(code, "png").pipe(res);
console.log(JSON.parse(result[0].image));
var a={"type":"Buffer","data":[137,80,78,71,13,10,26,10,0,0,0,13,73,72,68,82,0,0,0,145,0,0,0,145,8,0,0,0,0,230,179,5,255,0,0,1,21,73,68,65,84,120,218,237,218,65,18,194,32,12,5,208,222,255,210,122,129,130,9,133,80,156,199,74,219,41,60,23,25,195,167,215,231,109,227,34,34,34,34,34,34,34,34,34,34,250,79,209,245,123,52,159,120,50,11,17,81,129,168,93,12,221,133,7,103,33,34,42,21,221,45,119,119,183,249,53,48,11,17,209,9,162,252,44,68,68,39,136,84,63,209,9,162,128,55,117,119,117,199,70,68,52,99,79,27,248,84,188,203,38,34,154,145,67,54,119,183,219,146,81,34,162,161,254,168,31,55,230,159,37,34,42,21,165,122,161,104,71,31,237,158,136,136,150,137,2,171,247,35,245,246,114,143,171,159,136,104,92,244,184,229,137,70,54,68,68,165,162,254,38,54,122,109,176,234,136,136,150,137,82,37,213,76,216,83,21,70,68,84,32,74,37,136,129,179,208,212,191,18,17,209,90,209,236,230,167,248,84,148,136,40,145,67,70,19,156,212,239,34,34,122,175,168,255,162,214,164,254,136,136,168,82,148,47,66,34,162,237,162,193,148,60,16,252,16,17,109,18,69,223,209,154,120,32,74,68,180,86,180,117,16,17,17,17,17,17,17,17,17,17,157,47,250,2,64,181,157,174,90,85,141,189,0,0,0,0,73,69,78,68,174,66,96,130]};
res.send(code);

    });



});
});










//this function checks if the user is in session or not
function isAuthenticated(req, res, next){
    if(req.headers['authorization']){
        jwt.verify(req.headers['authorization'], secret, function(err, decoded){
            if(err){
                console.log(err);
                return handleError(err, null, res);
            }
            res.locals.userId = decoded.id;
            console.log("calling next now and " + res.locals.userId);
            return next();
        })
    }else{
        res.json({
            success:false,
            auth:false,
            msg:"authentication unsuccessful, please login again"
        });
    }
}

//this function is a general error handler
function handleError(err, msg, res){
    console.log(err);
    if(msg == undefined){
        msg = "there was some error at the server";
    }
    return res.json({
        success:false,
        msg: msg,
        err:err
    });
}
module.exports = router;

































//after this, the routes are not required in app 

//Passport serializing and deserializing user from a session
passport.serializeUser(function(user, done) {
    //console.log('user serialized');
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
   // User.findOneById(id, function(err, user) {
     
    connection.connect(function(err){
   // if(err) throw err;
    console.log("Connected form passport deserializeUser");
    connection.query("select * from user where user_id='"+id+"'",function(err,result,fields){

        done(err, result);
    });
});
});


//creating passport local strategy for login with email and password
passport.use(new LocalStrategy(

    function (username, password, done) {
        console.log('local st called')
       // User.findByUsername(username, function (err, user) {
          
            connection.connect(function(err){
		   //if(err) throw err;
		   var sql="select * from user where email='"+email+"'";
		   console.log(email);
		   connection.query(sql,function(err,result){
            if(err){
                return done(err);
            }
            if(result.length<=0){
                console.log("user with username : " + username + " not found");
                done(null, false, {usermsg:"user with this username does not exist"});
            }
            //User.comparePassword(password, user.password, function (err, isMatch) {
              
             bcrypt.compare(password, result[0].password, function(err, isMatch){
                if(err)throw err;
                 if(!isMatch){
                    return done(null, false, {passmsg:"Password is incorrect"});
                }
                return done(null, result);
            });

        })
    })
}
));


//for login page
router.get('/login', function(req, res, next){
    //here we generate captcha
    var captcha = svgCaptcha.create();
    //now we store the captcha text in req.session object
    // for later verification on POST
    req.session.captcha = captcha.text;

    //we send along the captcha SVG(image) in the captcha variable
    res.render('login',{
        captcha:captcha.data
    });
});