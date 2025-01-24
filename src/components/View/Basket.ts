import { IProduct } from '/Users/btaub/Desktop/Yandex.Practikum/dev/web-larek-frontend/src/types';
import { BasketModal } from './basketModal';
import { saveBasketToLocalStorage, loadBasketFromLocalStorage } from './localStorage';

export class Basket {
    private products: IProduct[] = [];
    private basketButton: HTMLElement;
    private basketCounter: HTMLElement;
    private basketModal: BasketModal;

    constructor(basketButton: HTMLElement, basketCounter: HTMLElement, basketModal: BasketModal) {
        // Проверяем, что элементы существуют
        if (!basketButton || !basketCounter) {
            throw new Error('Элементы корзины не найдены в DOM.');
        }

        this.basketButton = basketButton;
        this.basketCounter = basketCounter;
        this.basketModal = basketModal;

        // Загружаем корзину из localStorage при инициализации
        this.products = loadBasketFromLocalStorage();
        this.updateCounter();
        this.updateProductButtons();

        // Добавляем обработчик для кнопки корзины
        this.basketButton.addEventListener('click', () => {
            this.basketModal.openBasketModal(this.products, this.updateBasket.bind(this));
        });
    }

    // Добавление товара в корзину
    addProduct(product: IProduct): void {
        if (!this.isProductInBasket(product.id)) {
            this.products.push(product);
            this.updateCounter();
            this.updateProductButtons(product.id);
            saveBasketToLocalStorage(this.products);
        }
    }

    // Получение списка товаров
    getProducts(): IProduct[] {
        return this.products;
    }

    // Проверка, есть ли продукт в корзине
    isProductInBasket(productId: string): boolean {
        return this.products.some((item) => item.id === productId);
    }

    // Удаление товара из корзины
    removeProduct(productId: string): void {
        this.products = this.products.filter((item) => item.id !== productId);
        this.updateCounter();
        this.updateProductButtons(productId);
        saveBasketToLocalStorage(this.products);
    }

    // Обновление отображения корзины
    updateBasket(): void {
        const basketList = document.querySelector('.basket__list') as HTMLElement;
        if (!basketList) {
            console.error('Элемент .basket__list не найден.');
            return;
        }

        basketList.innerHTML = '';

        const basketTemplate = document.getElementById('card-basket') as HTMLTemplateElement;
        if (!basketTemplate) {
            console.error('Шаблон корзины с ID "card-basket" не найден.');
            return;
        }

        // Отрисовываем товары в корзине
        this.products.forEach((product, index) => {
            const clone = basketTemplate.content.cloneNode(true) as HTMLElement;
            const itemIndex = clone.querySelector('.basket__item-index') as HTMLElement;
            const itemTitle = clone.querySelector('.card__title') as HTMLElement;
            const itemPrice = clone.querySelector('.card__price') as HTMLElement;
            const deleteButton = clone.querySelector('.basket__item-delete') as HTMLButtonElement;

            // Устанавливаем данные
            itemIndex.textContent = (index + 1).toString();
            itemTitle.textContent = product.title;
            itemPrice.textContent = `${product.price} синапсов`;

            // Обработчик для удаления товара
            deleteButton.addEventListener('click', () => {
                this.removeProduct(product.id);
                this.updateBasket();

                // Возвращаем кнопке "В корзину" активное состояние
                const productButton = document.querySelector(`.card__button[data-id="${product.id}"]`) as HTMLButtonElement;
                if (productButton) {
                    productButton.disabled = false;
                    productButton.textContent = 'В корзину';
                }
            });

            basketList.appendChild(clone);
        });

        // Обновляем общую сумму
        this.updateTotalPrice();
    }

    // Обновление счетчика корзины
    private updateCounter(): void {
        if (this.basketCounter) {
            this.basketCounter.textContent = this.products.length.toString();
        } else {
            console.error('Элемент счетчика корзины не найден.');
        }
    }

    // Обновление состояния кнопок на странице
    private updateProductButtons(productId?: string): void {
        if (productId) {
            // Обновляем конкретную кнопку
            const productButton = document.querySelector(`.button[data-id="${productId}"]`) as HTMLButtonElement;
            if (productButton) {
                productButton.disabled = this.isProductInBasket(productId);
                productButton.textContent = this.isProductInBasket(productId) ? 'Добавлено' : 'В корзину';
            }
        } else {
            // Обновляем все кнопки
            const productButtons = document.querySelectorAll('.button[data-id]') as NodeListOf<HTMLButtonElement>;
            productButtons.forEach((button) => {
                const id = button.dataset.id;
                if (id) {
                    button.disabled = this.isProductInBasket(id);
                    button.textContent = this.isProductInBasket(id) ? 'Добавлено' : 'В корзину';
                }
            });
        }
    }

    // Расчет общей суммы товаров в корзине
    private calculateTotalPrice(): number {
        return this.products.reduce((total, product) => total + (product.price || 0), 0);
    }

    // Обновление отображения общей суммы
    private updateTotalPrice(): void {
        const totalPriceElement = document.querySelector('.basket__price') as HTMLElement;
        if (totalPriceElement) {
            const totalPrice = this.calculateTotalPrice();
            totalPriceElement.textContent = `${totalPrice} синапсов`;
        } else {
            console.error('Элемент общей суммы не найден.');
        }
    }
}