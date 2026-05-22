import jwt from 'jsonwebtoken';
const getJwtSecret = () => {
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
        throw new Error('JWT_SECRET is not defined');
    }
    return jwtSecret;
};
const getJwtExpiresIn = () => {
    return (process.env.JWT_EXPIRES_IN ?? '7d');
};
export const signAccessToken = (payload) => {
    const options = {
        expiresIn: getJwtExpiresIn(),
    };
    return jwt.sign(payload, getJwtSecret(), options);
};
export const verifyAccessToken = (token) => {
    return jwt.verify(token, getJwtSecret());
};
