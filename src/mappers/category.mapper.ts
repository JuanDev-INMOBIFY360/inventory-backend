import { Category } from "../entities/Category";

export class CategoryResponseDto {
    id: string;
    name: string;
    description?: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;

    constructor(category: Category) {
        this.id = category.id;
        this.name = category.name;
        this.description = category.description;
        this.isActive = category.isActive;
        this.createdAt = category.createdAt;
        this.updatedAt = category.updatedAt;
    }
}

export class CategoryMapper {
    static toResponse(category: Category): CategoryResponseDto {
        return new CategoryResponseDto(category);
    }

    static toResponseList(categories: Category[]): CategoryResponseDto[] {
        return categories.map(cat => this.toResponse(cat));
    }
}