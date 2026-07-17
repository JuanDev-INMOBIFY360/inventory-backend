import { Request, Response, NextFunction } from "express";
import { ClientService } from "../services/client.service";
import { ClientMapper } from "../mappers/client.mapper";
import {
    CreateClientDto,
    UpdateClientDto,
    ClientIdParamsDto,
} from "../dtos/client.dto";

export class ClientController {
    private clientService: ClientService;

    constructor() {
        this.clientService = new ClientService();
    }

    create = async (
        req: Request<{}, {}, CreateClientDto>,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        try {
            const client = await this.clientService.createClient(req.body);
            const response = ClientMapper.toResponse(client);
            res.status(201).json(response);
        } catch (error) {
            next(error);
        }
    };

    getAll = async (
        _req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        try {
            const clients = await this.clientService.getAllClients();
            const response = ClientMapper.toResponseList(clients);
            res.json(response);
        } catch (error) {
            next(error);
        }
    };

    search = async (
        req: Request<{}, {}, {}, { name: string }>,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        try {
            const { name } = req.query;
            if (!name) {
                res.status(400).json({ error: "El parámetro 'name' es requerido" });
                return;
            }
            const clients = await this.clientService.searchClientsByName(name);
            const response = ClientMapper.toResponseList(clients);
            res.json(response);
        } catch (error) {
            next(error);
        }
    };

    getById = async (
        req: Request<ClientIdParamsDto>,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        try {
            const { id } = req.params;
            const client = await this.clientService.getClientById(id);
            const response = ClientMapper.toResponse(client);
            res.json(response);
        } catch (error) {
            next(error);
        }
    };

  
    update = async (
        req: Request<ClientIdParamsDto, {}, UpdateClientDto>,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        try {
            const { id } = req.params;
            const client = await this.clientService.updateClient(id, req.body);
            const response = ClientMapper.toResponse(client);
            res.json(response);
        } catch (error) {
            next(error);
        }
    };

    toggleStatus = async (
        req: Request<ClientIdParamsDto>,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        try {
            const { id } = req.params;
            const client = await this.clientService.toggleClientStatus(id);
            const response = ClientMapper.toResponse(client);
            res.json(response);
        } catch (error) {
            next(error);
        }
    };

    delete = async (
        req: Request<ClientIdParamsDto>,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        try {
            const { id } = req.params;
            await this.clientService.deleteClient(id);
            res.status(204).send();
        } catch (error) {
            next(error);
        }
    };
}