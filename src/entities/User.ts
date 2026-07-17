import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    OneToMany,
} from "typeorm";
import { Movement } from "./Movement";

export enum UserRole {
    ADMIN = "admin",
    SELLER = "seller",
}

@Entity("users")
export class User {

    @PrimaryGeneratedColumn("uuid")
    id:string;

    @Column({length:100})
    name:string;

    @Column({length: 100,unique: true})
    email:string;

    @Column({length:100, unique:true})
    username:string;

    @Column({length:255})
    password:string;

    @Column({type: "enum", enum:UserRole, default:UserRole.SELLER})
    role:UserRole;

    @Column({ default: true })
    isActive: boolean;

    @OneToMany(() => Movement, (movement) => movement.user)
    movements: Movement[];

    @CreateDateColumn({ name: "created_at" })
    createdAt: Date;

    @UpdateDateColumn({ name: "updated_at" })
    updatedAt: Date;
}