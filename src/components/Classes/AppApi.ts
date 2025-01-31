import { API_URL } from '../../utils/constants';

export class AppApi {
    async submitOrder(orderData: Record<string, any>): Promise<any> {
        try {
            const response = await fetch(`${API_URL}/order`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(orderData),
            });

            if (!response.ok) {
                const errorResponse = await response.json();
                throw new Error(errorResponse.error || 'Ошибка при отправке заказа');
            }

            return await response.json();
        } catch (error) {
            console.error('Ошибка:', error);
            throw error;
        }
    }
}