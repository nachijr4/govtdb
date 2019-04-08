var express = require("express"),
routes = express.Router(),
accounts = require("../models/account"),
branch  = require("../models/branch"),
transactions = require("../models/transactions"),
nodemailer = require("nodemailer"),
middleware = require("../middleware/index");

var otp;

routes.get("/bank/:a_id/transfer",middleware.isLoggedIn,function(req,res){
    accounts.findOne({a_id: req.params.a_id},function(err,foundAccount){
        if(err){console.log(err); res.redirect("/bank")}
        else{
            branch .findOne({b_id: foundAccount.b_id},function(err,foundBranch){
                if(err){console.log(err); res.redirect("/bank");}
                else{

                    res.render("bank/transfer.ejs",{account: foundAccount, branch: foundBranch});
                }
            })
        }
    });
});

//--------------------------Ensures if the details are correct and generates the OTP-----------------------------------------
routes.post("/bank/:a_id/transfer",middleware.isLoggedIn, function(req,res){
    accounts.findOne({a_id: req.params.a_id},function(err,senderAccount){
        if(err){
            console.log(err);
        }
        else{
            if(senderAccount.owner == req.user.username){
                if(  senderAccount.a_id != req.body.benifeciery){
                    accounts.findOne({a_id: req.body.benifeciery},function(err,benifeciery){
                        if(err){
                            req.flash("error", "Error finding Account");
                            res.redirect("/bank/home");
                        }
                        else{
                            if(benifeciery){
                                branch.findOne({b_id: benifeciery.b_id},function(err,foundBranch){
                                    if(err){
                                        req.flash("error", "Error finding Benefieciery");
                                        res.redirect("/bank/home");
                                    }
                                    else{
                                        if((foundBranch.ifsc == req.body.ifsc)){
                                            if(Number(req.body.amount)<= Number(senderAccount.balance)){

                                                //---------------------Sending OTP ---------------------------------------
                                                try{

                                                    sendmail(req.user.email);
                                                } catch(error){
                                                    // console.log("The otp received back is : ", otp)
                                                }
                                                //------------------------------------------------------------------------------
                                                // -----------------calling the ejs file for entering otp-------------------
                                                var data = {
                                                    s_id: senderAccount.a_id,
                                                    r_id: benifeciery.a_id,
                                                    description: req.body.description,
                                                    amount: Number(req.body.amount)
                                                };

                                                res.render("bank/enterotp.ejs",{trans_details: data})
                                            // ---------------------------------------------------------
                                            }
                                            else{
                                                // add not suffecient balance message
                                                req.flash("error", "Insuffecient Balance");
                                                res.redirect("/bank/"+senderAccount.a_id+"/transfer");
                                            }
                                        }
                                        else{
                                            //add not correct ifsc message
                                            req.flash("error", "Wrong IFSC code");
                                            res.redirect("/bank");
                                        }
                                    }
                                });
                            }
                            else{
                                // wrong benefieciery account
                                req.flash("error", "Wrong Benefieciery Account");
                                res.redirect("/bank/"+senderAccount.a_id+"/transfer");
                            }
                        }
                    });
                }
                else{
                    req.flash("error", "Sender account and Benefieciery account are the same");
                    res.redirect("/bank/"+senderAccount.a_id+"/transfer");
                }
            }
            else{
                //send wrong senders account message
                req.flash("error", "Wrong Sender Account");
                res.redirect("/bank/"+senderAccount.a_id+"/transfer");
            }
        }
    });
});
// -------------------------------------------------------------------------------------

//----------------------------Verifying the OTP and conducting the transaction------
routes.post("/bank/:id/verifyotp",middleware.isLoggedIn,function(req,res){
    if(req.body.otp == otp){
        var sender,receiver;
        accounts.findOne({a_id: req.query.s_id},function(err,foundSender){
            if(err){console.log(err);}
            else{ sender = foundSender; console.log("Found sender")}
        });
        accounts.findOne({a_id: req.query.r_id},function(err,foundreceiver){
            if(err){console.log(err);}
            else{ receiver = foundreceiver; console.log("Found Receiver")}
        });
        let now = new Date();
        req.query.createdAt = String(now).substring(0,24);
        transactions.create(req.query,function(err,createdTransaction){
            if(err){console.log(err);}
            else{
                var balance = Number(sender.balance) - Number(req.query.amount);
                    sender.balance = String(balance);
                    balance = Number(receiver.balance) + Number(req.query.amount);
                    receiver.balance = String(balance);
                sender.transactions.push({details: createdTransaction, t : "Debited"});
                receiver.transactions.push({details: createdTransaction,t: "Credited"});
                sender.save();
                receiver.save();
                otp = 0;
                req.flash("success","your transaction ID is: "+ String(createdTransaction._id));
                 res.redirect("/bank");
            }
        })
    }
    else{
        req.flash("error","Wrong OTP. ")
        res.redirect("/bank");
    }
});
// ------------------------------------------------------------------------------------------------

//----------------------------------Generating OTP and sending mail--------------------------
 async function sendmail(receiver_mail){
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: "SVAN.online.banking.system@gmail.com", // generated ethereal user
            pass: "SVAN1234" // generated ethereal password
        }
    });
    otp = String(Math.random() * 1000000)
    otp = otp.substring(0,otp.indexOf("."))
    // setup email data with unicode symbols
    let mailOptions = {
        from: '"BankDB" <SVAN.online.banking.system@gmail.com>', // sender address
        to: receiver_mail, // list of receivers
        subject: "Transaction OTP", // Subject line
        text: "Hello world?", // plain text body
        html: "<h1> Your OTP for the transaction is "+otp+"</h1>" // html body
    };
    
    // send mail with defined transport object
    try{
        let info = await transporter.sendMail(mailOptions)

    }
catch(error){
    console.log(error);
}
    
    // console.log("Message sent: %s", info.messageId);
    return ;
}
// ----------------------------------------------------------------------------------

module.exports = routes;