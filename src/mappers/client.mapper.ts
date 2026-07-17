import { Client } from "../entities/Client";

export class ClientResponseDto {
    id: string;
    name: string;
    phone?: string;
    email?: string;
    address?: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;

    constructor(client: Client) {
        this.id = client.id;
        this.name = client.name;
        this.phone = client.phone;
        this.email = client.email;
        this.address = client.address;
        this.isActive = client.isActive;
        this.createdAt = client.createdAt;
        this.updatedAt = client.updatedAt;
    }
}

export class ClientMapper {
    static toResponse(client: Client): ClientResponseDto {
        return new ClientResponseDto(client);
    }

    static toResponseList(clients: Client[]): ClientResponseDto[] {
        return clients.map(c => this.toResponse(c));
    }
}