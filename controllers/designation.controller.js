import Designation from '../models/designation.model.js';

//create designation table
const createDesignation = async (req, res) => {
  try {
    const { designationName } = req.body;
    const designation = await Designation.create({
      designationName: designationName,
    });
    await designation.save();

    res.status(201).json({ message: 'Designation Added: ', data: designation });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

//update designation details
const updateDesignation = async (req, res) => {
  try {
    const { designationId } = req.params;
    const { designationName } = req.body;
    const designationUpdate = await Designation.findByPk(designationId);
    if (designationUpdate) {
      designationUpdate.designationName = designationName;
      await designationUpdate.save();
      res.json({ message: 'updated successfully', data: designationUpdate });
    } else {
      res.status(404).json({ message: 'Designation-Details not found' });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

//Get all designation Details
const getalldesignationDetails = async(req,res) => {
  try {
    const designationDisplayall = await Designation.findAll({
      attributes: ['designationId','designationName'],
    });
    res.json(designationDisplayall);
    
  } catch (error) {
    res.status(500).json({ message: 'Error fetching Designation Details units', error });
  }
};

//Get one designation detail
const getdesignationDetails = async(req,res) => {
  try {
    const {designationId} = req.params;
    const designationDisplay = await Designation.findOne({
    where: {designationId:designationId}
    });
    if (!designationDisplay) {
      return res.status(404).json({ message: 'designation not found'});
    }
    res.status(200).json(designationDisplay);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching designation units', error });
  }
};

export { createDesignation , updateDesignation , getalldesignationDetails , getdesignationDetails };
