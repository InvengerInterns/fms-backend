import BusinessUnit from './BusinessUnit.model.js';

// Create a new business unit
export const createBusinessUnit = async (req, res) => {
  try {
    const { businessName } = req.body;
    const newBusinessUnit = await BusinessUnit.create({ businessName });
    res.status(201).json(newBusinessUnit);
  } catch (error) {
    res.status(500).json({ message: 'Error creating business unit', error });
  }
};

//update business unit
const updateBusinessUnit = async (req, res) => {
  try {
    const { id } = req.params;
    const { businessName } = req.body;
    const businessUnit = await BusinessUnit.findByPk(id);
    if (businessUnit) {
      businessUnit.businessName = businessName;
      await businessUnit.save();
      res.status(200).json(businessUnit);
    } else {
      res.status(404).json({ message: 'Business Unit not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//delete business unit
const deleteBusinessUnit = async (req, res) => {
  try {
    const { id } = req.params;
    const businessUnit = await BusinessUnit.findByPk(id);
    if (businessUnit) {
      await businessUnit.destroy();
      res.status(204).json({ message: 'Business Unit deleted' });
    } else {
      res.status(404).json({ message: 'Business Unit not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export { createBusinessUnit, updateBusinessUnit, deleteBusinessUnit };
