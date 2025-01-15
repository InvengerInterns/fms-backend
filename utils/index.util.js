// Utility function for sending response
const sendResponse = (res, statusCode, message, data = null) => {
    const response = { message };
    if (data) response.data = data;
    return res.status(statusCode).json(response);
  };

export { sendResponse };