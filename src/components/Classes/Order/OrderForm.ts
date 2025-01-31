import { AppApi } from '../AppApi';
import { Basket } from '../Basket/Basket';
import { Modal } from '../Modal';

export class OrderForm {
    private modalContent: HTMLElement;
    private basket: Basket;
    private modal: Modal;
    private appApi: AppApi;

    constructor(modalContentSelector: string, basket: Basket, modal: Modal) {
        this.modalContent = document.querySelector(modalContentSelector) as HTMLElement;
        this.basket = basket;
        this.modal = modal;
        this.appApi = new AppApi();
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
        this.setupPaymentButtons();
        this.setupFormValidation('#order-form', '#next-button');
        this.setupFormSubmit('#order-form', this.handleFormSubmit.bind(this));
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
        this.setupFormValidation('#contact-form', '#submit-button');
        this.setupFormSubmit('#contact-form', this.handleContactFormSubmit.bind(this));
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
        let selectedPaymentMethod: string | null = null;

        paymentButtons.forEach(button => {
            button.addEventListener('click', () => {
                paymentButtons.forEach(btn => btn.classList.remove('button_active'));
                button.classList.add('button_active');
                selectedPaymentMethod = button.getAttribute('name') === 'card' ? 'online' : 'cash';
                this.updateNextButtonState(selectedPaymentMethod);
            });
        });
    }

    private updateNextButtonState(paymentMethod: string | null): void {
        const addressInput = this.modalContent.querySelector('input[name="address"]') as HTMLInputElement;
        const nextButton = this.modalContent.querySelector('#next-button') as HTMLButtonElement;
        if (addressInput && nextButton) {
            nextButton.disabled = !(addressInput.value.trim() !== '' && paymentMethod !== null);
        }
    }

    private setupFormValidation(formSelector: string, submitButtonSelector: string): void {
        const form = this.modalContent.querySelector(formSelector) as HTMLFormElement;
        const inputs = form?.querySelectorAll('input[required]');
        const submitButton = form?.querySelector(submitButtonSelector) as HTMLButtonElement;

        if (inputs && submitButton) {
            const validateForm = () => {
                submitButton.disabled = !Array.from(inputs).every(input => (input as HTMLInputElement).value.trim() !== '');
            };
            inputs.forEach(input => input.addEventListener('input', validateForm));
            validateForm();
        }
    }

    private setupFormSubmit(formSelector: string, handler: (formData: Record<string, any>) => void): void {
        const form = this.modalContent.querySelector(formSelector) as HTMLFormElement;
        form?.addEventListener('submit', event => {
            event.preventDefault();
            const formData = new FormData(form);
            const data: Record<string, any> = {};
            formData.forEach((value, key) => {
                data[key] = value;
            });
            handler(data);
        });
    }

    private handleFormSubmit(formData: Record<string, any>): void {
        const paymentMethod = this.modalContent.querySelector('.button_active')?.getAttribute('name');
        if (!paymentMethod || !formData.address) {
            alert('Пожалуйста, выберите способ оплаты и укажите адрес доставки.');
            return;
        }

        this.saveFormData({ paymentMethod, ...formData });
        this.renderContactForm();
    }

    private async handleContactFormSubmit(formData: Record<string, any>): Promise<void> {
        const savedData = this.loadFormData();
        const totalPrice = this.calculateTotalPrice();
        const requestData = {
            payment: savedData.paymentMethod,
            email: formData.email,
            phone: formData.phone,
            address: savedData.address,
            total: totalPrice,
            items: this.getProductIds(),
        };
    
        try {
            await this.appApi.submitOrder(requestData);
    
            this.basket.clearBasket();
            this.resetCardStates();
            this.renderSuccessMessage(totalPrice);
        } catch (error) {
            alert('Не удалось отправить заказ. Пожалуйста, попробуйте ещё раз.');
        }
    }
    
    private resetCardStates(): void {
        const cards = document.querySelectorAll('.gallery__item.card');
        cards.forEach((card) => {
            const button = card.querySelector('.card__button') as HTMLButtonElement;
            if (button) {
                button.textContent = 'Добавить в корзину';
            }
        });
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
            this.modal.close();
        });
    }

    private saveFormData(data: Record<string, any>): void {
        localStorage.setItem('orderFormData', JSON.stringify({ ...this.loadFormData(), ...data }));
    }

    private loadFormData(): Record<string, any> {
        return JSON.parse(localStorage.getItem('orderFormData') || '{}');
    }
}