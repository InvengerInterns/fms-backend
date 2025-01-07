import path from 'path';
import fs from 'fs/promises';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//Email Body Matching
const getHtmlContent = async (type, options = {}) => {
  try {
    console.log('Options:', options);
    const htmlContent = await getHtmlContentByType(type, options);
    return htmlContent;
  } catch (error) {
    console.error('Error reading or processing file:', error);
    throw error;
  }
};

const getHtmlContentByType = async (type, options) => {
  const isOtpTypeAndValidOptions = (type, options) => {
    return type.toLowerCase() === 'otp' && options.otp;
  };

  const isNewPasswordTypeAndValidOptions = (type, options) => {
    return (
      type.toLowerCase() === 'new-password' && options.username && options.link
    );
  };

  let filePath;
  let htmlContent;

  if (isOtpTypeAndValidOptions(type, options)) {
    filePath = path.join(__dirname, '../public/otp_body.html');
    htmlContent = await fs.readFile(filePath, 'utf-8');
    htmlContent = htmlContent.replace('{{OTP}}', options.otp);
  } else if (isNewPasswordTypeAndValidOptions(type, options)) {
    filePath = path.join(__dirname, '../public/new_password.html');
    htmlContent = await fs.readFile(filePath, 'utf-8');
    htmlContent = htmlContent
      .replace('{{USERNAME}}', options.username)
      .replace('{{PASSWORD_CREATION_LINK}}', options.link);
  } else {
    throw new Error('Invalid parameters or missing template variables');
  }

  return htmlContent;
};

export { getHtmlContent };
