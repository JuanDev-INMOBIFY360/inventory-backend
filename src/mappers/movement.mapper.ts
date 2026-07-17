import { Movement } from "../entities/Movement";

export class MovementResponseDto {
    id: string;
    type: string;
    reason?: string;
    unit: {
        id: string;
        serial: string;
        product: {
            id: string;
            name: string;
            brand: string;
        };
    };
    user: {
        id: string;
        name: string;
        email: string;
    };
    createdAt: Date;

    constructor(movement: Movement) {
        this.id = movement.id;
        this.type = movement.type;
        this.reason = movement.reason;
        this.unit = {
            id: movement.unit?.id || "",
            serial: movement.unit?.serial || "",
            product: {
                id: movement.unit?.product?.id || "",
                name: movement.unit?.product?.name || "",
                brand: movement.unit?.product?.brand || "",
            },
        };
        this.user = {
            id: movement.user?.id || "",
            name: movement.user?.name || "",
            email: movement.user?.email || "",
        };
        this.createdAt = movement.createdAt;
    }
}

export class MovementMapper {
    static toResponse(movement: Movement): MovementResponseDto {
        return new MovementResponseDto(movement);
    }

    static toResponseList(movements: Movement[]): MovementResponseDto[] {
        return movements.map(m => this.toResponse(m));
    }
}