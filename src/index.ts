import './scss/styles.scss';
import { Catalog } from './components/View/Catalog';
import { Modal } from './components/View/Modal';

document.addEventListener('DOMContentLoaded', () => {
  const container = document.querySelector('.gallery') as HTMLElement;

  if (container) {
    const catalog = new Catalog(container);
    catalog.loadProducts();
    console.log('Catalog loaded');
  }

  // Инициализация модального окна
  const modal = new Modal('.modal'); 

  // Добавление слушателя событий на закрытие окна
  const closeButton = document.querySelector('.modal__close') as HTMLElement;
  if (closeButton) {
    closeButton.addEventListener('click', () => {
      modal.close();
    });
  } 
});
