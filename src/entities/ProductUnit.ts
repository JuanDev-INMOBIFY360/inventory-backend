import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    JoinColumn,
} from "typeorm";
import { Product } from "./Product";
import { Client } from "./Client";

@Entity("product_units")
export class ProductUnit {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ length: 100, unique: true })
    serial: string; // S01-V55601UNL10250057

    @Column({ length: 50, default: "Nuevo Sellado" })
    status: string; // "Nuevo Sellado", "Usado", "Dañado"

    @Column({ type: "decimal", precision: 10, scale: 2, nullable: true })
    purchasePrice: number; // Precio al que se compró esta unidad

    @Column({ type: "decimal", precision: 10, scale: 2, nullable: true })
    salePrice: number; // Precio al que se vendió (si se vendió)

    @Column({ default: false })
    isSold: boolean;

    @Column({ type: "date", nullable: true })
    entryDate: Date; // Fecha de ingreso

    @Column({ type: "date", nullable: true })
    saleDate: Date; // Fecha de venta

    @ManyToOne(() => Product, (product) => product.units)
    @JoinColumn({ name: "productId" })
    product: Product;

    @Column()
    productId: string;

    @ManyToOne(() => Client, { nullable: true })
    @JoinColumn({ name: "clientId" })
    client: Client;

    @Column({ nullable: true })
    clientId: string;

    @CreateDateColumn({ name: "created_at" })
    createdAt: Date;

    @UpdateDateColumn({ name: "updated_at" })
    updatedAt: Date;
}