var ses = require('node-ses');

var NohanaMailAdapter = sesOptions => {

  if (!sesOptions || !sesOptions.apiKey || !sesOptions.apiSecret || !sesOptions.domain || !sesOptions.fromAddress) {
    throw 'NohanaMailAdapter requires an API Key, domain, and fromAddress.';
  }
  
  if(!sesOptions.amazon){
    sesOptions.amazon = 'https://email.us-east-1.amazonaws.com'
  }
  
  var client = ses.createClient({ key: sesOptions.apiKey, secret: sesOptions.apiSecret, amazon : sesOptions.amazon });

  var sendMail = mail => {
    var data = {
      to: mail.to,
      from: sesOptions.fromAddress,
      subject: mail.subject,
      altText: mail.text,
    };

    return new Promise((resolve, reject) => {
      client.sendEmail(data, function(err, body, res) {
        if (typeof err !== 'undefined') {
          console.log(err);
          reject(err);
        }
        resolve(body);
      });
    });
  };

  return Object.freeze({
    sendMail: sendMail
  });
};

module.exports = NohanaMailAdapter;
