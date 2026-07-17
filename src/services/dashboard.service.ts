import { ProductUnitRepository } from "../repositories/product-unit.repository";
import { ClientRepository } from "../repositories/client.repository";
import { ProductRepository } from "../repositories/product.repository";
import { MovementRepository } from "../repositories/movement.repository";

export class DashboardService {
    private unitRepo: ProductUnitRepository;
    private clientRepo: ClientRepository;
    private productRepo: ProductRepository;
    private movementRepo: MovementRepository;

    constructor() {
        this.unitRepo = new ProductUnitRepository();
        this.clientRepo = new ClientRepository();
        this.productRepo = new ProductRepository();
        this.movementRepo = new MovementRepository();
    }

    // ============================================
    // 1. KPI's PRINCIPALES
    // ============================================
    async getStats(): Promise<any> {
        const [allUnits, soldUnits, clients, products] = await Promise.all([
            this.unitRepo.findAll(),
            this.unitRepo.findSold(),
            this.clientRepo.findAll(),
            this.productRepo.findAll(),
        ]);

        const availableUnits = allUnits.filter(u => !u.isSold);

        // Calcular ganancias
        const totalRevenue = soldUnits.reduce(
            (sum, u) => sum + (Number(u.salePrice) || 0),
            0
        );
        const totalCost = soldUnits.reduce(
            (sum, u) => sum + (Number(u.purchasePrice) || 0),
            0
        );
        const totalProfit = totalRevenue - totalCost;
        const profitMargin = totalRevenue > 0 ? (totalProfit / totalRevenue) * 100 : 0;

        return {
            // KPI's principales
            totalRevenue: Math.round(totalRevenue),
            totalCost: Math.round(totalCost),
            totalProfit: Math.round(totalProfit),
            profitMargin: Math.round(profitMargin * 100) / 100,
            totalUnitsSold: soldUnits.length,
            totalClients: clients.length,
            totalProducts: products.length,
            availableUnits: availableUnits.length,
        };
    }

    // ============================================
    // 2. TOP 5 PRODUCTOS MÁS VENDIDOS
    // ============================================
    async getTopSellingProducts(limit: number = 5): Promise<any[]> {
        const soldUnits = await this.unitRepo.findSold();

        // Agrupar por producto
        const productSales = new Map();

        for (const unit of soldUnits) {
            const productId = unit.product?.id;
            if (!productId) continue;

            if (!productSales.has(productId)) {
                productSales.set(productId, {
                    productId,
                    productName: unit.product.name,
                    brand: unit.product.brand,
                    unitsSold: 0,
                    totalRevenue: 0,
                    totalCost: 0,
                });
            }

            const stats = productSales.get(productId);
            stats.unitsSold += 1;
            stats.totalRevenue += Number(unit.salePrice || 0);
            stats.totalCost += Number(unit.purchasePrice || 0);
        }

        // Calcular ganancia y ordenar por unidades vendidas
        const result = Array.from(productSales.values())
            .map(item => ({
                ...item,
                profit: item.totalRevenue - item.totalCost,
                profitMargin: item.totalRevenue > 0 
                    ? Math.round(((item.totalRevenue - item.totalCost) / item.totalRevenue) * 100 * 100) / 100
                    : 0,
            }))
            .sort((a, b) => b.unitsSold - a.unitsSold)
            .slice(0, limit);

        return result;
    }

    // ============================================
    // 3. MOVIMIENTOS RECIENTES (Últimos 10)
    // ============================================
    async getRecentMovements(limit: number = 10): Promise<any[]> {
        const movements = await this.movementRepo.findAll();
        
        // Transformar para que sea más legible
        return movements.slice(0, limit).map(m => ({
            id: m.id,
            type: this.getMovementTypeLabel(m.type),
            typeIcon: this.getMovementTypeIcon(m.type),
            product: m.unit?.product?.name || 'Producto eliminado',
            brand: m.unit?.product?.brand || '',
            serial: m.unit?.serial || '',
            client: m.unit?.client?.name || null,
            user: m.user?.name || 'Usuario eliminado',
            amount: m.unit?.salePrice || m.unit?.purchasePrice || null,
            reason: m.reason || null,
            createdAt: m.createdAt,
        }));
    }

    // ============================================
    // 4. UTILIDADES
    // ============================================
    private getMovementTypeLabel(type: string): string {
        const labels: Record<string, string> = {
            'ENTRY': 'ENTRADA',
            'SALE': 'VENTA',
            'RETURN': 'DEVOLUCIÓN',
            'ADJUST': 'AJUSTE',
        };
        return labels[type] || type;
    }

    private getMovementTypeIcon(type: string): string {
        const icons: Record<string, string> = {
            'ENTRY': '',
            'SALE': '',
            'RETURN': '',
            'ADJUST': '',
        };
        return icons[type] || '';
    }
}