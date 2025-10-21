// utils/sendEmail.js
const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  console.log('\n🎯 STARTING EMAIL SERVICE - FIXED VERSION');
  console.log('📧 To:', options.email);
  console.log('📋 Subject:', options.subject);
  
  // SIMPLIFIED configuration - remove socket family setting
  const config = {
    host: process.env.SMTP_HOST || 'sandbox.smtp.mailtrap.io',
    port: parseInt(process.env.SMTP_PORT) || 2525,
    auth: {
      user: process.env.SMTP_USER || '8b5f777ba249db',
      pass: process.env.SMTP_PASS || 'f12bb9cce46f86'
    },
    secure: false,
    tls: {
      rejectUnauthorized: false
    },
    // REMOVED: socket: { family: 4 } - This causes issues in newer Node.js
    connectionTimeout: 30000,
    greetingTimeout: 30000,
    socketTimeout: 30000
  };

  console.log('🔧 Using simplified configuration (IPv4 forced via DNS)');
  console.log('   Host:', config.host);
  console.log('   Port:', config.port);
  console.log('   User:', config.auth.user);

  const transporter = nodemailer.createTransport(config);

  try {
    console.log('🔌 Testing connection...');
    await transporter.verify();
    console.log('✅ Connection successful!');

    const message = {
      from: `"${process.env.FROM_NAME || 'DevCamper'}" <${process.env.FROM_EMAIL || 'noreply@devcamper.com'}>`,
      to: options.email,
      subject: options.subject,
      text: options.message,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>Password Reset Request</h2>
          <p>You are receiving this email because you requested a password reset.</p>
          <div style="background: #f5f5f5; padding: 15px; border-radius: 5px; margin: 15px 0;">
            <p><strong>Reset Instructions:</strong></p>
            <p>${options.message}</p>
          </div>
          <p><em>If you didn't request this, please ignore this email.</em></p>
        </div>
      `
    };

    console.log('📤 Sending email...');
    const info = await transporter.sendMail(message);
    console.log('✅ Email sent successfully! ID:', info.messageId);
    
    return info;

  } catch (error) {
    console.error('❌ Email failed:');
    console.error('   Code:', error.code);
    console.error('   Message:', error.message);
    
    throw error;
  }
};

module.exports = sendEmail;


// const nodemailer = require('nodemailer');

// const sendEmail = async (options) => {
//   const transporter = nodemailer.createTransport({
//     host: process.env.SMTP_HOST,
//     port: process.env.SMTP_PORT,
//     auth: {
//       user: process.env.SMTP_EMAIL,
//       pass: process.env.SMTP_PASSWORD,
//     },
//   });

//   const message = {
//     from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`,
//     to: options.email,
//     subject: options.subject,
//     text: options.message,
//   };

//   const info = await transporter.sendMail(message);

//   console.log('Message sent: %s', info.messageId);
// };

// module.exports = sendEmail;
