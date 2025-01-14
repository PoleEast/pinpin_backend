import { JwtConfig } from 'src/interfaces/jwt.interface';

const jwtconfig: JwtConfig = {
    secret: process.env.JWT_SECRET as string,
    expiresIn: process.env.JWT_EXPIRES_IN as string,
};

export { jwtconfig };
