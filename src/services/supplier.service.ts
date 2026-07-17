import { SupplierRepository } from "../repositories/supplier.repository";
import { Supplier } from "../entities/Supplier";
import { CreateSupplierDto, UpdateSupplierDto } from "../dtos/supplier.dto";

export class SupplierService {
    private supplierRepo: SupplierRepository;

    constructor() {
        this.supplierRepo = new SupplierRepository();
    }

    async createSupplier(createDto: CreateSupplierDto): Promise<Supplier> {
        return this.supplierRepo.create(createDto);
    }

    async getAllSuppliers(): Promise<Supplier[]> {
        return this.supplierRepo.findAll();
    }

    async getSupplierById(id: string): Promise<Supplier> {
        return this.supplierRepo.findByIdOrFail(id);
    }

    async updateSupplier(
        id: string,
        updateDto: UpdateSupplierDto
    ): Promise<Supplier> {
        return this.supplierRepo.update(id, updateDto);
    }

    async deleteSupplier(id: string): Promise<void> {
        await this.supplierRepo.delete(id);
    }

    async toggleSupplierStatus(id: string): Promise<Supplier> {
        return this.supplierRepo.toggleStatus(id);
    }
}