import ClientDetails from '../models/clientDetails.model.js';

const createclientDetails = async (req, res) => {
  try {
    const { clientName } = req.body;
    const clientDetails = await ClientDetails.create({
      clientName: clientName
    });

    await clientDetails.save();

    res
      .status(201)
      .json({ message: 'Created Client: ', data:clientDetails });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export { createclientDetails };
