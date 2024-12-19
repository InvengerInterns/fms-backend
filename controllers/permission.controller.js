import Permissions from '../models/permissions.model.js';

const createPermission = async (req, res) => {
  try {
    const permissions = req.body; // Expecting an array of permission objects
    if (!Array.isArray(permissions)) {
      return res
        .status(400)
        .json({ message: 'Input must be an array of permissions.' });
    }

    const createdPermissions = await Permissions.bulkCreate(permissions, {
      returning: true,
    });
    res.status(201).json(createdPermissions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updatePermission = async (req, res) => {
  try {
    const { permissionId } = req.params;
    const { permissionName } = req.body;
    const permission = await Permissions.update(
      { permissionName },
      { where: { permissionId } }
    );
    res.status(200).json(permission);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deletePermission = async (req, res) => {
  try {
    const { permissionId } = req.params;
    await Permissions.destroy({ where: { permissionId } });
    res.status(200).json({ message: 'Permission deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export { createPermission, updatePermission, deletePermission };
