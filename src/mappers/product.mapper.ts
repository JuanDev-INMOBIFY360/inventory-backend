import { Product } from "../entities/Product";

export class ProductResponseDto {
    id: string;
    name: string;
    brand: string;
    edition?: string;
    content?: string;
    type?: string;
    storage?: string;
    basePrice: number;
    isActive: boolean;
    category: {
        id: string;
        name: string;
    };
    createdAt: Date;
    updatedAt: Date;

    constructor(product: Product) {
        this.id = product.id;
        this.name = product.name;
        this.brand = product.brand;
        this.edition = product.edition;
        this.content = product.content;
        this.type = product.type;
        this.storage = product.storage;
        this.basePrice = Number(product.basePrice);
        this.isActive = product.isActive;
        this.category = {
            id: product.category?.id || "",
            name: product.category?.name || "Sin categoría",
        };
        this.createdAt = product.createdAt;
        this.updatedAt = product.updatedAt;
    }
}

export class ProductMapper {
    static toResponse(product: Product): ProductResponseDto {
        return new ProductResponseDto(product);
    }

    static toResponseList(products: Product[]): ProductResponseDto[] {
        return products.map((p) => this.toResponse(p));
    }
}