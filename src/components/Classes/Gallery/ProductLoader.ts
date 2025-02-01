import { ProductService } from '../ProductService';
import { IProduct } from '../../../types';

export class ProductLoader {
    private productService: ProductService;

    constructor() {
        this.productService = new ProductService();
    }

    async loadProducts(): Promise<IProduct[]> {
        try {
            return await this.productService.fetchProducts();
        } catch (error) {
            console.error('Ошибка при загрузке данных:', error);
            throw new Error('Не удалось загрузить данные о продуктах.');
        }
    }
}