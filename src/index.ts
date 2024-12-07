import './scss/styles.scss';
import { Api } from './components/base/api';
import { IProduct, IAppState, IOrderForm } from './types';
import { Modal } from './components/cardModal';

export const API_URL = `${process.env.API_ORIGIN}/api/weblarek`;
export const CDN_URL = `${process.env.API_ORIGIN}/content/weblarek`;

const api = new Api(API_URL);
const modal = new Modal('.modal', 'card-preview');

// Имитация глобального состояния приложения
const appState: IAppState = {
  store: [],

  setStore(items: IProduct[]) {
    this.store = items;
  },

  setItems() { }, // Реализуйте эту функцию согласно вашим требованиям
  setOrderField(field: keyof IOrderForm, value: string) { }, // Реализуйте эту функцию согласно вашим требованиям
  validateContacts() {
    return true; // Реализуйте эту функцию согласно вашим требованиям
  },
  validateOrder() {
    return true; // Реализуйте эту функцию согласно вашим требованиям
  },
  refreshOrder() {
    return true; // Реализуйте эту функцию согласно вашим требованиям
  },
  basket: [],
  order: undefined,
  addToBasket: function (value: IProduct): void {
    throw new Error('Function not implemented.');
  },
  deleteFromBasket: function (id: string): void {
    throw new Error('Function not implemented.');
  },
  clearBasket: function (): void {
    throw new Error('Function not implemented.');
  },
  getBasketAmount: function (): number {
    throw new Error('Function not implemented.');
  },
  getTotalBasketPrice: function (): number {
    throw new Error('Function not implemented.');
  },
  resetSelected: function (): void {
    throw new Error('Function not implemented.');
  }
};

const loadProducts = async () => {
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
};

// Загружаем продукты после загрузки DOM
window.addEventListener('DOMContentLoaded', loadProducts);
