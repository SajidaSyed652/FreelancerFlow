import jwt from 'jsonwebtoken';

export const generateToken = (userId, role) => {
  const secret = process.env.JWT_SECRET || 'freelanceflow_super_secret_jwt_key_2026_secure';
  return jwt.sign({ id: userId, role }, secret, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};
