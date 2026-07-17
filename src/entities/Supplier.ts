import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
} from "typeorm";

@Entity("suppliers")
export class Supplier {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ length: 150 })
    name: string;

    @Column({ length: 100, nullable: true })
    contactName: string;

    @Column({ length: 100, nullable: true })
    email: string;

    @Column({ length: 50, nullable: true })
    phone: string;

    @Column({ type: "text", nullable: true })
    address: string;

    @Column({ type: "text", nullable: true })
    notes: string;

    @Column({ default: true })
    isActive: boolean;

    @CreateDateColumn({ name: "created_at" })
    createdAt: Date;

    @UpdateDateColumn({ name: "updated_at" })
    updatedAt: Date;
}