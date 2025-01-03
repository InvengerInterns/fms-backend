import jwt from "jsonwebtoken";

//JWT Signing
const signToken = async (id, role, secret, permission, lifeSpan ) => {
    const token = await jwt.sign(
      { id, role, permission },
       secret,
      {
        expiresIn: lifeSpan,
      }
    );
    return token;
  };

export { signToken };