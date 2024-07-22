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

export { createDesignation, updateDesignation };
