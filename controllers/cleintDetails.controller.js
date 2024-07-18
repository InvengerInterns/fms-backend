import ClientDetails from "../models/clientDetails.model.js";

const createclientDetails = async (req, res) => {
  try {
    const clientDetails = await ClientDetails.create(req.body);
    res.status(201).json({message:'Error in client details: ',clientDetails});
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export default createclientDetails;
