export class FormManager {
    private formElement: HTMLFormElement;

    constructor(formSelector: string) {
        this.formElement = document.querySelector(formSelector) as HTMLFormElement;
        if (!this.formElement) {
            throw new Error('Форма не найдена');
        }
    }

    // Получение данных из формы
    getFormData(): Record<string, any> {
        const formData = new FormData(this.formElement);
        const data: Record<string, any> = {};
        formData.forEach((value, key) => {
            data[key] = value;
        });
        return data;
    }

    // Валидация формы
    validateForm(): boolean {
        const inputs = this.formElement.querySelectorAll('input[required]');
        return Array.from(inputs).every(input => (input as HTMLInputElement).value.trim() !== '');
    }

    // Очистка формы
    clearForm(): void {
        this.formElement.reset();
    }

    // Навешивание обработчиков валидации
    setupValidation(submitButtonSelector: string): void {
        const inputs = this.formElement.querySelectorAll('input[required]');
        const submitButton = document.querySelector(submitButtonSelector) as HTMLButtonElement;

        const validateForm = () => {
            submitButton.disabled = !this.validateForm();
        };

        inputs.forEach(input => input.addEventListener('input', validateForm));
        validateForm(); // Инициализация состояния кнопки
    }
}