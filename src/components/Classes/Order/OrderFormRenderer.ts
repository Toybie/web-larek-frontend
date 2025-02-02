export class OrderFormRenderer {
    private modalContent: HTMLElement;

    constructor(modalContentSelector: string) {
        this.modalContent = document.querySelector(modalContentSelector) as HTMLElement;
    }

    renderPaymentForm(savedData: Record<string, any>): void {
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
    }

    renderContactForm(savedData: Record<string, any>): void {
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
    }

    renderSuccessMessage(totalPrice: number): void {
        this.modalContent.innerHTML = `
            <div class="order-success">
                <h2 class="order-success__title">Заказ оформлен</h2>
                <p class="order-success__description">Списано ${totalPrice} синапсов</p>
                <button class="button order-success__close">За новыми покупками!</button>
            </div>
        `;
    }
}