import PermissionsMaster from '../models/permissionsMaster.model.js';
import { accessControls, permission_Ids, users } from '../constants.js';

const createPermissions = async (req, res) => {
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
    };

    const newUserPermissions = await Promise.all(
      Object.entries(permissionsWithStatus).map(
        async ([permissionId, status]) => {
          return await PermissionsMaster.create({
            userId: newUserData.userId,
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

export { createPermissions };
