import { IProduct } from '../../../types';
import { CDN_URL } from '../../../utils/constants';

export class ProductRenderer {
    private container: HTMLElement;

    constructor(container: HTMLElement) {
        this.container = container;
    }

    render(products: IProduct[]): void {
        const catalogTemplate = document.getElementById('card-catalog') as HTMLTemplateElement;
    
        if (!catalogTemplate) {
            console.error('Шаблон каталога не найден!');
            return;
        }
    
        const fragment = document.createDocumentFragment();
    
        products.forEach(product => {
            const clone = catalogTemplate.content.cloneNode(true) as HTMLElement;
            const cardImage = clone.querySelector('.card__image') as HTMLImageElement;
            const cardTitle = clone.querySelector('.card__title') as HTMLElement;
            const cardCategory = clone.querySelector('.card__category') as HTMLElement;
            const cardPrice = clone.querySelector('.card__price') as HTMLElement;
    
            if (cardImage) {
                cardImage.src = `${CDN_URL}/${product.image}`;
                cardImage.alt = product.title;
            }
            if (cardTitle) cardTitle.textContent = product.title;
            if (cardCategory) cardCategory.textContent = product.category;
            if (cardPrice) cardPrice.textContent = `${product.price ? `${product.price} синапсов` : 'Бесценно'}`;
    
            const card = clone.querySelector('.card') as HTMLElement;
            if (card) {
                card.dataset.productId = product.id;
                card.addEventListener('click', () => {
                    const event = new CustomEvent('product:selected', {
                        detail: { product },
                        bubbles: true,
                    });
                    card.dispatchEvent(event);
                });
            }
    
            fragment.appendChild(clone);
        });
    
        this.container.innerHTML = '';
        this.container.appendChild(fragment);
    }
}