import ClientDetails from '../models/clientDetails.model.js';

//Create table for  client details
const createclientDetails = async (req, res) => {
  try {
    const { clientName } = req.body;
    const { businessId } = req.body;
    const clientDetails = await ClientDetails.create({
      clientName: clientName,
      clientDetailsStatus: 2,
      businessId: businessId,
    });
    await clientDetails.save();
    res.status(201).json({ message: 'Created Client: ', data: clientDetails });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// update table for client details
const updateclientDetails = async (req, res) => {
  try {
    const { clientId } = req.params;
    const { clientName } = req.body;
    const clientSearch = await ClientDetails.findByPk(clientId);
    if (clientSearch) {
      clientSearch.clientName = clientName;
      await clientSearch.save();
      res.json({ message: 'updated successfully', data: clientSearch });
    } else {
      res.status(404).json({ message: 'ClientDetails not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Display all clientDetails units
const getallclientDetails = async (req, res) => {
  try {
    const clientDisplayall = await ClientDetails.findAll({
      attributes: ['clientId', 'clientName'],
    });
    res.json(clientDisplayall);
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Error fetching clientDetails units', error });
  }
};

//Display Individual client units
const getclientDetails = async (req, res) => {
  try {
    const { clientId } = req.params;
    const clientDisplay = await ClientDetails.findOne({
      where: { clientId: clientId },
    });
    if (!clientDisplay) {
      return res.status(404).json({ message: 'client not found' });
    }
    res.status(200).json(clientDisplay);
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Error fetching clientDetails units', error });
  }
};

// Get Client ID and Name based on Business ID For Dropdown

const getClientsByBusinessId = async (req, res) => {
  try {
    const { businessId } = req.params;
    const clients = await ClientDetails.findAll({
      where: { businessId }, // Filter clients by businessId
      attributes: ['clientId', 'clientName'],
    });
    res.status(200).json(clients);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching clients', error });
  }
};

export {
  createclientDetails,
  updateclientDetails,
  getallclientDetails,
  getclientDetails,
  getClientsByBusinessId,
};
