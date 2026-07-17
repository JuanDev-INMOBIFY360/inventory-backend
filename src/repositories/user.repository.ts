import { Repository } from "typeorm";
import { AppDataSource } from "../config/database";
import { User } from "../entities/User";

export class UserRepository {

    private repo: Repository<User>;

    constructor() {
        this.repo = AppDataSource.getRepository(User);
    }
    async findAll(): Promise<User[]> {
        return this.repo.find({
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                isActive: true,
                createdAt: true,
            },
        });
    }

    async findById(id: string): Promise<User | null> {
        return this.repo.findOne({
            where: { id },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                isActive: true,
                createdAt: true,
            },
        })
    }
    async findByIdOrFail(id: string): Promise<User> {
        const user = await this.findById(id);
        if (!user) {
            throw new Error(`Usuario con ID ${id} no encontrado`);
        }
        return user;
    }

    async findByEmail (email:string ) : Promise<User | null> {
        return this.repo.findOne({
            where: { email},
        })
    }
        async findByUserName (username:string ) : Promise<User | null> {
        return this.repo.findOne({
            where: { username},
        })
    }
    
    async findByUserNameWithPassword(username: string): Promise<User | null> {
        return this.repo
            .createQueryBuilder("user")
            .addSelect("user.password")
            .where("user.username = :username", { username })
            .getOne();
    } 
    
    async create(data:Partial<User>) : Promise<User> {
        const user = await this.repo.create(data);
        return this.repo.save(user);
    }

    async update(id:string ,data:Partial<User>) :Promise <User>{
        const user = await this.findByIdOrFail(id);
        Object.assign(user,data);
        return this.repo.save(user);

    }

    async delete (id:string) :Promise <void> {
        await this.findByIdOrFail(id);
        await this.repo.delete(id);
    }

    async existsByEmail(email: string, excludeId?: string): Promise<boolean> {
        const query = this.repo.createQueryBuilder("user").where("user.email = :email", { email });
        if (excludeId) query.andWhere("user.id != :excludeId", { excludeId });
        return (await query.getCount()) > 0;
    }

    async existsByUsername(username: string, excludeId?: string): Promise<boolean> {
        const query = this.repo.createQueryBuilder("user").where("user.username = :username", { username });
        if (excludeId) query.andWhere("user.id != :excludeId", { excludeId });
        return (await query.getCount()) > 0;
    } 
}