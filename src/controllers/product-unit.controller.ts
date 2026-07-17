import { Request, Response, NextFunction } from "express";
import { ProductUnitService } from "../services/product-unit.service";
import { ProductUnitMapper } from "../mappers/product-unit.mapper";
import {
    CreateProductUnitDto,
    BulkCreateProductUnitDto,
    UpdateProductUnitDto,
    ProductUnitIdParamsDto,
    SellProductUnitDto,
} from "../dtos/product-unit.dto";

export class ProductUnitController {
    private unitService: ProductUnitService;

    constructor() {
        this.unitService = new ProductUnitService();
    }

    // Crear una unidad
    create = async (
        req: Request<{}, {}, CreateProductUnitDto>,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        try {
            const unit = await this.unitService.createUnit(req.body);
            const response = ProductUnitMapper.toResponse(unit);
            res.status(201).json(response);
        } catch (error) {
            next(error);
        }
    };

    // Crear múltiples unidades (bulk)
    createBulk = async (
        req: Request<{}, {}, BulkCreateProductUnitDto>,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        try {
            const { productId, units } = req.body;
            const createdUnits = await this.unitService.createBulkUnits(productId, units);
            const response = ProductUnitMapper.toResponseList(createdUnits);
            res.status(201).json({
                message: `${createdUnits.length} unidades creadas exitosamente`,
                units: response,
            });
        } catch (error) {
            next(error);
        }
    };

    // Listar todas las unidades
    getAll = async (
        _req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        try {
            const units = await this.unitService.getAllUnits();
            const response = ProductUnitMapper.toResponseList(units);
            res.json(response);
        } catch (error) {
            next(error);
        }
    };

    // Listar unidades disponibles
    getAvailable = async (
        _req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        try {
            const units = await this.unitService.getAvailableUnits();
            const response = ProductUnitMapper.toResponseList(units);
            res.json(response);
        } catch (error) {
            next(error);
        }
    };

    // Listar unidades vendidas
    getSold = async (
        _req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        try {
            const units = await this.unitService.getSoldUnits();
            const response = ProductUnitMapper.toResponseList(units);
            res.json(response);
        } catch (error) {
            next(error);
        }
    };

    // Listar unidades por producto
    getByProduct = async (
        req: Request<{ productId: string }>,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        try {
            const { productId } = req.params;
            const units = await this.unitService.getUnitsByProduct(productId);
            const response = ProductUnitMapper.toResponseList(units);
            res.json(response);
        } catch (error) {
            next(error);
        }
    };

    // Obtener unidad por ID
    getById = async (
        req: Request<ProductUnitIdParamsDto>,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        try {
            const { id } = req.params;
            const unit = await this.unitService.getUnitById(id);
            const response = ProductUnitMapper.toResponse(unit);
            res.json(response);
        } catch (error) {
            next(error);
        }
    };

    // Obtener unidad por serial
    getBySerial = async (
        req: Request<{ serial: string }>,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        try {
            const { serial } = req.params;
            const unit = await this.unitService.getUnitBySerial(serial);
            const response = ProductUnitMapper.toResponse(unit);
            res.json(response);
        } catch (error) {
            next(error);
        }
    };

    // Actualizar unidad
    update = async (
        req: Request<ProductUnitIdParamsDto, {}, UpdateProductUnitDto>,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        try {
            const { id } = req.params;
            const unit = await this.unitService.updateUnit(id, req.body);
            const response = ProductUnitMapper.toResponse(unit);
            res.json(response);
        } catch (error) {
            next(error);
        }
    };

    // Marcar como vendida
    sell = async (
        req: Request<ProductUnitIdParamsDto, {}, SellProductUnitDto>,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        try {
            const { id } = req.params;
            const unit = await this.unitService.sellUnit(id, req.body);
            const response = ProductUnitMapper.toResponse(unit);
            res.json({
                message: "Unidad marcada como vendida exitosamente",
                unit: response,
            });
        } catch (error) {
            next(error);
        }
    };

    // Eliminar unidad
    delete = async (
        req: Request<ProductUnitIdParamsDto>,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        try {
            const { id } = req.params;
            await this.unitService.deleteUnit(id);
            res.status(204).send();
        } catch (error) {
            next(error);
        }
    };
}
