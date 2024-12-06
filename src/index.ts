import './scss/styles.scss';
import { Api } from './components/base/api';
import { IProduct } from './types/index';
import { Modal } from './components/modal';

export const API_URL = `${process.env.API_ORIGIN}/api/weblarek`;
export const CDN_URL = `${process.env.API_ORIGIN}/content/weblarek`;

const api = new Api(API_URL);
const modal = new Modal('.modal', 'card-preview'); 

// Функция загрузки продуктов
async function loadProducts() {
  try {
    // Запрашиваем данные с сервера
    const response = await api.get<IProduct>('/product/');
    const products: IProduct[] = response.items;

    const gallery = document.querySelector('.gallery') as HTMLElement;
    const template = document.getElementById('card-catalog') as HTMLTemplateElement;

    gallery.innerHTML = '';

    // Проходим по всем продуктам и отображаем их
    products.forEach((product) => {
      const clone = template.content.cloneNode(true) as HTMLElement;

      // Заполняем данные карточки
      const categoryElement = clone.querySelector('.card__category')!;
      categoryElement.textContent = product.category;

      const titleElement = clone.querySelector('.card__title')!;
      titleElement.textContent = product.title;

      const priceElement = clone.querySelector('.card__price')!;
      priceElement.textContent = `${product.price ? product.price : 'Цена не указана'} синапсов`;

      const imageContainer = clone.querySelector('.card__image')!;

      // Формируем полный URL для изображения
      const fullImageUrl = `${CDN_URL}${product.image}`;

      // Для обычных изображений, просто устанавливаем атрибут src
      const imgElement = imageContainer as HTMLImageElement;
      imgElement.src = fullImageUrl;

      // Добавляем обработчик события для клика по карточке
      const card = clone.querySelector('.card') as HTMLElement;
      card.addEventListener('click', () => {
        // Открываем модальное окно и заполняем его данными
        modal.fillData({
          image: fullImageUrl, // Полный путь к изображению
          category: product.category, // Категория товара
          title: product.title, // Название товара
          text: product.description || 'Описание товара отсутствует', // Описание товара
          price: product.price || 'Цена не указана', // Цена товара
        });

        modal.open();
      });

      // Добавляем карточку в галерею
      gallery.appendChild(clone);
    });
  } catch (error) {
    console.error('Ошибка при загрузке данных:', error);
  }
}

// Загружаем продукты после загрузки DOM
window.addEventListener('DOMContentLoaded', loadProducts);
