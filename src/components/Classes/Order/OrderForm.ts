import { Basket } from '../Basket/Basket';
import { Modal } from '../Modal';
import { OrderFormRenderer } from './OrderFormRenderer';
import { FormManager } from './FormManager';
import { OrderService } from './OrderService';

export class OrderForm {
    private renderer: OrderFormRenderer;
    private formManager: FormManager | null = null;
    private orderService: OrderService;
    private basket: Basket;
    private modal: Modal;

    constructor(modalContentSelector: string, basket: Basket, modal: Modal) {
        this.renderer = new OrderFormRenderer(modalContentSelector);
        this.orderService = new OrderService();
        this.basket = basket;
        this.modal = modal;
    }

    renderForm(): void {
        const savedData = this.loadFormData();
        this.renderer.renderPaymentForm(savedData);
        this.formManager = new FormManager('#order-form');
        this.setupFormValidation('#order-form', '#next-button');
        this.setupFormSubmit('#order-form', this.handleFormSubmit.bind(this));
    }

    renderContactForm(): void {
        const savedData = this.loadFormData();
        this.renderer.renderContactForm(savedData);
        this.formManager = new FormManager('#contact-form');
        this.setupFormValidation('#contact-form', '#submit-button');
        this.setupFormSubmit('#contact-form', this.handleContactFormSubmit.bind(this));
    }

    renderSuccessMessage(totalPrice: number): void {
        this.renderer.renderSuccessMessage(totalPrice);
        this.setupSuccessCloseButton();
    }

    private setupFormValidation(formSelector: string, submitButtonSelector: string): void {
        const formManager = new FormManager(formSelector);
        const submitButton = document.querySelector(submitButtonSelector) as HTMLButtonElement;

        if (submitButton) {
            const validateForm = () => {
                // Проверяем, выбран ли способ оплаты
                const paymentMethodSelected = !!document.querySelector('.button_active');

                // Проверяем, заполнены ли все обязательные поля
                const allInputsFilled = formManager.validateForm();

                // Логируем состояние для отладки
                console.log('Выбран способ оплаты:', paymentMethodSelected);
                console.log('Все поля заполнены:', allInputsFilled);

                // Активируем кнопку только если оба условия выполнены
                submitButton.disabled = !(allInputsFilled && paymentMethodSelected);
            };

            // Добавляем обработчики событий для полей формы
            formManager.setupValidation(submitButtonSelector);

            // Добавляем обработчик события для кнопок выбора способа оплаты
            const paymentButtons = document.querySelectorAll('.order__buttons .button');
            paymentButtons.forEach(button => {
                button.addEventListener('click', validateForm);
            });

            // Инициализируем состояние кнопки при загрузке
            validateForm();
        }
    }

    private setupFormSubmit(formSelector: string, handler: (formData: Record<string, any>) => void): void {
        const form = document.querySelector(formSelector) as HTMLFormElement;
        form?.addEventListener('submit', event => {
            event.preventDefault();
            const formData = this.formManager?.getFormData();
            if (formData) {
                handler(formData);
            }
        });
    }

    private handleFormSubmit(formData: Record<string, any>): void {
        const paymentMethod = document.querySelector('.button_active')?.getAttribute('name');
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
            await this.orderService.submitOrder(requestData);
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
        const closeButton = document.querySelector('.order-success__close') as HTMLButtonElement;
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