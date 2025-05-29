const nodemailer = require('nodemailer');
const path = require('path');
const ejs = require('ejs');

// Configure transporter (using Mailtrap for testing)
const transporter = nodemailer.createTransport({
  host: process.env.MAILTRAP_HOST,
  port: process.env.MAILTRAP_PORT,
  auth: {
    user: process.env.MAILTRAP_USER,
    pass: process.env.MAILTRAP_PASS
  }
});

exports.sendOrderConfirmationEmail = async (order, email) => {
  try {
    // Determine template based on order status
    const templateName = order.payment.status === 'approved' 
      ? 'orderConfirmation' 
      : 'orderDeclined';
    
    // Render email template
    const templatePath = path.join(__dirname, `../emailTemplates/${templateName}.ejs`);
    const emailHtml = await ejs.renderFile(templatePath, { order });
    
    // Email options
    const mailOptions = {
      from: '"ShopEase" <no-reply@shopease.com>',
      to: email,
      subject: order.payment.status === 'approved' 
        ? `Your Order Confirmation #${order.orderNumber}` 
        : `Issue with Your Order #${order.orderNumber}`,
      html: emailHtml
    };
    
    // Send email
    await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${email} for order ${order.orderNumber}`);
    
  } catch (err) {
    console.error('Error sending email:', err);
    throw err;
  }
};