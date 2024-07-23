import transporter from '../config/emailTransport.config.js';

const sendMail = async (toEmail, emailSubject, emailBody) => {
  try {
    await transporter.sendMail({
      from: `"HR-ADMIN" <internsinvenger@outlook.com>`,
      to: toEmail,
      subject: emailSubject,
      html: emailBody,
    });
  } catch (error) {
    console.error(error.message);
    throw error;
  }
};

export default sendMail;
