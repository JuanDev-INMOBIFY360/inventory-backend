import { Request, Response, NextFunction } from "express";
import { ProductService } from "../services/product.service";
import { ProductMapper } from "../mappers/product.mapper";
import {
    CreateProductDto,
    UpdateProductDto,
    ProductIdParamsDto,
} from "../dtos/product.dto";

export class ProductController {
    private productService: ProductService;

    constructor() {
        this.productService = new ProductService();
    }

    create = async (
        req: Request<{}, {}, CreateProductDto>,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        try {
            const product = await this.productService.createProduct(req.body);
            const response = ProductMapper.toResponse(product);
            res.status(201).json(response);
        } catch (error) {
            next(error);
        }
    };

    getAll = async (
        _req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        try {
            const products = await this.productService.getAllProducts();
            const response = ProductMapper.toResponseList(products);
            res.json(response);
        } catch (error) {
            next(error);
        }
    };

    getById = async (
        req: Request<ProductIdParamsDto>,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        try {
            const { id } = req.params;
            const product = await this.productService.getProductById(id);
            const response = ProductMapper.toResponse(product);
            res.json(response);
        } catch (error) {
            next(error);
        }
    };

    update = async (
        req: Request<ProductIdParamsDto, {}, UpdateProductDto>,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        try {
            const { id } = req.params;
            const product = await this.productService.updateProduct(id, req.body);
            const response = ProductMapper.toResponse(product);
            res.json(response);
        } catch (error) {
            next(error);
        }
    };

    toggleStatus = async (
        req: Request<ProductIdParamsDto>,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        try {
            const { id } = req.params;
            const product = await this.productService.toggleProductStatus(id);
            const response = ProductMapper.toResponse(product);
            res.json(response);
        } catch (error) {
            next(error);
        }
    };

    delete = async (
        req: Request<ProductIdParamsDto>,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        try {
            const { id } = req.params;
            await this.productService.deleteProduct(id);
            res.status(204).send();
        } catch (error) {
            next(error);
        }
    };
}