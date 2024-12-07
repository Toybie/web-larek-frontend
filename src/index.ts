import './scss/styles.scss';
import { Api } from './components/base/api';
import { IProduct } from './types/index';
import { Modal } from './components/modal';

export const API_URL = `${process.env.API_ORIGIN}/api/weblarek`;
export const CDN_URL = `${process.env.API_ORIGIN}/content/weblarek`;

const api = new Api(API_URL);
const modal = new Modal('.modal');

// Массив товаров в корзине
let basket: IProduct[] = [];

// Счетчик товаров на кнопке корзины
const basketCounter = document.querySelector('.header__basket-counter') as HTMLElement;

// Шаблон для товара в корзине
const basketTemplate = document.getElementById('card-basket') as HTMLTemplateElement;
const basketTotalPrice = document.querySelector('.basket__price') as HTMLElement;

// Функция для рендера карточки товара в модальном окне
const renderProductModalContent = (product: IProduct) => {
    const container = document.createElement('div');
    container.classList.add('card', 'card_full');

    container.innerHTML = `
        <img class="card__image" src="${CDN_URL}${product.image}" alt="${product.title}" />
        <div class="card__column">
            <span class="card__category card__category_soft">${product.category}</span>
            <h2 class="card__title">${product.title}</h2>
            <p class="card__text">${product.description || 'Описание товара отсутствует'}</p>
            <div class="card__row">
                <button class="button" data-id="${product.id}">В корзину</button>
                <span class="card__price">${product.price ? `${product.price} синапсов` : 'Бесценно'}</span>
            </div>
        </div>
    `;

    return container;
};

// Функция для загрузки продуктов и добавления событий на карточки
const loadProducts = async () => {
    try {
        const response = await api.get('/product/');
        const products: IProduct[] = response.items as IProduct[];

        const gallery = document.querySelector('.gallery') as HTMLElement;
        const template = document.getElementById('card-catalog') as HTMLTemplateElement;

        gallery.innerHTML = '';

        products.forEach((product: IProduct) => {
            const clone = template.content.cloneNode(true) as HTMLElement;

            // Заполняем данные карточки
            const categoryElement = clone.querySelector('.card__category');
            if (categoryElement) {
                categoryElement.textContent = product.category;
            }

            const titleElement = clone.querySelector('.card__title');
            if (titleElement) {
                titleElement.textContent = product.title;
            }

            const priceElement = clone.querySelector('.card__price');
            if (priceElement) {
                priceElement.textContent = `${product.price ? `${product.price} синапсов` : 'Бесценно'}`;
            }

            const imageContainer = clone.querySelector('.card__image') as HTMLImageElement | null;
            if (imageContainer) {
                imageContainer.src = `${CDN_URL}${product.image}`;
            }

            // Добавляем обработчик для клика по карточке
            const card = clone.querySelector('.card') as HTMLElement;
            if (card) {
                card.addEventListener('click', () => {
                    const content = renderProductModalContent(product);
                    modal.setContent(content);
                    modal.open();

                    // Обработчик для добавления в корзину
                    const addToBasketButton = content.querySelector('.button') as HTMLButtonElement;
                    addToBasketButton.addEventListener('click', () => {
                        addProductToBasket(product); // Просто добавляем товар в корзину
                    });
                });
            }

            // Добавляем карточку в галерею
            gallery.appendChild(clone);
        });
    } catch (error) {
        console.error('Ошибка при загрузке данных:', error);
        const gallery = document.querySelector('.gallery') as HTMLElement;
        gallery.innerHTML = '<p>Не удалось загрузить данные. Пожалуйста, попробуйте позже.</p>';
    }
};

// Добавление товара в корзину
function addProductToBasket(product: IProduct) {
    // Добавляем товар в корзину
    basket.push(product);
    updateBasket(); // Обновляем корзину
    updateBasketCounter(); // Обновляем счетчик на кнопке корзины
}

// Обновление корзины
function updateBasket() {
  const basketList = document.querySelector('.basket__list') as HTMLElement;
  if (!basketList) return;

  basketList.innerHTML = '';  // Очищаем содержимое корзины перед рендером новых товаров

  let totalPrice = 0;  // Для подсчета общей стоимости

  // Добавляем товары в корзину с использованием шаблона
  basket.forEach((product, index) => {
      const itemClone = basketTemplate.content.cloneNode(true) as HTMLElement;

      // Заполняем данные товара в клонированном элементе
      const itemIndex = itemClone.querySelector('.basket__item-index') as HTMLElement;
      const itemTitle = itemClone.querySelector('.card__title') as HTMLElement;
      const itemPrice = itemClone.querySelector('.card__price') as HTMLElement;
      const deleteButton = itemClone.querySelector('.basket__item-delete') as HTMLButtonElement;

      itemIndex.textContent = (index + 1).toString();
      itemTitle.textContent = product.title;
      itemPrice.textContent = `${product.price} синапсов`;

      // Добавляем обработчик на удаление товара
      deleteButton.onclick = () => {
          removeFromBasket(product.id);
      };

      // Добавляем товар в список корзины
      basketList.appendChild(itemClone);

      // Суммируем цену всех товаров
      totalPrice += product.price;
  });

  // Обновляем общую стоимость
  if (basketTotalPrice) {
      basketTotalPrice.textContent = `Итого: ${totalPrice} синапсов`;
  }
}

// Обновление счетчика товаров на кнопке корзины
function updateBasketCounter() {
    basketCounter.textContent = basket.length.toString();
}

// Удаляем товар из корзины
function removeFromBasket(productId: string) {
    basket = basket.filter((product) => product.id !== productId);  // Фильтруем корзину
    updateBasket();  // Перезаполняем корзину после удаления товара
    updateBasketCounter();  // Обновляем счетчик после удаления товара
}

// Событие для открытия корзины
const basketButton = document.querySelector('.header__basket') as HTMLButtonElement;
basketButton.addEventListener('click', () => {
    // Открытие модального окна корзины
    modal.open();

    // Получаем шаблон корзины и клонируем его
    const modalContent = document.querySelector('.modal__content') as HTMLElement;

    // Очистим модальное окно перед добавлением нового контента
    modalContent.innerHTML = '';

    const basketTemplate = document.getElementById('basket') as HTMLTemplateElement;

    if (basketTemplate) {
        // Клонируем шаблон корзины
        const modalClone = basketTemplate.content.cloneNode(true) as HTMLElement;

        // Добавляем клонированный шаблон в modalContent
        modalContent.appendChild(modalClone);

        // Обновляем корзину с товарами
        updateBasket();  // Вызываем функцию для обновления списка товаров
    }
});

// Загружаем продукты после загрузки DOM
window.addEventListener('DOMContentLoaded', loadProducts);
