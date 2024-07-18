import Designation from "../models/designation.model.js";

const createDesignation = async (req, res) => {
  try {
    const designation = await Designation.create(req.body);
    res.status(201).json({message:'Error in Designation',designation});
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export default createDesignation;
