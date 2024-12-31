import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const createTransporter = async () => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST, // Adjust this based on your SES region
      port: 587, // Or 465 for SSL
      secure: false,
      auth: {
        user: process.env.SMTP_USERNAME, // SES SMTP Username from the AWS Console
        pass: process.env.SMTP_PASSWORD, // SES SMTP Password from the AWS Console
      },
    });

    return transporter;
  } catch (error) {
    console.error('Error creating transporter:', error.message);
    throw error;
  }
};

export default createTransporter;
