import { Api } from '../base/api';
import { IProduct } from '../../types';
import { API_URL } from '../../utils/constants';

export class ProductService extends Api {
    constructor() {
        super(API_URL);
    }

    async fetchProducts(): Promise<IProduct[]> {
        try {
            const response = await this.get<IProduct>('/product');
            return response.items;
        } catch (error) {
            console.error('Ошибка при загрузке данных:', error);
            throw new Error('Не удалось загрузить данные о продуктах.');
        }
    }
}