export class Forms {
    setupOrderForm(form: HTMLFormElement, onSubmit: () => void): void {
        const addressInput = form.querySelector('.form__input') as HTMLInputElement;
        const submitButton = form.querySelector('.order__button') as HTMLButtonElement;
        const paymentButtons = form.querySelectorAll('.order__buttons .button') as NodeListOf<HTMLButtonElement>;

        let selectedPaymentMethod: string | null = null;

        paymentButtons.forEach((button) => {
            button.addEventListener('click', () => {
                paymentButtons.forEach((btn) => btn.classList.remove('button_active'));
                button.classList.add('button_active');
                selectedPaymentMethod = button.name;
                this.validateForm(addressInput, selectedPaymentMethod, submitButton);
            });
        });

        addressInput.addEventListener('input', () => {
            this.validateForm(addressInput, selectedPaymentMethod, submitButton);
        });

        form.addEventListener('submit', (event) => {
            event.preventDefault();
            onSubmit();
        });
    }

    private validateForm(
        addressInput: HTMLInputElement,
        selectedPaymentMethod: string | null,
        submitButton: HTMLButtonElement
    ): void {
        const isAddressValid = addressInput.value.trim().length > 0;
        const isPaymentSelected = selectedPaymentMethod !== null;
        submitButton.disabled = !(isAddressValid && isPaymentSelected);
    }
}
