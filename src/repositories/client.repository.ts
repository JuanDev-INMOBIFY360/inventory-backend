import { Repository, ILike } from "typeorm";
import { AppDataSource } from "../config/database";
import { Client } from "../entities/Client";

export class ClientRepository {
    private repo: Repository<Client>;

    constructor() {
        this.repo = AppDataSource.getRepository(Client);
    }

    async findAll(): Promise<Client[]> {
        return this.repo.find({
            order: { name: "ASC" },
        });
    }

    async findByName(name: string): Promise<Client[]> {
        return this.repo.find({
            where: { name: ILike(`%${name}%`) },
            order: { name: "ASC" },
        });
    }

    async findById(id: string): Promise<Client | null> {
        return this.repo.findOne({ where: { id } });
    }

    async findByIdOrFail(id: string): Promise<Client> {
        const client = await this.findById(id);
        if (!client) {
            throw new Error(`Cliente con ID ${id} no encontrado`);
        }
        return client;
    }

    async findByEmail(email: string): Promise<Client | null> {
        return this.repo.findOne({ where: { email } });
    }

    async create(data: Partial<Client>): Promise<Client> {
        const client = this.repo.create(data);
        return this.repo.save(client);
    }

    async update(id: string, data: Partial<Client>): Promise<Client> {
        const client = await this.findByIdOrFail(id);
        Object.assign(client, data);
        return this.repo.save(client);
    }

    async delete(id: string): Promise<void> {
        await this.findByIdOrFail(id);
        await this.repo.delete(id);
    }

    async toggleStatus(id: string): Promise<Client> {
        const client = await this.findByIdOrFail(id);
        client.isActive = !client.isActive;
        return this.repo.save(client);
    }

    async existsByEmail(email: string, excludeId?: string): Promise<boolean> {
        const query = this.repo.createQueryBuilder("client")
            .where("client.email = :email", { email });
        
        if (excludeId) {
            query.andWhere("client.id != :excludeId", { excludeId });
        }
        
        const count = await query.getCount();
        return count > 0;
    }
}