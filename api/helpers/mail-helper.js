const mail = require('@sendgrid/mail');

const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY || require('../../config.json').SENDGRID_API_KEY;

module.exports.sendMessage = (to, subject, text) => {
    if (SENDGRID_API_KEY) {
        mail.setApiKey(SENDGRID_API_KEY);
        const message = {
            to,
            from: 'noreply@utdtutoring.com',
            subject,
            text,
            html: text
        };
    
        mail.send(message)
            .then(() => console.log(`Sent email to ${to}.`))
            .catch(err => console.log('Cannot send emails in dev environment.'));
    } else {
        console.log(`Attempted to send an email to ${to}, but cannot send emails in development environment.`);
    }
};
