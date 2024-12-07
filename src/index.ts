import './scss/styles.scss';
import { Api } from './components/base/api';
import { 
  IProduct, 
  IAppState, 
  IOrder, 
  IOrderForm, 
  IOrderResult, 
  Events, 
  AddToBasketEvent, 
  RemoveFromBasketEvent, 
  OrderSuccessEvent, 
  IEvents 
} from './types';
import { Modal } from './components/cardModal';
import { BasketModal } from './components/basketModal';

export const API_URL = `${process.env.API_ORIGIN}/api/weblarek`;
export const CDN_URL = `${process.env.API_ORIGIN}/content/weblarek`;

const api = new Api(API_URL);
const modal = new Modal('.modal', 'card-preview');

// Имитация глобального состояния приложения
const appState: IAppState = {
  basket: [],
  store: [],
  order: {} as IOrder,
  addToBasket(value: IProduct) {
    this.basket.push(value);
    basketModal.addToBasket(value); // Обновляем корзину
  },
  deleteFromBasket(id: string) {
    this.basket = this.basket.filter((item: { id: string; }) => item.id !== id);
    basketModal.removeFromBasket(id); // Обновляем корзину
  },
  clearBasket() {
    this.basket = [];
    basketModal.clearBasket(); // Очищаем корзину
  },
  getBasketAmount() {
    return this.basket.length;
  },
  getTotalBasketPrice() {
    return this.basket.reduce((total: number, item: IProduct) => total + (item.price || 0), 0);
  },
  setItems() {}, // Реализуйте эту функцию согласно вашим требованиям
  setOrderField(field: keyof IOrderForm, value: string) {}, // Реализуйте эту функцию согласно вашим требованиям
  validateContacts() {
    return true; // Реализуйте эту функцию согласно вашим требованиям
  },
  validateOrder() {
    return true; // Реализуйте эту функцию согласно вашим требованиям
  },
  refreshOrder() {
    return true; // Реализуйте эту функцию согласно вашим требованиям
  },
  setStore(items: IProduct[]) {
    this.store = items;
  },
  resetSelected() {}, // Реализуйте эту функцию согласно вашим требованиям
};

const basketModal = new BasketModal(document.querySelector('.header__basket') as HTMLElement, appState);

// Функция загрузки продуктов
async function loadProducts() {
  try {
    const response = await api.get('/product/');
    const products: IProduct[] = response.items as IProduct[];

    appState.setStore(products); // Сохраняем полученные продукты в состояние приложения

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
        priceElement.textContent = `${product.price ? product.price : 'Цена не указана'} синапсов`;
      }

      const imageContainer = clone.querySelector('.card__image') as HTMLImageElement | null;
      if (imageContainer) {
        imageContainer.src = `${CDN_URL}${product.image}`;
      }

      // Добавляем обработчик события для клика по карточке
      const card = clone.querySelector('.card') as HTMLElement;
      if (card) {
        card.addEventListener('click', () => {
          modal.fillData({
            image: `${CDN_URL}${product.image}`, // Полный путь к изображению
            category: product.category, // Категория товара
            title: product.title, // Название товара
            text: product.description || 'Описание товара отсутствует', // Описание товара
            price: product.price || 'Цена не указана', // Цена товара
          });

          modal.open();
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
}

// Загружаем продукты после загрузки DOM
window.addEventListener('DOMContentLoaded', loadProducts);

// Подключаемся к событию корзины
document.querySelector('.header__basket')!.addEventListener('click', () => {
  basketModal.open();
});
