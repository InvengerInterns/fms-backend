import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import axios from 'axios';

dotenv.config();

// Function to get the OAuth2 access token
const getAccessToken = async () => {
  const url = process.env.EMAIL_TOKEN_URI;
  const clientId = process.env.EMAIL_CLIENT_ID;
  const clientSecret = process.env.EMAIL_CLIENT_SECRET;
  const scope = process.env.EMAIL_SCOPE;

  try {
    const response = await axios.post(url, new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      scope: scope,
      grant_type: 'client_credentials', // Use client credentials for application permissions
    }));

    
    console.log('Access token fetched successfully',response.data.expires_in);
    return response.data.access_token; // Return the access token
  } catch (error) {
    console.error('Error fetching access token:', error.response ? error.response.data : error.message);
    throw error;
  }
};

// Create transporter function for Nodemailer
const createTransporter = async () => {
  const accessToken = await getAccessToken();
  const transporter = nodemailer.createTransport({
    service: 'Outlook365',
    host: 'smtp.office365.com',  // Use the correct SMTP host
    port: 587,
    secure: false,  // Do not use TLS directly, since we are using OAuth2
    auth: {
      type: 'OAuth2',
      clientId: process.env.EMAIL_CLIENT_ID,
      clientSecret: process.env.EMAIL_CLIENT_SECRET,
      accessToken: accessToken,
    },
    tls: {
      ciphers: 'SSLv3', // This might be needed for some environments
      rejectUnauthorized: false, // Do not reject unauthorized certificates
    },
    debug: true,
  });

  return transporter;
};

export default createTransporter;