export class Modal {
    private modalElement: HTMLElement;
    private isOpen: boolean = false;

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
    }

    private toggleModal(state: boolean) {
        this.modalElement.classList.toggle('modal_active', state);
        this.toggleBodyOverflow(state);
        this.isOpen = state;

        if (state) {
            document.addEventListener('keydown', this.handleEscape);
        } else {
            document.removeEventListener('keydown', this.handleEscape);
        }
    }

    private toggleBodyOverflow(state: boolean) {
        document.body.style.overflow = state ? 'hidden' : '';
    }

    private handleEscape = (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
            this.close();
        }
    };

    getElement(): HTMLElement {
        return this.modalElement;
    }

    open() {
        if (!this.isOpen) {
            this.toggleModal(true);
        }
    }

    close() {
        if (this.isOpen) {
            this.toggleModal(false);
        }
    }

    setContent(content: HTMLElement | string) {
        const modalContent = this.modalElement.querySelector('.modal__content') as HTMLElement;
        if (!modalContent) throw new Error('Контейнер контента модального окна не найден');

        modalContent.innerHTML = '';
        if (typeof content === 'string') {
            modalContent.innerHTML = content;
        } else {
            modalContent.appendChild(content);
        }
    }
}