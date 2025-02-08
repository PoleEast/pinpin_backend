interface JwtConfig {
    secret: string;
    expiresIn: string;
}

interface JwtPayload {
    account: string;
    nickname: string;
    id: number;
}

export type { JwtConfig, JwtPayload };

