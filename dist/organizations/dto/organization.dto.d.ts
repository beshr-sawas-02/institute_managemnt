export declare class CreateOrganizationDto {
    name: string;
    type: string;
    slug: string;
    email: string;
    phone?: string;
    address?: string;
    logo?: string;
}
declare const UpdateOrganizationDto_base: import("@nestjs/common").Type<Partial<CreateOrganizationDto>>;
export declare class UpdateOrganizationDto extends UpdateOrganizationDto_base {
    isActive?: boolean;
}
export {};
