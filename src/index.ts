// Импорты
import './scss/styles.scss';
import { Api } from './components/base/api';
import { IProduct } from './types/index';
import { Modal } from './components/modal';

// Константы
export const API_URL = `${process.env.API_ORIGIN}/api/weblarek`;
export const CDN_URL = `${process.env.API_ORIGIN}/content/weblarek`;

const api = new Api(API_URL);
const modal = new Modal('.modal');

// Массив товаров в корзине
let basket: IProduct[] = [];

// Список идентификаторов товаров, которые уже добавлены в корзину
const addedProductIds = new Set<string>(JSON.parse(localStorage.getItem('addedProductIds') || '[]'));

// Счетчик товаров на кнопке корзины
const basketCounter = document.querySelector('.header__basket-counter') as HTMLElement;

// Шаблон для товара в корзине
const basketTemplate = document.getElementById('card-basket') as HTMLTemplateElement;

// Функции

// Рендерим карточку товара в модальном окне
const renderProductModalContent = (product: IProduct) => {
    const container = document.createElement('div');
    container.classList.add('card', 'card_full');

    const isPriceValid = product.price !== null;

    container.innerHTML = `
        <img class="card__image" src="${CDN_URL}${product.image}" alt="${product.title}" />
        <div class="card__column">
            <span class="card__category card__category_soft">${product.category}</span>
            <h2 class="card__title">${product.title}</h2>
            <p class="card__text">${product.description || 'Описание товара отсутствует'}</p>
            <div class="card__row">
                <button class="button" data-id="${product.id}" ${!isPriceValid ? 'disabled' : ''}>
                    ${!isPriceValid ? 'Недоступно' : 'В корзину'}
                </button>
                <span class="card__price">${product.price ? `${product.price} синапсов` : 'Бесценно'}</span>
            </div>
        </div>
    `;

    return container;
};

// Загружаем товары и добавляем события на карточки
const loadProducts = async () => {
    try {
        const response = await api.get('/product/');
        const products: IProduct[] = response.items as IProduct[];

        const gallery = document.querySelector('.gallery') as HTMLElement;
        const template = document.getElementById('card-catalog') as HTMLTemplateElement;

        gallery.innerHTML = '';

        products.forEach((product: IProduct) => {
            const clone = template.content.cloneNode(true) as HTMLElement;
            const isPriceValid = product.price !== null;

            // Заполнение карточки
            const categoryElement = clone.querySelector('.card__category');
            const titleElement = clone.querySelector('.card__title');
            const priceElement = clone.querySelector('.card__price');
            const imageContainer = clone.querySelector('.card__image') as HTMLImageElement | null;

            if (categoryElement) categoryElement.textContent = product.category;
            if (titleElement) titleElement.textContent = product.title;
            if (priceElement) priceElement.textContent = `${product.price ? `${product.price} синапсов` : 'Бесценно'}`;
            if (imageContainer) imageContainer.src = `${CDN_URL}${product.image}`;

            // Добавление обработчика на карточку
            const card = clone.querySelector('.card') as HTMLElement;
            if (card) {
                card.addEventListener('click', () => {
                    const content = renderProductModalContent(product);
                    modal.setContent(content);
                    modal.open();

                    const addToBasketButton = content.querySelector('.button') as HTMLButtonElement;
                    if (addToBasketButton && isPriceValid) {
                        addToBasketButton.addEventListener('click', () => addProductToBasket(product));
                        if (addedProductIds.has(product.id)) {
                            addToBasketButton.textContent = 'Добавлено';
                            addToBasketButton.disabled = true;
                        }
                    }
                });
            }

            gallery.appendChild(clone);

            // Инициализация состояния кнопки "В корзину"
            const addToBasketButton = clone.querySelector('.button') as HTMLButtonElement;
            if (addToBasketButton) {
                if (!isPriceValid) {
                    addToBasketButton.textContent = 'Недоступно';
                    addToBasketButton.disabled = true;
                } else if (addedProductIds.has(product.id)) {
                    addToBasketButton.textContent = 'Добавлено';
                    addToBasketButton.disabled = true;
                }
            }
        });
    } catch (error) {
        console.error('Ошибка при загрузке данных:', error);
        const gallery = document.querySelector('.gallery') as HTMLElement;
        gallery.innerHTML = '<p>Не удалось загрузить данные. Пожалуйста, попробуйте позже.</p>';
    }
};

// Добавление товара в корзину
function addProductToBasket(product: IProduct) {
    if (addedProductIds.has(product.id)) return;

    basket.push(product);
    addedProductIds.add(product.id); // Добавляем ID в список
    saveBasketToLocalStorage(); // Сохраняем корзину в localStorage
    updateBasket(); // Обновляем корзину на странице
    updateBasketCounter(); // Обновляем счетчик на кнопке корзины

    updateProductButtonState(product.id); // Обновляем состояние кнопки
}

// Обновление состояния кнопки "В корзину"
function updateProductButtonState(productId: string) {
    const button = document.querySelector(`.button[data-id="${productId}"]`) as HTMLButtonElement;
    if (button) {
        button.textContent = 'Добавлено';
        button.disabled = true;
    }
}

// Обновление корзины на странице
function updateBasket() {
    const basketList = document.querySelector('.basket__list') as HTMLElement;
    const basketButton = document.querySelector('.basket__button') as HTMLButtonElement;

    if (!basketList || !basketButton) return;

    basketList.innerHTML = ''; // Очищаем содержимое корзины перед рендером новых товаров

    let totalPrice = 0;

    basket.forEach((product, index) => {
        const itemClone = basketTemplate.content.cloneNode(true) as HTMLElement;

        const itemIndex = itemClone.querySelector('.basket__item-index') as HTMLElement;
        const itemTitle = itemClone.querySelector('.card__title') as HTMLElement;
        const itemPrice = itemClone.querySelector('.card__price') as HTMLElement;
        const deleteButton = itemClone.querySelector('.basket__item-delete') as HTMLButtonElement;

        itemIndex.textContent = (index + 1).toString();
        itemTitle.textContent = product.title;
        itemPrice.textContent = `${product.price} синапсов`;

        deleteButton.onclick = () => removeFromBasket(product.id);

        basketList.appendChild(itemClone);

        totalPrice += product.price;
    });

    const dynamicTotalPrice = document.querySelector('.basket__price') as HTMLElement;
    if (dynamicTotalPrice) dynamicTotalPrice.textContent = `Итого: ${totalPrice} синапсов`;

    if (basket.length === 0) {
        basketButton.setAttribute('disabled', 'true');
    } else {
        basketButton.removeAttribute('disabled');
    }
}

// Обновление счетчика товаров в корзине
function updateBasketCounter() {
    basketCounter.textContent = basket.length.toString();
}

// Удаление товара из корзины
function removeFromBasket(productId: string) {
    basket = basket.filter((product) => product.id !== productId);
    addedProductIds.delete(productId);
    saveBasketToLocalStorage();
    updateBasket();
    updateBasketCounter();
}

// Событие для открытия модального окна корзины
const basketButton = document.querySelector('.header__basket') as HTMLButtonElement;
basketButton.addEventListener('click', () => {
    modal.open(); // Открываем модальное окно корзины

    const modalContent = document.querySelector('.modal__content') as HTMLElement;
    modalContent.innerHTML = ''; // Очищаем контент модалки корзины

    const basketTemplate = document.getElementById('basket') as HTMLTemplateElement;

    if (basketTemplate) {
        const modalClone = basketTemplate.content.cloneNode(true) as HTMLElement;
        modalContent.appendChild(modalClone);

        updateBasket(); // Обновляем корзину внутри модального окна

        // Обновляем содержимое модалки и находим кнопку "Оформить"
        const checkoutButton = modalContent.querySelector('.basket__button') as HTMLButtonElement;
        if (checkoutButton) {
            checkoutButton.addEventListener('click', setupOrderForm); // Меняем содержимое модального окна на форму заказа
        } else {
            console.warn('Кнопка "Оформить" не найдена!');
        }
    } else {
        console.error('Шаблон корзины не найден!');
    }
});

// Функция для обработки шаблона заказа
function setupOrderForm() {
    const modalContent = document.querySelector('.modal__content') as HTMLElement;
    const orderTemplate = document.getElementById('order') as HTMLTemplateElement;

    if (!orderTemplate) {
        console.error('Шаблон для оформления заказа не найден!');
        return;
    }

    const orderClone = orderTemplate.content.cloneNode(true) as HTMLElement;
    modalContent.innerHTML = ''; // Очищаем старое содержимое
    modalContent.appendChild(orderClone); // Добавляем шаблон заказа

    // Устанавливаем обработчики событий на форму
    const orderForm = modalContent.querySelector('.form') as HTMLFormElement;
    if (orderForm) {
        setupOrderFormEvents(orderForm);
    } else {
        console.error('Форма заказа не найдена!');
    }
}

// Вспомогательная функция для добавления событий
function setupOrderFormEvents(form: HTMLFormElement) {
    const addressInput = form.querySelector('.form__input') as HTMLInputElement;
    const submitButton = form.querySelector('.order__button') as HTMLButtonElement;
    const paymentButtons = form.querySelectorAll('.order__buttons .button') as NodeListOf<HTMLButtonElement>;

    let selectedPaymentMethod: string | null = null;

    // Обработка клика на метод оплаты
    paymentButtons.forEach((button) => {
        button.addEventListener('click', () => {
            // Снимаем выделение со всех кнопок
            paymentButtons.forEach((btn) => btn.classList.remove('button_active'));
            // Добавляем выделение для текущей кнопки
            button.classList.add('button_active');
            selectedPaymentMethod = button.name; // Сохраняем выбранный метод оплаты
            validateForm(); // Проверяем форму после выбора метода оплаты
        });
    });

    // Валидация адреса
    addressInput.addEventListener('input', () => {
        validateForm(); // Проверяем форму после изменения адреса
    });

    // Функция проверки состояния формы
    function validateForm() {
        const isAddressValid = addressInput.value.trim().length > 0; // Проверка на заполненность адреса
        const isPaymentSelected = selectedPaymentMethod !== null; // Проверка выбора метода оплаты
        submitButton.disabled = !(isAddressValid && isPaymentSelected); // Кнопка активна, если оба условия выполнены
    }

    // Отправка формы
    form.addEventListener('submit', (event) => {
        event.preventDefault();

        if (selectedPaymentMethod) {
            alert(`Заказ успешно оформлен! Метод оплаты: ${selectedPaymentMethod}, адрес: ${addressInput.value}`);
        } else {
            alert('Ошибка: метод оплаты не выбран!');
        }
    });
}



// Сохранение корзины в localStorage
function saveBasketToLocalStorage() {
    localStorage.setItem('basket', JSON.stringify(basket));
    localStorage.setItem('addedProductIds', JSON.stringify([...addedProductIds]));
}

// Загрузка корзины из localStorage
function loadBasketFromLocalStorage() {
    const storedBasket = localStorage.getItem('basket');
    if (storedBasket) basket = JSON.parse(storedBasket);
    updateBasket();
    updateBasketCounter();
}

// Загрузка данных при старте
window.addEventListener('DOMContentLoaded', () => {
    loadBasketFromLocalStorage();
    loadProducts();
});
