import { Request, Response, NextFunction } from "express";
import { DashboardService } from "../services/dashboard.service";

export class DashboardController {
    private dashboardService: DashboardService;

    constructor() {
        this.dashboardService = new DashboardService();
    }

    // 1. KPI's principales
    getStats = async (
        _req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        try {
            const stats = await this.dashboardService.getStats();
            res.json(stats);
        } catch (error) {
            next(error);
        }
    };

    // 2. Top 5 productos más vendidos
    getTopSelling = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        try {
            const limit = parseInt(req.query.limit as string) || 5;
            const products = await this.dashboardService.getTopSellingProducts(limit);
            res.json(products);
        } catch (error) {
            next(error);
        }
    };

    // 3. Movimientos recientes
    getRecentMovements = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        try {
            const limit = parseInt(req.query.limit as string) || 10;
            const movements = await this.dashboardService.getRecentMovements(limit);
            res.json(movements);
        } catch (error) {
            next(error);
        }
    };
}