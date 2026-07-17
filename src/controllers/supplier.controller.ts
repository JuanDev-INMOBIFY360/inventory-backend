import { Request, Response, NextFunction } from "express";
import { SupplierService } from "../services/supplier.service";
import { SupplierMapper } from "../mappers/supplier.mapper";
import {
    CreateSupplierDto,
    UpdateSupplierDto,
    SupplierIdParamsDto,
} from "../dtos/supplier.dto";

export class SupplierController {
    private supplierService: SupplierService;

    constructor() {
        this.supplierService = new SupplierService();
    }

    // Crear proveedor
    create = async (
        req: Request<{}, {}, CreateSupplierDto>,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        try {
            const supplier = await this.supplierService.createSupplier(req.body);
            const response = SupplierMapper.toResponse(supplier);
            res.status(201).json(response);
        } catch (error) {
            next(error);
        }
    };

    // Listar todos los proveedores
    getAll = async (
        _req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        try {
            const suppliers = await this.supplierService.getAllSuppliers();
            const response = SupplierMapper.toResponseList(suppliers);
            res.json(response);
        } catch (error) {
            next(error);
        }
    };

    // Obtener proveedor por ID
    getById = async (
        req: Request<SupplierIdParamsDto>,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        try {
            const { id } = req.params;
            const supplier = await this.supplierService.getSupplierById(id);
            const response = SupplierMapper.toResponse(supplier);
            res.json(response);
        } catch (error) {
            next(error);
        }
    };

    // Actualizar proveedor
    update = async (
        req: Request<SupplierIdParamsDto, {}, UpdateSupplierDto>,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        try {
            const { id } = req.params;
            const supplier = await this.supplierService.updateSupplier(id, req.body);
            const response = SupplierMapper.toResponse(supplier);
            res.json(response);
        } catch (error) {
            next(error);
        }
    };

    // Cambiar estado
    toggleStatus = async (
        req: Request<SupplierIdParamsDto>,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        try {
            const { id } = req.params;
            const supplier = await this.supplierService.toggleSupplierStatus(id);
            const response = SupplierMapper.toResponse(supplier);
            res.json(response);
        } catch (error) {
            next(error);
        }
    };

    // Eliminar proveedor
    delete = async (
        req: Request<SupplierIdParamsDto>,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        try {
            const { id } = req.params;
            await this.supplierService.deleteSupplier(id);
            res.status(204).send();
        } catch (error) {
            next(error);
        }
    };
}