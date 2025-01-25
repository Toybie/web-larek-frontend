import { IProduct } from '/Users/btaub/Desktop/Yandex.Practikum/dev/web-larek-frontend/src/types';
import { API_URL } from '/Users/btaub/Desktop/Yandex.Practikum/dev/web-larek-frontend/src/utils/constants';
import { Basket } from './Basket';
import { Modal } from './Modal'; // Импортируем Modal

export class OrderForm {
    private modalContent: HTMLElement;
    private selectedPaymentMethod: string | null = null;
    private basket: Basket;
    private modal: Modal; // Добавляем поле для Modal

    constructor(modalContentSelector: string, basket: Basket, modal: Modal) { // Добавляем modal в конструктор
        this.modalContent = document.querySelector(modalContentSelector) as HTMLElement;
        this.basket = basket;
        this.modal = modal; // Инициализируем modal
    }

    // Метод для отображения первой формы (способ оплаты и адрес)
    renderForm(): void {
        const totalPrice = this.calculateTotalPrice();
        const savedData = this.loadFormData();

        this.modalContent.innerHTML = `
            <form class="form" id="order-form">
                <div class="order">
                    <div class="order__field">
                        <h2 class="modal__title">Способ оплаты</h2>
                        <div class="order__buttons">
                            <button type="button" name="card" class="button button_alt">Онлайн</button>
                            <button type="button" name="cash" class="button button_alt">При получении</button>
                        </div>
                    </div>
                    <label class="order__field">
                        <span class="form__label modal__title">Адрес доставки</span>
                        <input name="address" class="form__input" type="text" placeholder="Введите адрес" value="${savedData?.address || ''}" required />
                    </label>
                </div>
                <div class="modal__actions">
                    <button type="submit" class="button">Далее</button>
                </div>
            </form>
        `;

        this.setupPaymentButtons();
        this.setupFormSubmit();
    }

    // Метод для отображения второй формы (email и телефон)
    renderContactForm(): void {
        const savedData = this.loadFormData();

        this.modalContent.innerHTML = `
            <form class="form" id="contact-form">
                <div class="order">
                    <label class="order__field">
                        <span class="form__label modal__title">Email</span>
                        <input name="email" class="form__input" type="email" placeholder="Введите Email" value="${savedData?.email || ''}" required />
                    </label>
                    <label class="order__field">
                        <span class="form__label modal__title">Телефон</span>
                        <input name="phone" class="form__input" type="tel" placeholder="+7 (" value="${savedData?.phone || ''}" required />
                    </label>
                </div>
                <div class="modal__actions">
                    <button type="submit" class="button">Оплатить</button>
                </div>
            </form>
        `;

        this.setupContactFormSubmit();
    }

    // Метод для отображения сообщения об успешной оплате
    renderSuccessMessage(totalPrice: number): void {
        this.modalContent.innerHTML = `
            <div class="order-success">
                <h2 class="order-success__title">Заказ оформлен</h2>
                <p class="order-success__description">Списано ${totalPrice} синапсов</p>
                <button class="button order-success__close">За новыми покупками!</button>
            </div>
        `;

        this.setupSuccessCloseButton();
    }

    // Настройка кнопок выбора способа оплаты
    private setupPaymentButtons(): void {
        const paymentButtons = this.modalContent.querySelectorAll('.order__buttons .button') as NodeListOf<HTMLButtonElement>;
        paymentButtons.forEach((button) => {
            button.addEventListener('click', () => {
                paymentButtons.forEach((btn) => {
                    btn.classList.remove('button_active');
                    btn.style.border = 'none';
                });
                button.classList.add('button_active');
                button.style.border = '2px solid white';
                this.selectedPaymentMethod = button.getAttribute('name') === 'card' ? 'online' : 'cash';
            });
        });
    }

    // Настройка отправки первой формы
    private setupFormSubmit(): void {
        const form = this.modalContent.querySelector('#order-form') as HTMLFormElement;
        if (form) {
            form.addEventListener('submit', (event) => {
                event.preventDefault();
                this.handleFormSubmit(form);
            });
        }
    }

    // Обработка отправки первой формы
    private handleFormSubmit(form: HTMLFormElement): void {
        const formData = new FormData(form);
        const address = formData.get('address') as string;

        if (!this.selectedPaymentMethod || !address) {
            alert('Пожалуйста, выберите способ оплаты и укажите адрес доставки.');
            return;
        }

        this.saveFormData({
            paymentMethod: this.selectedPaymentMethod,
            address,
        });

        this.renderContactForm();
    }

    // Настройка отправки второй формы
    private setupContactFormSubmit(): void {
        const form = this.modalContent.querySelector('#contact-form') as HTMLFormElement;
        if (form) {
            form.addEventListener('submit', (event) => {
                event.preventDefault();
                this.handleContactFormSubmit(form);
            });
        }
    }

    // Обработка отправки второй формы
    private handleContactFormSubmit(form: HTMLFormElement): void {
        const formData = new FormData(form);
        const email = formData.get('email') as string;
        const phone = formData.get('phone') as string;

        if (!email || !phone) {
            alert('Пожалуйста, заполните все поля.');
            return;
        }

        this.saveFormData({
            email,
            phone,
        });

        this.submitOrder();
    }

    // Отправка данных заказа на сервер
    private async submitOrder(): Promise<void> {
        const orderData = this.loadFormData();
        const totalPrice = this.calculateTotalPrice();

        const requestData = {
            payment: orderData.paymentMethod,
            email: orderData.email,
            phone: orderData.phone,
            address: orderData.address,
            total: totalPrice,
            items: this.getProductIds(),
        };

        console.log('Отправляемые данные:', requestData);

        try {
            const response = await fetch(`${API_URL}/order`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestData),
            });

            if (!response.ok) {
                const errorResponse = await response.json();
                console.error('Ошибка ответа сервера:', errorResponse);

                if (errorResponse.error.includes('не продается')) {
                    const unavailableProductId = errorResponse.error.split(' ')[3];
                    this.basket.removeProduct(unavailableProductId);
                    alert('Некоторые товары недоступны для покупки. Они были удалены из корзины.');
                    return;
                }

                throw new Error('Ошибка при отправке заказа');
            }

            const result = await response.json();
            console.log('Заказ успешно отправлен:', result);

            this.renderSuccessMessage(totalPrice);
        } catch (error) {
            console.error('Ошибка:', error);
            alert('Не удалось отправить заказ. Пожалуйста, попробуйте ещё раз.');
        }
    }

    // Расчет общей суммы заказа
    private calculateTotalPrice(): number {
        const products = this.basket.getProductsInBasket();
        return products.reduce((total, product) => total + (product.price || 0), 0);
    }

    // Получение списка ID товаров в корзине
    private getProductIds(): string[] {
        const products = this.basket.getProductsInBasket();
        return products.map((product) => product.id);
    }

    // Настройка кнопки закрытия сообщения об успешной оплате
    private setupSuccessCloseButton(): void {
        const closeButton = this.modalContent.querySelector('.order-success__close') as HTMLButtonElement;
        if (closeButton) {
            closeButton.addEventListener('click', () => {
                localStorage.removeItem('orderFormData'); // Очищаем данные формы
                this.basket.clearBasket(); // Очищаем корзину
                this.modal.close(); // Закрываем модальное окно
            });
        }
    }

    // Сохранение данных формы в localStorage
    private saveFormData(data: Record<string, any>): void {
        const savedData = this.loadFormData();
        localStorage.setItem('orderFormData', JSON.stringify({ ...savedData, ...data }));
    }

    // Загрузка данных формы из localStorage
    private loadFormData(): Record<string, any> {
        const savedData = localStorage.getItem('orderFormData');
        return savedData ? JSON.parse(savedData) : {};
    }
}