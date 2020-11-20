let nodemailer = require('nodemailer');
let mailerConfig=require('./mailerConfig');

let transporter = nodemailer.createTransport(mailerConfig);


module.exports.temp=(mailOptions)=>{
  transporter.sendMail(mailOptions, function (error) {
    if (error) {
        console.log('error:', error);
    } else {
        console.log('good');
    }
});
}