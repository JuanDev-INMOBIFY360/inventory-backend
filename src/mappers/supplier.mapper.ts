import { Supplier } from "../entities/Supplier";

export class SupplierResponseDto {
    id: string;
    name: string;
    contactName?: string;
    email?: string;
    phone?: string;
    address?: string;
    notes?: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;

    constructor(supplier: Supplier) {
        this.id = supplier.id;
        this.name = supplier.name;
        this.contactName = supplier.contactName;
        this.email = supplier.email;
        this.phone = supplier.phone;
        this.address = supplier.address;
        this.notes = supplier.notes;
        this.isActive = supplier.isActive;
        this.createdAt = supplier.createdAt;
        this.updatedAt = supplier.updatedAt;
    }
}

export class SupplierMapper {
    static toResponse(supplier: Supplier): SupplierResponseDto {
        return new SupplierResponseDto(supplier);
    }

    static toResponseList(suppliers: Supplier[]): SupplierResponseDto[] {
        return suppliers.map(s => this.toResponse(s));
    }
}