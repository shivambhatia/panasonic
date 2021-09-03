const bcrypt = require("bcrypt");
const { check, validationResult } = require("express-validator");
const qr = require("qrcode");
const moment = require("moment");
moment.tz.setDefault(process.env.TIMEZONE);
const nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
var db = require("../models/main");
var handlebars = require('handlebars');

const { Op } = require("sequelize");

exports.view = async (req, res) => {
   
    if (req.session.org) {
    
        if (db.sequelize.config.database !== req.session.org) {
            db = await require("../models")(req.session.org);
        }

        serviceData = await db.service.findAll()
            .then(data => {
                return data;
            })
            .catch(err => {
                console.log(err);
            });

        branchData = await db.branch.findAll()
            .then(data => { return data; })
            .catch(err => { res.status(500).send({ message: err.message || "Some error occurred ." }); });
       
      
        res.render('appointment/booking_form', { branches: branchData, services: serviceData });
        res.end();
    } else {
        res.redirect('../appointment');
    }
};

exports.validate = (method) => {
    switch (method) {
        case 'create': {
            return [
                check('name').custom(value => {
                    return db.branch.findOne({ where: { name: value } }).then(data => {
                        if (data) {
                            return Promise.reject('Branch name already in use');
                        }
                    });
                }),
                check('services')
                    .not().equals('-1')
                    .withMessage("Please select service"),
                check('branch')
                    .not().equals('-1')
                    .withMessage("Please select a branch"),
                check('email')
                    .not().isEmpty()
                    .withMessage("Please enter Email")
                    .normalizeEmail().isEmail()
                    .withMessage("Please enter valid Email"),
                check('mobile')
                    .not().isEmpty()
                    .withMessage("Please enter contact number")
                    .isLength({ min: 10, max: 10 })
                    .withMessage("Contact should have 10 digits")
                    .isInt()
                    .withMessage("Contact number should have number only"),
                check('appointment_date')
                    .not().isEmpty()
                    .withMessage("Please enter Appointment Date")
                    .isISO8601().toDate()
                    .withMessage("Please enter valid Date"),
                check('appointment_time')
                    .not().isEmpty()
                    .withMessage("Please enter Appointment Time")
                    .matches('^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$')
                    .withMessage("Enter a valid time slot")
            ]
        }
    }
}

exports.create = async (req, res) => {
    const Appointment = db.appointment;
    const Customer = db.customer;
    let permission12 = req._parsedOriginalUrl.pathname;
    let  permission22    =       permission12.split('/');
   //  console.log(permission22[1],"@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@");
   try{
        if (req.body.email){
            customer_id = await Customer.findOne({ where: { email: req.body.email } })
                .then(async data => {
                    if (data === null) {
                        customer_insertData = {
                            name: req.body.name,
                            email: req.body.email,
                            contact_no: req.body.mobile,
                        }
                        return await Customer.create(customer_insertData)
                            .then(async data => {
                                console.log('new customer registered');
                                return data.id;
                            })
                            .catch(err => {
                                console.log(err);
                                res.status(500).send({
                                    message:
                                        err.message || "Some error occurred while creating the Database."
                                });
                            });
                    } else {
                        return data.id;
                    }
                })
                .catch(err => {
                    console.log(err);
                    res.status(500).json({
                        message: "customer check failed."
                    });
                });

            var appointment_insertData = {
                appointment_date: moment(req.body.appointment_date, "DD-MM-YYYY"),
                appointment_time: moment(req.body.appointment_time, "HH:mm A").utcOffset('+0530').format("HH:mm"),
                note: req.body.note,
                services: JSON.stringify(req.body.services),
                branch_id: req.body.branch,
                customer_id: customer_id
            }

            var appointment_id = await Appointment.create(appointment_insertData)
                .then(async data => {
                    Appointment.update(
                        { appointment_no: 'Book-' + (1000 + data.id) },
                        { where: { id: data.id } }
                    )
                        .then(function (rowsUpdated) {
                            console.log(rowsUpdated)
                        })
                    return data.id;
                })
                .catch(err => {
                    console.log(err);
                    res.status(500).send({
                        message:
                            err.message || "Some error occurred while creating the Database."
                    });
                });

            // qr_data = 'http://65.1.176.15:5000/'+permission22[1]+'/appointment/verify/' + (1000 + appointment_id);
            qr_data = {
                    BookingID : 'Book-' + (1000 + appointment_id),
                    Organization : permission22[1]
                 }
                 
            try {
                const qrCode = await generate_qrCode(qr_data);
                console.log('new appointment created');
                
                try {
                    var appointment_detail = appointment_details(appointment_id);
                    appointment_detail.then(async function (result) {
                        var htmlBody = 'Hello ' + helper.ucwords(result['customer.name']) + '</br></br> Your appointment details are: </br>'
                            + 'Booking ID :' + (1000 + appointment_id) + '</br>'
                            + 'Services :' + helper.ucwords(result.all_services.join(', ')) + '</br>'
                            + 'Appointment Date : ' + result.appointment_date + '</br>'
                            + 'Appointment Time :' + result.appointment_time + '</br>'
                            + 'Email :' + result['customer.email'] + '</br>'
                            + 'Mobile :' + result['customer.contact_no'] + '</br></br>'
                            + 'QR Code for this appointment :' + '</br>'
                            + '<img src="' + qrCode + '">';

                        let mailSent = true;//await send_qrMail(htmlBody);

                        if (mailSent) {
                            response = {
                                qrCode: qrCode,
                                result: result
                            }
                            res.render("appointment/scan", { response });
                        }
                    }).catch(err => {
                        console.log('Error Occurs :' + err);
                    });
                } catch (err) {
                    res.json({ 'response': 'Failed', 'Meassage': 'Something went wrong while sending email' })
                }
            } catch (err) {
                res.json({ 'response': 'Failed', 'Meassage': 'Something went wrong while generation qrCode' })
            }
        }       
    }catch{
        res.json({ 'response': 'Failed', 'Meassage': 'Please enter valid data' })

    }

    
};

async function generate_qrCode(data) {
    if (data.length === 0) console.log("Empty Data!");
    let qrCode = await qr.toDataURL(data);
    return qrCode;
}

async function send_qrMail(htmlBody) {
    let mailTransporter = nodemailer.createTransport(smtpTransport({
        service: 'gmail',
        host: 'smtp.gmail.com',
        auth: {
            user: 'shubhrant999@gmail.com',
            pass: 'shubh@9999'
        }
    }));

    let mailDetails = {
        from: 'shubhrant999@gmail.com', // sender address
        to: 'shubhrants@neuronimbus.com', // list of receivers
        subject: 'Test QR code in Email Node JS', // Subject line
        text: 'Hello just testing node js', // plain text body
        html: htmlBody // html body
    };
    return new Promise((resolve, reject) => {
        mailTransporter.sendMail(mailDetails).then(info => {
            console.log('Email sent successfully');
            return resolve(true);
        }).catch(err => {
            console.log('Error Occurs :' + err);
            return reject(false);
        });
    });
}

async function appointment_details(booking_id) {
    return await db.appointment.findOne({
        where: { id: booking_id },
        include: [{
            model: db.customer,
            required: false,
            attributes: ['name', 'email', 'contact_no']
        }, {
            model: db.branch,
            required: false,
            attributes: ['name']
        }],
        raw: true
    })
        .then(async booking_detail => {

            var obj = JSON.parse(booking_detail.services);
            services = Object.keys(obj).map(function (k) { return parseInt(obj[k]) });
            const { Op } = require("sequelize");
            return detail = await db.service.findOne({
                where: {
                    id: {
                        [Op.in]: services
                    }
                },
                attributes: [
                    [db.sequelize.fn('array_agg', db.sequelize.col('name')), 'services']
                ],
                raw: true
            }).
                then(async data => {
                    booking_detail.all_services = await data.services;
                    return booking_detail;
                }).catch(err => {
                    console.log("Some error occurred ." + err);
                    return false;
                });
        })
        .catch(err => {
            console.log("Some error occurred.");
            return false;
        });
}
exports.verify = async (req, res) => {
    let org = req.baseUrl.replace("/", "");
    if (db.sequelize.config.database !== org) {
        db = await require("../models")(org);
    }
    const Appointment = db.appointment;
    booking_id = (req.params.id - 1000);

    Appointment.findOne({
        where: { id: booking_id },
        include: [{
            model: db.customer,
            required: false,
            attributes: ['name', 'email', 'contact_no']
        }, {
            model: db.branch,
            required: false,
            attributes: ['name']
        }],
        raw: true
    })
        .then(async booking_detail => {

            var obj = JSON.parse(booking_detail.services);
            services = Object.keys(obj).map(function (k) { return parseInt(obj[k]) });
            const { Op } = require("sequelize");
            var all_services = await db.service.findOne({
                where: {
                    id: {
                        [Op.in]: services
                    }
                },
                attributes: [
                    [db.sequelize.fn('array_agg', db.sequelize.col('name')), 'services']
                ],
                raw: true
            }).
                then(async data => {
                    return data.services;
                }).catch(err => {
                    res.status(500).send({
                        message:
                            err.message || "Some error occurred ."
                    });
                });
            booking_detail.all_services = all_services;
            res.render("appointment/detail", { booking_detail: booking_detail });
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred ."
            });
        });
};

exports.get_services = async (req, res) => {
    branch_id = req.body.branch;
    console.log(branch_id);

    await db.counter.findAll({
        where: {branch_id: branch_id},
        include: [{
            model: db.service,
            attributes: ['id','name']
        }]
    })
        .then(async data => {
            if (data === null) {
                response = {
                    status: 2,
                    result: "no service found"
                }
            } else {
                // data.forEach(element => {
                //     console.log(element.service.name);
                // });
                
                response = {
                    status: 1,
                    result: data
                }
            }
        })
        .catch(err => {
            console.log(err);
            response = {
                status: 9,
                result: err.message || "Some error occurred."
            }
        });
    // console.log(response);
    res.send(response);
    res.end();

}

exports.get_appointments = async (req, res, next) => {
    let limit = 5; // number of records per page
    let offset = 0;
    let page = req.params.page || 1;// page number
    offset = limit * (page - 1);

    const org_name = req.session.org;
    const user_branchIds = req.session.userdata.branches;
    const roleId = req.session.userdata.roleId;
    var search_formData = null;
    var whereCondition = {};

    if(req.params.page !== undefined){
        var currentPagesegment = req.params.page;
        var filterForm_url = '../appointment';
    }else{ 
        var currentPagesegment = 0;
        var filterForm_url = 'appointment';
    }

    var requestMethod = req.method;
    if (requestMethod == 'POST'){
        search_formData = {
            // search_appointmentId   : req.body.appointment_id.trim(),
            search_appointmentId   : req.body.appointment_id.trim(),            
            search_appointmentDate1 : req.body.holidayList.trim(),
            search_appointmentDate2 : req.body.holidayList2.trim(),
           
        };
        whereCondition = await searchMethod(search_formData);
        req.session.orgFilterFormdata = search_formData;
    }
    else{
        if(req.params.page !== undefined && req.session.orgFilterFormdata !== null ){
            whereCondition = await searchMethod(req.session.orgFilterFormdata);
            search_formData = req.session.orgFilterFormdata;
        }else{            
            req.session.orgFilterFormdata = null;
        }
    }

    if(roleId===1){
        wherecon=null
      }else{       
        wherecon={  
            branch_id: user_branchIds
       };
    }



      
      if(wherecon && whereCondition){
        wherecon = Object.assign(wherecon, whereCondition);
      } else if(whereCondition){
          wherecon = whereCondition;
      }
    
      if (req.session.org) {    
        if (db.sequelize.config.database !== req.session.org) {
            db = await require("../models")(req.session.org);
        }
        let appointmentDetails = [];
        let appointment = await db.appointment.findAndCountAll({where : wherecon,
            limit: limit,
            offset: offset,
            order: [
            ['updatedAt', 'DESC']
        ], raw:true});

        
        let pages = Math.ceil(appointment.count / limit); 


        for (let entry of appointment.rows) {         
            let customerName = await db.customer.findOne({where:{id : entry.customer_id}, raw:true});
            let token = await db.token.findOne({where:{appointment_id : entry.id}, raw:true});
            let services = [];
            let entryService =   entry.services;

            // for(let service of JSON.parse(entry.services)) {                
            for(let service of entryService.split(',')) {                
                let serviceDetails = await db.service.findOne({where:{ id: parseInt(service)},raw:true});
                    service = serviceDetails.name                    
                    services.push(service);
                }

            entry = {
                ...entry,
                customer_name: customerName.name,
                serviceNames: JSON.stringify(services),
                token: token
            }
            appointmentDetails.push(entry);
          }        




            res.render('appointment/appointment_list', { 
                flash: req.flash(),
                pages: pages,
                filterForm_url : filterForm_url,
                currentPagesegment : currentPagesegment,
                data: appointmentDetails, 
                
                current: page,
                org_name: org_name, search_formData: search_formData, moment: moment });
    }
};



async function searchMethod(form_data){
    
    var appointmentId = form_data.search_appointmentId.toLowerCase();   
    var appointmentDate1 = form_data.search_appointmentDate1.toLowerCase();
    var appointmentDate2 = form_data.search_appointmentDate2.toLowerCase();
  
    var whereArray = {};
    if (appointmentId !== null && appointmentId !== '') {
        whereArray.appointmentId = db.sequelize.where(db.sequelize.fn('LOWER', db.sequelize.col('appointment_no')), 'LIKE', '%' + appointmentId + '%')
    }
    if (appointmentDate1 !== null && appointmentDate1 !== '') {
        whereArray.appointment_date = db.sequelize.where(db.sequelize.col('appointment_date'), { [Op.between]: [appointmentDate1,appointmentDate2] }) 
    }
    // if (appointmentDate2 !== null && appointmentDate2 !== '') {
    //     whereArray.appointment_date = db.sequelize.where(db.sequelize.col('appointment_date'), { [Op.lte]: appointmentDate2 }) 
    // }
     console.log(appointmentDate1,appointmentDate2)
    // if (appointmentDate1 !== null && appointmentDate1 !== '') {
    //     whereArray.appointment_date = db.sequelize.query(`select appointments.id from appointments  WHERE  (appointment_date BETWEEN '${appointmentDate1}' AND '${appointmentDate2}')`)}
     
    
    // if (appointmentTime !== null && appointmentTime !== '') {
    //     whereArray.appointment_time = appointmentTime;}
  
//   if(whereArray)
    return whereArray;
    // else return 0;
  };
  exports.cancel = async (req, res) => {
    const Appointment = db.appointment;
    let appointment_id = req.body.id;
    const org_name = req.session.org;
   
    let appointmentName = await db.appointment.findOne({where:{id : appointment_id}, raw:true});
    var customer_id = appointmentName.customer_id;
    var appointmentNo = appointmentName.appointment_no;
    let customerName = await db.customer.findOne({where:{id : customer_id}, raw:true});
    var wa_checked = customerName.wa_checked
    var email_data = customerName.email;
  
    var phone_data = customerName.contact_no;
    Appointment.update({close : 1},{
        where: {
            id: appointment_id
        }
    })
    .then(async data => {
      
        await cancel_notification_1(email_data, phone_data,wa_checked, appointmentNo,org_name, db,  function (returnValue) {
            if (returnValue == true) {
                return res.status(200).json({
                    status: true,
                    success: true,
                    message: 'Appointment has been cancelled successfully.'
                });
            } else {
               res.status(500).send({
               
                    message : "Some error occurred."
            });
            }

        });
    })
    .catch(err => {
        res.status(500).send({
            message:
                err.message || "Some error occurred."
        });
    });
};


exports.cancelAll = async (req, res) => {
    const Appointment = db.appointment;
    const user_branchIds = req.session.userdata.branches;
    const org_name = req.session.org;
    const roleId = req.session.userdata.roleId;
    var id = req.body.id;
    var ids = id.split(',').map(parseFloat);
    let appointmentName = await db.appointment.findAll({
        where: {
            id: { [Op.in]: ids } // Same as using `id: { [Op.in]: [1,2,3] }`
        }
      });
     
      var id_customer = [];
      var appointment_no = [];
      appointmentName.forEach(element => {
          id_customer.push(element.customer_id)
      });
    
      appointmentName.forEach(element => {
        appointment_no.push(element.appointment_no)
      });
     
      
    
    if(roleId===1){
    
       

        const data = await db.sequelize.query(`update appointments set close = 1 WHERE ID NOT IN(SELECT appointment_id FROM tokens) AND (id IN (${id}))`)
      
        .then(async data => {
            
            

              await send_notification(id_customer, appointment_no,org_name, function (returnValue) {
                if (returnValue == true) {
                    return res.status(200).json({
                        status: true,
                        success: true,
                        message: ' All Appointment have been cancelled successfully.'
                    });
                } else {
                   res.status(500).send({
                    message:
                        err.message || "Some error occurred."
                });
                }
    
            });
            // req.flash('deleteAppoitnmentSuccessMsg', 'Appointment deleted successfully!');
            // return res.redirect('./../appointment');
        })
        .catch(err => {
            console.log(err);
            res.status(500).send({
                message:
                    err.message || "Some error occurred."
            });
        });
      }else{       
        const data = await db.sequelize.query(`update appointments set close = 1 WHERE ID NOT IN(SELECT appointment_id FROM tokens) AND  branch_id = '${user_branchIds}'  AND (id IN (${id}))`)
        .then(async data => {
            return res.status(200).json({
                status: true,
                success: true,
                message: 'All Appointments have been cancelled successfully.'

              });
            // req.flash('deleteAppoitnmentSuccessMsg', 'Appointment deleted successfully!');
            // return res.redirect('./../appointment');
        })
        .catch(err => {
            console.log(err);
            res.status(500).send({
                message:
                    err.message || "Some error occurred."
            });
        });
      }
      
    // const data = await db.sequelize.query(`update appointments set close = 1 WHERE ID NOT IN(SELECT appointment_id FROM tokens) AND (appointment_date BETWEEN '${form_data.startdate}' AND '${form_data.enddate}')`);
    
    
   
   
};


async function cancel_notification_1(email_data,phone_data,wa_checked, appointmentNo,org_name, db, callback){
       var waChecked = wa_checked;
        var email = email_data; 
        var phone = phone_data; 
        var appointment_no = appointmentNo
       
         if(db){ 
            const Notification = db.notification;
            Notification.findOne({ 
                where: {  template_alias : "cancel_appointment" } })
            .then(data => {
                if (data == null ) {
                    return false;  
                }
                const Setting = db.setting;
                Setting.findOne({ 
                    where: {  id : 1 } })
                .then(async settingData => {
                        if (settingData!= null) {
                            // if (settingData.smtp === 1 && settingData!= null) {
                            
                                if(data.email_template !== null && data.email_template !== ''){ 
                                    // console.log(data.email_template,"++++++++++++++")
                                    var template = handlebars.compile(data.email_template);
                                    var replacements = {
                                        number: appointment_no,
                                     pwa_app_url:"https://neuronimbusapps.com:8081/",
                                     team_name:org_name
                                    };
                                    console.log(replacements,"replacements")
                                    let subject = 'Appointment cancellation!';
                                     let  logo = "http://65.1.176.15:5000/assets/uploads/"+ settingData.image;
                                    var htmlToSend = template(replacements);
        
                                  console.log(htmlToSend,"htmlsend")
                                    // let email_result =  await helper.send_mail_byHtml(settingData.smtp_host, settingData.smtp_username, settingData.smtp_password,email, "Cancel APPOINTMENT", htmlToSend);
                                    try{
                                        let email_result =  await helper.send_mail_byHtml(" ", " ", " ",email, subject, htmlToSend,logo);
                                        }
                                    catch(e){
                                        console.log("email not sent")
                                        }
                                }       
                            // }



                            // if (settingData.sms === 1 && settingData!= null) {
                            //     // console.log("setting",settingData.sms)  
                                if(data.text_template != null ||  data.text_template != ''){
                                    let text = 'Your OTP for eCareWiz Consumer App is 6666';
                                    var sms_result = await helper.send_sms(phone, text);
                                    // var sms_result = await helper.send_sms(phone, data.text_template);
                                }
                                    
                            // }


                            // if (settingData.whatsapp === 1 && settingData!= null) {
                                  if(waChecked== 1){  
                               var wa_templateId = "appointment_cancellation"
                                var wa_params = {
                                    "0":appointment_no,
                                    "1":"https://neuronimbusapps.com:8081/"
                                };
                                let result =  helper.send_whatsapp_text(phone,wa_templateId,wa_params);
                                console.log(result,"result"); 
                            }
                                    
                            // }
    
    
                        
                                callback(true);
                        
                        }else {        
                            callback(true);
                    }
                    })
                .catch(err => {
                    callback(false); 
                })  
            })
            .catch(err => {
                callback(false);   
            }) 
        }
        
            
};

async function send_notification( customers,appointments,org_name, callback) {
      let customerData = await db.customer.findAll({
        where: {
            id: { [Op.in]: customers } // Same as using `id: { [Op.in]: [1,2,3] }`
        }
      });
      
       if(customerData){ 
          const Notification = db.notification;
          Notification.findOne({ 
              where: {  template_alias : "cancel_appointment" } })
          .then(data => {
              if (data == null ) {
                  return false;  
              }
              const Setting = db.setting;
              Setting.findOne({ 
                  where: {  id : 1 } })
              .then(async settingData => {
              
                      if (settingData!= null) {
                        customerData.forEach(async (row, key) => {
                           
                          // if (settingData.smtp === 1 && settingData!= null) {
                          
                              if(data.email_template !== null && data.email_template !== ''){ 
                                  var template = handlebars.compile(data.email_template);
                                  var replacements = {
                                    number: appointments[key],
                                    pwa_app_url:"https://neuronimbusapps.com:8081/",
                                    team_name:org_name
                                 };
                                 let subject = 'Appointment cancellation!';
                                 let  logo = "http://65.1.176.15:5000/assets/uploads/"+ settingData.image;
                                var htmlToSend = template(replacements);
    
                              console.log(htmlToSend,"htmlsend")
                                // let email_result =  await helper.send_mail_byHtml(settingData.smtp_host, settingData.smtp_username, settingData.smtp_password,email, "Cancel APPOINTMENT", htmlToSend);
                                try{
                                    let email_result =  await helper.send_mail_byHtml(" ", " ", " ",row.email, subject, htmlToSend,logo);
                                    }
                                catch(e){
                                    console.log("email not sent")
                                    }
                                    }       
                          // }



                          // if (settingData.sms === 1 && settingData!= null) {
                              
                              if(data.text_template != null ||  data.text_template != ''){
                                  let text = 'Your OTP for eCareWiz Consumer App is 6666';
                                  var sms_result = await helper.send_sms(row.contact_no, text);
                                  // var sms_result = await helper.send_sms(phone, data.text_template);
                              }
                                  
                          // }
                         
                             // if (settingData.whatsapp === 1 && settingData!= null) {
                            if(row.wa_checked == 1)  {    
                            var wa_templateId = "appointment_cancellation"
                            var wa_params = {
                                "0": appointments[key] ,
                                "1":"https://neuronimbusapps.com:8081/"
                            };
                           
                            let result =  helper.send_whatsapp_text(row.contact_no,wa_templateId,wa_params);
                        } 
                                  
                          // }
                          

                         
                        });
  
  
                      
                              callback(true);
                      
                      }else {        
                          callback(true);
                  }
                  })
              .catch(err => {
                  callback(false); 
              })  
          })
          .catch(err => {
              callback(false);   
          }) 


     
    
    
    
       };
}

