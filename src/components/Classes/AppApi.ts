import { Api } from '../base/api';
import { API_URL } from '../../utils/constants';

export class AppApi extends Api {
    constructor() {
        super(API_URL);
    }

    async submitOrder(orderData: Record<string, any>): Promise<any> {
        try {
            return await this.post('/order', orderData);
        } catch (error) {
            console.error('Ошибка при отправке заказа:', error);
            throw new Error('Не удалось отправить заказ.');
        }
    }
}