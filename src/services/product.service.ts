import { ProductRepository } from "../repositories/product.repository";
import { CategoryRepository } from "../repositories/category.repository";
import { Product } from "../entities/Product";
import { CreateProductDto, UpdateProductDto } from "../dtos/product.dto";

export class ProductService {
    private productRepo: ProductRepository;
    private categoryRepo: CategoryRepository;

    constructor() {
        this.productRepo = new ProductRepository();
        this.categoryRepo = new CategoryRepository();
    }

    async createProduct(createDto: CreateProductDto): Promise<Product> {
        const category = await this.categoryRepo.findById(createDto.categoryId);
        if (!category) {
            throw new Error(`Categoría con ID ${createDto.categoryId} no encontrada`);
        }

        return this.productRepo.create(createDto);
    }

    async getAllProducts(): Promise<Product[]> {
        return this.productRepo.findAll();
    }

    async getProductById(id: string): Promise<Product> {
        return this.productRepo.findByIdOrFail(id);
    }

    async updateProduct(id: string, updateDto: UpdateProductDto): Promise<Product> {
        
        await this.productRepo.findByIdOrFail(id);

        if (updateDto.categoryId) {
            const category = await this.categoryRepo.findById(updateDto.categoryId);
            if (!category) {
                throw new Error(`Categoría con ID ${updateDto.categoryId} no encontrada`);
            }
        }

        return this.productRepo.update(id, updateDto);
    }

    async deleteProduct(id: string): Promise<void> {
        await this.productRepo.delete(id);
    }


    async toggleProductStatus(id: string): Promise<Product> {
        return this.productRepo.toggleStatus(id);
    }
}