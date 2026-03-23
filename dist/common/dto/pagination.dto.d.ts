export declare class PaginationDto {
    page: number;
    limit: number;
    search?: string;
    sectionId?: number;
    gradeSubjectId?: number;
}
export declare class PaginatedResult<T> {
    data: T[];
    meta: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
        hasNextPage: boolean;
    };
    constructor(data: T[], total: number, page: number, limit: number);
}
