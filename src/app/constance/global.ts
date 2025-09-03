export type UserRole = 'user' | 'admin' | 'superadmin' | 'sales';

export const USER_ROLE = {
    admin: 'admin',
    superadmin: 'superadmin',
    sales: 'sales',
    user: 'user'
} as const;

export type TUserRole = keyof typeof USER_ROLE