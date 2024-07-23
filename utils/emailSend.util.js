import transporter from '../config/emailTransport.config.js';

const sendMail = async (
  req,
  res,
  fromEmail,
  toEmail,
  emailSubject,
  emailBody
) => {
  try {
    const emailInfo = await transporter.sendMail({
      from: `"HR-ADMIN" <${fromEmail}>`,
      to: toEmail,
      subject: emailSubject,
      html: emailBody,
    });

    res.status(200).json({ message: `Message Sent: ${emailInfo}` });
  } catch (error) {
    res.status(500).json({ message: `Message Not Sent: ${error.message}` });
    throw error;
  }
};

export default sendMail;
