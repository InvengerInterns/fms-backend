import Designation from '../models/designation.model.js';

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

export { createDesignation };
