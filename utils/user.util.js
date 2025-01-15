import jwt from 'jsonwebtoken';
import { getCustomQueryResults } from './customQuery.util.js';
import { encryptToken } from '../helper/token.helper.js';

//JWT Signing
const signToken = async (userContext, secret, lifeSpan) => {
  const token = await jwt.sign(userContext, secret, {
    expiresIn: lifeSpan,
  });
  return token;
};

//JWT Encryption
const generateTokens = async (id, role, permissions) => {
  try {
    const userContext = {
      id,
      role,
      permissions,
    };

    const accessToken = await signToken(
      userContext,
      process.env.JWT_SECRET,
      process.env.JWT_LIFESPAN
    );

    const refreshToken = await signToken(
      userContext,
      process.env.REFRESH_TOKEN_SECRET,
      process.env.REFRESH_TOKEN_LIFESPAN
    );

    const { encryptedToken, iv } = await encryptToken(refreshToken);

    return { accessToken, refreshToken, encryptedToken, iv };
  } catch (error) {
    throw new Error(error.message);
  }
};

const getPermissionsForUser = async (userId) => {
  try {
    const tables = ['login_details', 'permissions_masters', 'permissions'];
    const joins = [
      {
        joinType: '',
        onCondition: 'login_details.userId = permissions_masters.userId',
      },
      {
        joinType: '',
        onCondition:
          'permissions.permissionId = permissions_masters.permissionId',
      },
    ];
    const attributes = ['permissions.permissionId AS id','permissionName', 'status'];
    const whereCondition = `login_details.userId = ${userId}`;

    const result = await getCustomQueryResults(
      tables,
      joins,
      attributes,
      whereCondition
    );

    console.log('Permissions:', result);
    return result.map((permission) => {
      return {
        permissionId: permission.id,
        permissionName: permission.permissionName,
        status: permission.status,
      };
    });
  } catch (error) {
    throw new Error(error.message);
  }
};

export { signToken, getPermissionsForUser, generateTokens };
