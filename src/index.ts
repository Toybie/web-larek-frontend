import './scss/styles.scss';
import { ProductCard } from '../src/components/productCard';
import { IProduct } from './types/index';

export const API_URL = `${process.env.API_ORIGIN}/api/weblarek`;
export const CDN_URL = `${process.env.API_ORIGIN}/content/weblarek`;

const productCard = new ProductCard(API_URL, CDN_URL);

async function loadProducts() {
  try {
    const products: IProduct[] = await productCard.fetchProducts();

    const gallery = document.querySelector('.gallery') as HTMLElement;
    const template = document.getElementById('card-catalog') as HTMLTemplateElement;

    gallery.innerHTML = '';

    // Проходим по всем продуктам и отображаем их
    for (const product of products) {
      const card = await productCard.createCard(product, template);
      gallery.appendChild(card);
    }
  } catch (error) {
    console.error('Ошибка при отрисовке карточек:', error);
  }
}

// Загружаем продукты после загрузки DOM
window.addEventListener('DOMContentLoaded', loadProducts);
