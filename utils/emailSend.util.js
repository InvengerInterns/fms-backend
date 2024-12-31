import createTransporter from '../config/emailTransport.config.js';

const sendMail = async (toEmail, emailSubject, emailBody) => {
  try {
    console.log('Sending email to:', toEmail);

    // Get the transporter object first
    const transporter = await createTransporter();

    // Use the sendMail method on the transporter object
    await transporter.sendMail({
      from: `"Safile-HRMS" <invengerinterns@outlook.com>`,
      to: toEmail,
      subject: emailSubject,
      html: emailBody,
    });

    console.log('Email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error.message);
    throw error;
  }
};

export default sendMail;
