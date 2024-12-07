import { Api } from './base/api';
import { IProduct } from '../types/index';

export class ProductCard {
  private api: Api;
  private cdnUrl: string;

  constructor(apiUrl: string, cdnUrl: string) {
    this.api = new Api(apiUrl);
    this.cdnUrl = cdnUrl;
  }

  // Метод для получения списка продуктов
  async fetchProducts(): Promise<IProduct[]> {
    try {
      const response = await this.api.get<IProduct>('/product/');
      return response.items;
    } catch (error) {
      console.error('Ошибка при загрузке данных:', error);
      return [];
    }
  }

  // Метод для создания HTML-карточки продукта
  async createCard(product: IProduct, template: HTMLTemplateElement): Promise<HTMLElement> {
    const clone = template.content.cloneNode(true) as HTMLElement;

    // Заполняем данные карточки
    const categoryElement = clone.querySelector('.card__category')!;
    categoryElement.textContent = product.category;

    const titleElement = clone.querySelector('.card__title')!;
    titleElement.textContent = product.title;

    const priceElement = clone.querySelector('.card__price')!;
    priceElement.textContent = `${product.price ? product.price : 'Бесценно'}`;

    const imageElement = clone.querySelector('.card__image') as HTMLImageElement;

    // Формируем полный URL для изображения
    imageElement.src = `${this.cdnUrl}${product.image}`;
    imageElement.alt = product.title;

    return clone;
  }
}
