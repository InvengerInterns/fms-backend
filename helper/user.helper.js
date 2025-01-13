import PermissionsMaster from '../models/permissionsMaster.model.js';
import { accessControls, permission_Ids, users } from '../constants.js';

const createPermissions = async (newUserData) => {
  try {
    const permissionsWithStatus = {
      [permission_Ids.ABOUT]: accessControls.MODIFY,
      [permission_Ids.INTERVIEWS]: accessControls.MODIFY,
      [permission_Ids.SALARY_SLIP]: accessControls.NO_ACCESS,
      [permission_Ids.OFFER_CONFIRMATION]: accessControls.NO_ACCESS,
      [permission_Ids.OFFER_LETTER]: accessControls.NO_ACCESS,
      [permission_Ids.ONBOARDING]: accessControls.NO_ACCESS,
      [permission_Ids.BACKGROUND_VERIFICATION]: accessControls.WRITE,
      [permission_Ids.PERFORMANCE_APPRAISAL]: accessControls.NO_ACCESS,
      [permission_Ids.CERTIFICATION]: accessControls.READ,
      [permission_Ids.HR_SCREENING]: accessControls.READ,
      [permission_Ids.EXIT_FORMALITIES]: accessControls.NO_ACCESS,
      [permission_Ids.CLIENT_HISTORY]: accessControls.READ,
      [permission_Ids.USER_MANAGEMENT]: accessControls.NO_ACCESS,
    };

    const newUserPermissions = await Promise.all(
      Object.entries(permissionsWithStatus).map(
        async ([permissionId, status]) => {
          return await PermissionsMaster.create({
            userId: newUserData,
            permissionId: parseInt(permissionId),
            status: status,
          });
        }
      )
    );
    return newUserPermissions;
  } catch (error) {
    throw error;
  }
};

const updatePermissions = async (userId, permissions) => {
  try {
    const permissionsMap = Array.isArray(permissions)
      ? Object.fromEntries(permissions.map(p => [p.permissionId, p.status]))
      : permissions;

    const userPermissions = await PermissionsMaster.findAll({ 
      where: { userId } 
    });

    for (const permission of userPermissions) {
      if (permissionsMap[permission.permissionId] !== undefined) {
        permission.status = permissionsMap[permission.permissionId];
        await permission.save();
      }
    }

    return userPermissions;
  } catch (error) {
    throw new Error(`Failed to update permissions: ${error.message}`);
  }
};

export { createPermissions, updatePermissions };
