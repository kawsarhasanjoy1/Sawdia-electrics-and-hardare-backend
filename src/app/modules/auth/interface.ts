export type TLoginUser = {
    email: string;
    password: string;
};

export type TToken = {
    accessToken: string;
    refreshToken: string;
};

export type TAuthResponse = {
    userId: string;
    email: string;
    accessToken: string;
    refreshToken?: string;
};