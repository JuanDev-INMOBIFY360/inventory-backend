import { ProductUnitRepository } from "../repositories/product-unit.repository";
import { ProductRepository } from "../repositories/product.repository";
import { ClientRepository } from "../repositories/client.repository";
import { ProductUnit } from "../entities/ProductUnit";
import { CreateProductUnitDto, SellProductUnitDto } from "../dtos/product-unit.dto";

export class ProductUnitService {
    private unitRepo: ProductUnitRepository;
    private productRepo: ProductRepository;
    private clientRepo: ClientRepository;

    constructor() {
        this.unitRepo = new ProductUnitRepository();
        this.productRepo = new ProductRepository();
        this.clientRepo = new ClientRepository();
    }

    // Crear una unidad
    async createUnit(createDto: CreateProductUnitDto): Promise<ProductUnit> {
        // Validar producto
        const product = await this.productRepo.findById(createDto.productId);
        if (!product) {
            throw new Error(`Producto con ID ${createDto.productId} no encontrado`);
        }

        // Validar serial único
        const exists = await this.unitRepo.existsBySerial(createDto.serial);
        if (exists) {
            throw new Error(`Ya existe una unidad con el serial "${createDto.serial}"`);
        }

        return this.unitRepo.create(createDto);
    }

    // Crear múltiples unidades (bulk)
    async createBulkUnits(
        productId: string,
        unitsData: CreateProductUnitDto[]
    ): Promise<ProductUnit[]> {
        // Validar producto
        const product = await this.productRepo.findById(productId);
        if (!product) {
            throw new Error(`Producto con ID ${productId} no encontrado`);
        }

        // Validar seriales únicos
        const serials = unitsData.map(u => u.serial);
        const duplicateSerials = serials.filter((s, i) => serials.indexOf(s) !== i);
        if (duplicateSerials.length > 0) {
            throw new Error(`Seriales duplicados: ${duplicateSerials.join(", ")}`);
        }

        // Verificar que ningún serial exista en la BD
        for (const unit of unitsData) {
            const exists = await this.unitRepo.existsBySerial(unit.serial);
            if (exists) {
                throw new Error(`El serial "${unit.serial}" ya está registrado`);
            }
        }

        // Crear todas las unidades
        const unitsToCreate = unitsData.map(u => ({
            ...u,
            productId,
        }));

        return this.unitRepo.createBulk(unitsToCreate);
    }

    // Obtener todas las unidades
    async getAllUnits(): Promise<ProductUnit[]> {
        return this.unitRepo.findAll();
    }

    // Obtener unidades disponibles
    async getAvailableUnits(): Promise<ProductUnit[]> {
        return this.unitRepo.findAvailable();
    }

    // Obtener unidades vendidas
    async getSoldUnits(): Promise<ProductUnit[]> {
        return this.unitRepo.findSold();
    }

    // Obtener unidades por producto
    async getUnitsByProduct(productId: string): Promise<ProductUnit[]> {
        const product = await this.productRepo.findById(productId);
        if (!product) {
            throw new Error(`Producto con ID ${productId} no encontrado`);
        }
        return this.unitRepo.findByProduct(productId);
    }

    // Obtener unidad por ID
    async getUnitById(id: string): Promise<ProductUnit> {
        return this.unitRepo.findByIdOrFail(id);
    }

    // Obtener unidad por serial
    async getUnitBySerial(serial: string): Promise<ProductUnit> {
        const unit = await this.unitRepo.findBySerial(serial);
        if (!unit) {
            throw new Error(`Unidad con serial "${serial}" no encontrada`);
        }
        return unit;
    }

    // Actualizar unidad
    async updateUnit(id: string, updateDto: Partial<CreateProductUnitDto>): Promise<ProductUnit> {
        const unit = await this.unitRepo.findByIdOrFail(id);

        // Si se actualiza el serial, validar que sea único
        if (updateDto.serial && updateDto.serial !== unit.serial) {
            const exists = await this.unitRepo.existsBySerial(updateDto.serial, id);
            if (exists) {
                throw new Error(`Ya existe una unidad con el serial "${updateDto.serial}"`);
            }
        }

        return this.unitRepo.update(id, updateDto);
    }

    // Marcar unidad como vendida
    async sellUnit(id: string, sellDto: SellProductUnitDto): Promise<ProductUnit> {
        const unit = await this.unitRepo.findByIdOrFail(id);

        if (unit.isSold) {
            throw new Error(`La unidad con serial "${unit.serial}" ya está vendida`);
        }

        // Validar cliente
        const client = await this.clientRepo.findById(sellDto.clientId);
        if (!client) {
            throw new Error(`Cliente con ID ${sellDto.clientId} no encontrado`);
        }

        const saleDate = sellDto.saleDate ? new Date(sellDto.saleDate) : new Date();

        return this.unitRepo.markAsSold(
            id,
            sellDto.clientId,
            sellDto.salePrice,
            saleDate
        );
    }

    // Eliminar unidad
    async deleteUnit(id: string): Promise<void> {
        const unit = await this.unitRepo.findByIdOrFail(id);
        if (unit.isSold) {
            throw new Error(`No se puede eliminar una unidad vendida (serial: ${unit.serial})`);
        }
        await this.unitRepo.delete(id);
    }
}