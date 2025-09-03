import jwt from 'jsonwebtoken'
export const createToken = (payload: any, secret: string, expiresIn: string | number | any): any => {
    return jwt.sign(payload, secret, { expiresIn });
}


export const verifyToken = (token: string, secret: string) => {
    return jwt.verify(token, secret);
}