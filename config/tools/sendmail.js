var nodemailer = require('nodemailer');
var util = require('util');
var Promise = require('promise');

exports.sendEmail = function(toEmail, sub, htmlMsg) {
    // Create the transporter with the required configuration for Gmail
    // change the user and pass !
    var transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true, // use SSL
        auth: {
            user: 'google account',
            pass: ''
        }
    });

    // setup e-mail data
    var mailOptions = {
        from: 'google account', // sender address (who sends)
        to: toEmail, // list of receivers (who receives)
        subject: sub, // Subject line
        text: 'Hello Word', // plaintext body
        html: htmlMsg // html body
    };
    console.log(sub);
    console.log(htmlMsg);
    console.log(mailOptions);
    return new Promise((resolve, reject) => {
        // send mail with defined transport object
        transporter.sendMail(mailOptions, function(err, info) {
            // if (err) {
            //     return reject(err);
            // }
            console.log(info);
            resolve(err);
        });
    });
}

exports.vfMsg = function(toEmail, link) {
    var msg = util.format('Please confirm that %s is your email address so that you can enjoy Hi App!<br><a class="btn" href=\"%s\">Click Me!</a><br>If you did not register an account with us, simply ignore this email. Someone must have mis-typed their email address.<br>Thanks!<p>', toEmail, link);

    var vfMagJson = {
        Sub: 'Welcome !',
        SendMsg: msg
    };
    return vfMagJson;
}

exports.forPasMsg = function(toEmail, link) {
    var msg = util.format('Hello %s!<br>Someone has requested a link to change your password. You can do this through the link below.<br><a class="btn" href=\"%s\">Change Password!</a><br>If you didn’t request this, please ignore this email.<br>Your password won’t change until you access the link above and create a new one.', toEmail, link);
    var forPasJson = {
        Sub: 'Reset your password',
        SendMsg: msg
    };
    return forPasJson;
}

exports.domain = function() {
    return '192.168.10.4';
}