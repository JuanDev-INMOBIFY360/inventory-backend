import { ProductUnit } from "../entities/ProductUnit";

export class ProductUnitResponseDto {
    id: string;
    serial: string;
    status: string;
    purchasePrice?: number;
    salePrice?: number;
    isSold: boolean;
    entryDate?: Date;
    saleDate?: Date;
    product: {
        id: string;
        name: string;
        brand: string;
    };
    client?: {
        id: string;
        name: string;
        phone?: string;
    };
    createdAt: Date;
    updatedAt: Date;

    constructor(unit: ProductUnit) {
        this.id = unit.id;
        this.serial = unit.serial;
        this.status = unit.status;
        this.purchasePrice = unit.purchasePrice ? Number(unit.purchasePrice) : undefined;
        this.salePrice = unit.salePrice ? Number(unit.salePrice) : undefined;
        this.isSold = unit.isSold;
        this.entryDate = unit.entryDate;
        this.saleDate = unit.saleDate;
        this.product = {
            id: unit.product?.id || "",
            name: unit.product?.name || "Producto eliminado",
            brand: unit.product?.brand || "",
        };
        if (unit.client) {
            this.client = {
                id: unit.client.id,
                name: unit.client.name,
                phone: unit.client.phone,
            };
        }
        this.createdAt = unit.createdAt;
        this.updatedAt = unit.updatedAt;
    }
}

export class ProductUnitMapper {
    static toResponse(unit: ProductUnit): ProductUnitResponseDto {
        return new ProductUnitResponseDto(unit);
    }

    static toResponseList(units: ProductUnit[]): ProductUnitResponseDto[] {
        return units.map(u => this.toResponse(u));
    }
}