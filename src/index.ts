import './scss/styles.scss';
import { Api, ApiListResponse } from './components/base/api';
import { Modal } from './components/modal';
import { Card } from './components/Card';
import { Basket } from './components/Basket';
import { Forms } from './components/Forms';
import { IProduct } from './types/index';

const API_URL = `${process.env.API_ORIGIN}/api/weblarek`;
const api = new Api(API_URL);
const modal = new Modal('.modal');
const basket = new Basket('.header__basket-counter');
const card = new Card(modal);
const forms = new Forms();

basket.loadBasket();

window.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await api.get<ApiListResponse<IProduct>>('/product/');
        const products = response.items;
        const gallery = document.querySelector('.gallery') as HTMLElement;
        const template = document.getElementById('card-catalog') as HTMLTemplateElement;

        gallery.innerHTML = '';

        products.forEach((product) => {
            const clone = template.content.cloneNode(true) as HTMLElement;
            const cardElement = clone.querySelector('.card') as HTMLElement;

            // Устанавливаем данные карточки
            const imageElement = cardElement.querySelector('.card__image') as HTMLImageElement;
            const titleElement = cardElement.querySelector('.card__title') as HTMLElement;
            const priceElement = cardElement.querySelector('.card__price') as HTMLElement;

            imageElement.src = `${process.env.API_ORIGIN}/content/weblarek${product.image}`;
            imageElement.alt = product.title;
            titleElement.textContent = product.title;
            priceElement.textContent = product.price ? `${product.price} синапсов` : 'Бесценно';

            // Настраиваем обработчик для открытия модального окна
            card.setupProductCard(cardElement, product, (p) => basket.addProduct(p));
            gallery.appendChild(clone);
        });
    } catch (error) {
        console.error('Ошибка загрузки продуктов:', error);
    }
});