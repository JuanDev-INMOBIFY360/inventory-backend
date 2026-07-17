import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    ManyToOne,
    JoinColumn,
} from "typeorm";
import { ProductUnit } from "./ProductUnit";
import { User } from "./User";


@Entity("movements")
export class Movement {

    @PrimaryGeneratedColumn("uuid")
    id:string;

      @Column({ length: 20 })
    type: string; // "ENTRY", "SALE", "RETURN", "ADJUST"

    @Column({ type: "text", nullable: true })
    reason: string;

    @ManyToOne(() => ProductUnit)
    @JoinColumn({ name: "unitId" })
    unit: ProductUnit;

    @Column()
    unitId: string;

    @ManyToOne(() => User)
    @JoinColumn({ name: "userId" })
    user: User;

    @Column()
    userId: string;

    @CreateDateColumn({ name: "created_at" })
    createdAt: Date;
}