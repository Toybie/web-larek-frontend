export class Modal {
    private modalElement: HTMLElement;
  
    constructor(modalSelector: string) {
        this.modalElement = document.querySelector(modalSelector) as HTMLElement;
        if (!this.modalElement) {
            throw new Error('Модальное окно не найдено');
        }
  
        const closeButton = this.modalElement.querySelector('.modal__close') as HTMLElement;
        if (closeButton) {
            closeButton.addEventListener('click', () => this.close());
        }
  
        this.modalElement.addEventListener('click', (event) => {
            if (event.target === this.modalElement) {
                this.close();
            }
        });
  
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape') {
                this.close();
            }
        });
    }
  
    open() {
        this.modalElement.classList.add('modal_active');
        document.body.style.overflow = 'hidden';
    }
  
    close() {
        this.modalElement.classList.remove('modal_active');
        document.body.style.overflow = '';
    }
  
    setContent(content: HTMLElement | string) {
        const modalContent = this.modalElement.querySelector('.modal__content') as HTMLElement;
        if (!modalContent) throw new Error('Контейнер контента модального окна не найден');
  
        // Очищаем старое содержимое
        modalContent.innerHTML = '';
  
        // Устанавливаем новое содержимое
        if (typeof content === 'string') {
            modalContent.innerHTML = content;
        } else {
            modalContent.appendChild(content);
        }
    }
  }