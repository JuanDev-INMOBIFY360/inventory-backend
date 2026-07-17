import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    OneToMany,
} from "typeorm";
import { ProductUnit } from "./ProductUnit";

@Entity("clients")
export class Client  {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({length: 100})
    name:string;

    @Column({length: 50, nullable: true})
    phone: string;

    @Column({length:150, nullable: true})
    email: string;

    @Column({type: "text" , nullable: true})
    address: string;

    @Column({default:true})
    isActive: boolean;

    @OneToMany(() => ProductUnit, (unit) => unit.client)
    purchases: ProductUnit[];

     @CreateDateColumn({ name: "created_at" })
    createdAt: Date;

    @UpdateDateColumn({ name: "updated_at" })
    updatedAt: Date;
}