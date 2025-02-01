import { AppApi } from '../AppApi';

export class OrderService {
    private appApi: AppApi;

    constructor() {
        this.appApi = new AppApi();
    }

    async submitOrder(orderData: Record<string, any>): Promise<void> {
        try {
            await this.appApi.submitOrder(orderData);
        } catch (error) {
            console.error('Ошибка при отправке заказа:', error);
            throw error;
        }
    }
}