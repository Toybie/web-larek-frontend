import { IProduct } from '/Users/btaub/Desktop/Yandex.Practikum/dev/web-larek-frontend/src/types';
import { API_URL } from '/Users/btaub/Desktop/Yandex.Practikum/dev/web-larek-frontend/src/utils/constants';
import { Basket } from './Basket';
import { Modal } from './Modal';

export class OrderForm {
    private modalContent: HTMLElement;
    private selectedPaymentMethod: string | null = null;
    private basket: Basket;
    private modal: Modal;

    constructor(modalContentSelector: string, basket: Basket, modal: Modal) {
        this.modalContent = document.querySelector(modalContentSelector) as HTMLElement;
        this.basket = basket;
        this.modal = modal;
    }

    renderForm(): void {
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
                    <button type="submit" class="button" id="next-button" disabled>Далее</button>
                </div>
            </form>
        `;
        this.setupForm('#order-form', this.handleFormSubmit.bind(this));
        this.setupPaymentButtons();
    }

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
                    <button type="submit" class="button" id="submit-button" disabled>Оплатить</button>
                </div>
            </form>
        `;
        this.setupForm('#contact-form', this.handleContactFormSubmit.bind(this));
    }

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

    private setupPaymentButtons(): void {
        const paymentButtons = this.modalContent.querySelectorAll('.order__buttons .button');
        paymentButtons.forEach(button => button.addEventListener('click', () => {
            paymentButtons.forEach(btn => btn.classList.remove('button_active'));
            button.classList.add('button_active');
            this.selectedPaymentMethod = button.getAttribute('name') === 'card' ? 'online' : 'cash';
            this.updateNextButtonState();
        }));
    }

    private setupForm(formSelector: string, handler: (form: HTMLFormElement) => void): void {
        const form = this.modalContent.querySelector(formSelector) as HTMLFormElement;
        form?.addEventListener('submit', event => {
            event.preventDefault();
            handler(form);
        });
        this.setupFormValidation(formSelector);
    }

    private handleFormSubmit(form: HTMLFormElement): void {
        const formData = new FormData(form);
        const address = formData.get('address') as string;
        if (!this.selectedPaymentMethod || !address) {
            alert('Пожалуйста, выберите способ оплаты и укажите адрес доставки.');
            return;
        }
        this.saveFormData({ paymentMethod: this.selectedPaymentMethod, address });
        this.renderContactForm();
    }

    private handleContactFormSubmit(form: HTMLFormElement): void {
        const formData = new FormData(form);
        const email = formData.get('email') as string;
        const phone = formData.get('phone') as string;
        if (!email || !phone) {
            alert('Пожалуйста, заполните все поля.');
            return;
        }
        this.saveFormData({ email, phone });
        this.submitOrder();
    }

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

        try {
            const response = await fetch(`${API_URL}/order`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(requestData),
            });

            if (!response.ok) {
                const errorResponse = await response.json();
                if (errorResponse.error.includes('не продается')) {
                    const unavailableProductId = errorResponse.error.split(' ')[3];
                    this.basket.removeProduct(unavailableProductId);
                    alert('Некоторые товары недоступны для покупки. Они были удалены из корзины.');
                    return;
                }
                throw new Error('Ошибка при отправке заказа');
            }

            const result = await response.json();
            this.renderSuccessMessage(totalPrice);
        } catch (error) {
            console.error('Ошибка:', error);
            alert('Не удалось отправить заказ. Пожалуйста, попробуйте ещё раз.');
        }
    }

    private calculateTotalPrice(): number {
        return this.basket.getProductsInBasket().reduce((total, product) => total + (product.price || 0), 0);
    }

    private getProductIds(): string[] {
        return this.basket.getProductsInBasket().map(product => product.id);
    }

    private setupSuccessCloseButton(): void {
        const closeButton = this.modalContent.querySelector('.order-success__close') as HTMLButtonElement;
        closeButton?.addEventListener('click', () => {
            localStorage.removeItem('orderFormData');
            this.basket.clearBasket();
            this.modal.close();
        });
    }

    private saveFormData(data: Record<string, any>): void {
        localStorage.setItem('orderFormData', JSON.stringify({ ...this.loadFormData(), ...data }));
    }

    private loadFormData(): Record<string, any> {
        return JSON.parse(localStorage.getItem('orderFormData') || '{}');
    }

    private setupFormValidation(formSelector: string): void {
        const form = this.modalContent.querySelector(formSelector) as HTMLFormElement;
        const inputs = form?.querySelectorAll('input[required]');
        const submitButton = form?.querySelector('button[type="submit"]') as HTMLButtonElement;

        if (inputs && submitButton) {
            const validateForm = () => {
                submitButton.disabled = !Array.from(inputs).every(input => (input as HTMLInputElement).value.trim() !== '');
            };
            inputs.forEach(input => input.addEventListener('input', validateForm));
        }
    }

    private updateNextButtonState(): void {
        const addressInput = this.modalContent.querySelector('input[name="address"]') as HTMLInputElement;
        const nextButton = this.modalContent.querySelector('#next-button') as HTMLButtonElement;
        if (addressInput && nextButton) {
            nextButton.disabled = !(addressInput.value.trim() !== '' && this.selectedPaymentMethod !== null);
        }
    }
}