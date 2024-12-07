export class Modal {
    private modalElement: HTMLElement;
    private modalContentTemplate: HTMLTemplateElement;
  
    constructor(modalSelector: string, templateSelector: string) {
      this.modalElement = document.querySelector(modalSelector) as HTMLElement;
      if (!this.modalElement) {
        throw new Error('Модальное окно не найдено');
      }
  
      this.modalContentTemplate = document.getElementById(templateSelector) as HTMLTemplateElement;
      if (!this.modalContentTemplate) {
        throw new Error('Шаблон для модального окна не найден');
      }
  
      // Обработчик закрытия модального окна по кнопке
      const closeButton = this.modalElement.querySelector('.modal__close') as HTMLElement;
      if (closeButton) {
        closeButton.addEventListener('click', () => {
          this.close();
        });
      }
  
      // Обработчик закрытия модального окна по клику вне попапа
      this.modalElement.addEventListener('click', (event) => {
        if (event.target === this.modalElement) {
          this.close();
        }
      });
  
      // Обработчик закрытия модального окна по нажатию клавиши "Esc"
      document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
          this.close();
        }
      });
    }
  
    // Открытие модального окна
    open() {
      this.modalElement.classList.add('modal_active');
      document.body.style.overflow = 'hidden'; // Чтобы заблокировать прокрутку страницы при открытом модальном окне
    }
  
    // Закрытие модального окна
    close() {
      this.modalElement.classList.remove('modal_active');
      document.body.style.overflow = ''; // Разблокировать прокрутку страницы
    }
  
    // Заполнение модального окна данными
    fillData(product: {
      image: string;
      category: string;
      title: string;
      text: string;
      price: string | number;
    }) {
      // Клонируем шаблон
      const clone = this.modalContentTemplate.content.cloneNode(true) as HTMLElement;
  
      const cardImage = clone.querySelector('.card__image') as HTMLImageElement;
      const cardCategory = clone.querySelector('.card__category') as HTMLElement;
      const cardTitle = clone.querySelector('.card__title') as HTMLElement;
      const cardText = clone.querySelector('.card__text') as HTMLElement;
      const cardPrice = clone.querySelector('.card__price') as HTMLElement;
  
      // Заполняем шаблон данными
      cardImage.src = product.image;
      cardImage.alt = product.title;
      cardCategory.textContent = product.category;
      cardTitle.textContent = product.title;
      cardText.textContent = product.text;
      cardPrice.textContent = `${product.price} синапсов`;
  
      // Очищаем старое содержимое модального окна
      const modalContent = this.modalElement.querySelector('.modal__content') as HTMLElement;
      modalContent.innerHTML = '';
      modalContent.appendChild(clone);
  
      console.log('Modal data filled:', product);
    }
  }
  