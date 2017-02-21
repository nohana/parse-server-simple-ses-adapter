var ses = require('node-ses');
var twilio = require('twilio');

var NohanaMailAdapter = options => {

  if (!options) {
    throw 'NohanaMailAdapter requires options.';
  }

  var sesOptions = options.ses;
  if (!sesOptions || !sesOptions.apiKey || !sesOptions.apiSecret || !sesOptions.domain || !sesOptions.fromAddress) {
    throw 'NohanaMailAdapter requires an SES API Key, SES domain, and SES fromAddress.';
  }
  if(!sesOptions.amazon){
    sesOptions.amazon = 'https://email.us-east-1.amazonaws.com'
  }
  var sesClient = ses.createClient({ key: sesOptions.apiKey, secret: sesOptions.apiSecret, amazon : sesOptions.amazon });

  var twilioOptions = options.twilio;
  if (!twilioOptions || !twilioOptions.accountSid || !twilioOptions.authToken || !twilioOptions.fromTelNumber) {
    throw 'NohanaMailAdapter requires an twilio account sid, twilio auth token, and fromTelNumber.';
  }
  var twilioClient = new twilio.RestClient(twilioOptions.accountSid, twilioOptions.authToken);

  var sendMail = mail => {
    var data = {
      to: mail.to,
      from: sesOptions.fromAddress,
      subject: mail.subject,
      altText: mail.text,
    };

    return new Promise((resolve, reject) => {
      sesClient.sendEmail(data, function(err, body, res) {
        if (typeof err !== 'undefined') {
          console.log(err);
          reject(err);
        }
        resolve(body);
      });
    });
  };

  var sendPasswordResetEmail = options => {
    var data = {
      to: options.to,
      from: twilioOptions.fromTelNumber,
      body: options.text,
    };
    twilioClient.messages.create(data, function (err, message) {
      if (typeoof err !== 'undefined') {
        console.log(err);
        reject(err);
      }
      resolve(message);
    });
  };

  return Object.freeze({
    sendMail: sendMail,
    sendPasswordResetEmail: sendPasswordResetEmail
  });
};

module.exports = NohanaMailAdapter;
