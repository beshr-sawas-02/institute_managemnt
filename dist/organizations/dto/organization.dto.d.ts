export declare class CreateOrganizationDto {
    nameAr: string;
    nameEn: string;
    type: 'school' | 'institute';
    slug: string;
    email: string;
    phone?: string;
    address?: string;
    logo?: string;
    adminPassword: string;
}
declare const UpdateOrganizationDto_base: import("@nestjs/common").Type<Partial<Omit<CreateOrganizationDto, "adminPassword">>>;
export declare class UpdateOrganizationDto extends UpdateOrganizationDto_base {
    isActive?: boolean;
}
export declare class ResetOrganizationAdminPasswordDto {
    newPassword: string;
}
export {};
