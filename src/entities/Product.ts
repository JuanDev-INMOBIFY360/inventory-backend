import {
    Entity,
    PrimaryGeneratedColumn, 
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne, 
    JoinColumn,
    OneToMany, 
} from "typeorm";
import { Category } from "./Category";
import { ProductUnit } from "./ProductUnit";

@Entity("products")
export class Product {
    @PrimaryGeneratedColumn("uuid") 
    id: string;

    @Column({length:200})
    name:string

    @Column({ length: 100 })
    brand: string;

    @Column({ length: 200, nullable: true })
    edition: string;

    @Column({ type: "text", nullable: true })
    content: string;

    @Column({ length: 100, nullable: true })
    type: string;

    @Column({ length: 50, nullable: true })
    storage: string;

    @Column({ type: "decimal", precision: 10, scale: 2 })
    basePrice: number;

    @Column({ default: true })
    isActive: boolean;

    @ManyToOne(() => Category, { eager: true }) 
    @JoinColumn({ name: "categoryId" })
    category: Category;

    @Column({ nullable: true })
    categoryId: string;

    @OneToMany(() => ProductUnit, (unit) => unit.product) 
    units: ProductUnit[];

    @CreateDateColumn({ name: "created_at" })
    createdAt: Date;

    @UpdateDateColumn({ name: "updated_at" })
    updatedAt: Date;
}