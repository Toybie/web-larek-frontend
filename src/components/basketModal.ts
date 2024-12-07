import { 
    IProduct, 
    IAppState, 
    IOrder, 
    IOrderForm, 
    IOrderResult, 
    Events, 
    AddToBasketEvent, 
    RemoveFromBasketEvent, 
    OrderSuccessEvent,
    IEvents 
} from '../types/index';

export class BasketModal {
  private basketModal: HTMLElement; // Ссылка на модальное окно корзины
  private basketItems: IProduct[] = []; // Список товаров в корзине
  private totalPrice: number = 0; // Общая стоимость товаров в корзине
  private appState: IAppState; // Состояние приложения
  private boundHandleAddToBasketEvent: (event: AddToBasketEvent) => void;
  private boundHandleRemoveFromBasketEvent: (event: RemoveFromBasketEvent) => void;
  private boundHandleOrderSuccessEvent: (event: OrderSuccessEvent) => void;

  constructor(basketModal: HTMLElement, appState: IAppState) {
    this.basketModal = basketModal;
    this.appState = appState;

    // Привязываем обработчики событий
    this.boundHandleAddToBasketEvent = this.handleAddToBasketEvent.bind(this);
    this.boundHandleRemoveFromBasketEvent = this.handleRemoveFromBasketEvent.bind(this);
    this.boundHandleOrderSuccessEvent = this.handleOrderSuccessEvent.bind(this);
  }

  // Метод для открытия модального окна
  open() {
    this.basketModal.classList.add('basket__active');
    document.body.style.overflow = 'hidden'; // Блокируем прокрутку страницы
  }

  // Метод для закрытия модального окна
  close() {
    this.basketModal.classList.remove('basket__active');
    document.body.style.overflow = ''; // Разблокируем прокрутку страницы
  }

  // Метод для добавления товаров в корзину
  addToBasket(product: IProduct) {
    this.basketItems.push(product);
    this.updateTotalPrice();
    this.renderBasketItems();
  }

  // Метод для удаления товаров из корзины
  removeFromBasket(productId: string) {
    this.basketItems = this.basketItems.filter(item => item.id !== productId);
    this.updateTotalPrice();
    this.renderBasketItems();
  }

  // Метод для обновления общей стоимости товаров в корзине
  updateTotalPrice() {
    this.totalPrice = this.basketItems.reduce((acc, item) => acc + (item.price || 0), 0);
    const basketPriceElement = this.basketModal.querySelector('.basket__price') as HTMLElement;
    basketPriceElement.textContent = `${this.totalPrice} синапсов`;
  }

  // Метод для рендеринга списка товаров в корзине
  renderBasketItems() {
    const basketListElement = this.basketModal.querySelector('.basket__list') as HTMLElement;
    basketListElement.innerHTML = '';
    this.basketItems.forEach(item => {
      const basketItemElement = document.createElement('li');
      basketItemElement.className = 'basket__item';
      basketItemElement.textContent = `${item.title} (${item.price || 0} синапсов)`;

      const deleteButton = document.createElement('button');
      deleteButton.textContent = 'Удалить';
      deleteButton.addEventListener('click', () => this.removeFromBasket(item.id));

      basketItemElement.appendChild(deleteButton);
      basketListElement.appendChild(basketItemElement);
    });
  }

  // Обработчик события добавления товара в корзину
  handleAddToBasketEvent(event: AddToBasketEvent) {
    const product = this.appState.store.find(p => p.id === event.payload.productId);
    if (product) {
      this.addToBasket(product);
    }
  }

  // Обработчик события удаления товара из корзины
  handleRemoveFromBasketEvent(event: RemoveFromBasketEvent) {
    this.removeFromBasket(event.payload.productId);
  }

  // Обработчик события успешного оформления заказа
  handleOrderSuccessEvent(event: OrderSuccessEvent) {
    alert(`Ваш заказ №${event.payload.orderId} успешно оформлен! Общая сумма: ${event.payload.totalSpent} синапсов.`);
    this.clearBasket();
  }

  // Метод для очистки корзины
  clearBasket() {
    this.basketItems = [];
    this.updateTotalPrice();
    this.renderBasketItems();
  }

  // Подписка на события
  subscribeToEvents(events: IEvents) {
    events.on(Events.ADD_TO_BASKET, this.boundHandleAddToBasketEvent);
    events.on(Events.REMOVE_FROM_BASKET, this.boundHandleRemoveFromBasketEvent);
    events.on(Events.ORDER_SUCCESS, this.boundHandleOrderSuccessEvent);
  }

  // Отписка от событий
  unsubscribeFromEvents(events: IEvents) {
    events.off(Events.ADD_TO_BASKET, this.boundHandleAddToBasketEvent);
    events.off(Events.REMOVE_FROM_BASKET, this.boundHandleRemoveFromBasketEvent);
    events.off(Events.ORDER_SUCCESS, this.boundHandleOrderSuccessEvent);
  }
}
