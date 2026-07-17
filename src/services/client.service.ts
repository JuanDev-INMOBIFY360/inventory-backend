import { ClientRepository } from "../repositories/client.repository";
import { Client } from "../entities/Client";
import { CreateClientDto, UpdateClientDto } from "../dtos/client.dto";

export class ClientService {
    private clientRepo: ClientRepository;

    constructor() {
        this.clientRepo = new ClientRepository();
    }

    async createClient(createDto: CreateClientDto): Promise<Client> {
        
        if (createDto.email) {
            const exists = await this.clientRepo.existsByEmail(createDto.email);
            if (exists) {
                throw new Error(`Ya existe un cliente con el email "${createDto.email}"`);
            }
        }

        return this.clientRepo.create(createDto);
    }

    async getAllClients(): Promise<Client[]> {
        return this.clientRepo.findAll();
    }

    async searchClientsByName(name: string): Promise<Client[]> {
        return this.clientRepo.findByName(name);
    }

    async getClientById(id: string): Promise<Client> {
        return this.clientRepo.findByIdOrFail(id);
    }

    async updateClient(id: string, updateDto: UpdateClientDto): Promise<Client> {
        const client = await this.clientRepo.findByIdOrFail(id);

        if (updateDto.email && updateDto.email !== client.email) {
            const exists = await this.clientRepo.existsByEmail(updateDto.email, id);
            if (exists) {
                throw new Error(`Ya existe un cliente con el email "${updateDto.email}"`);
            }
        }

        return this.clientRepo.update(id, updateDto);
    }

    async deleteClient(id: string): Promise<void> {
        await this.clientRepo.delete(id);
    }

    async toggleClientStatus(id: string): Promise<Client> {
        return this.clientRepo.toggleStatus(id);
    }
}