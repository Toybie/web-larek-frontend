// src/types/index.ts

// Типы категорий товаров
export type CategoryType = 
  | 'другое'
  | 'софт-скил'
  | 'дополнительное'
  | 'кнопка'
  | 'хард-скил';

// Интерфейс для товара
export interface IProduct {
  id: string;
  title: string;
  description: string;
  price: number | null;
  image: string;
  category: CategoryType;
  selected: boolean;
}

// Интерфейс для формы состояния
export interface IFormState {
  paymentMethod: 'online' | 'cash';
  address: string;
  email: string;
  phone: string;
}

// Интерфейс для состояния приложения
export interface IAppState {
  basket: IProduct[];   // Список товаров в корзине
  store: IProduct[];    // Список товаров в каталоге
  order: IOrder;        // Данные о заказе
  formErrors: FormErrors;  // Ошибки в форме
  addToBasket(value: IProduct): void;
  deleteFromBasket(id: string): void;
  clearBasket(): void;
  getBasketAmount(): number;
  getTotalBasketPrice(): number;
  setItems(): void;
  setOrderField(field: keyof IOrderForm, value: string): void;
  validateContacts(): boolean;
  validateOrder(): boolean;
  refreshOrder(): boolean;
  setStore(items: IProduct[]): void;
  resetSelected(): void;
}

// Интерфейс для формы заказа
export interface IOrderForm {
  paymentMethod: 'online' | 'cash';
  address: string;
  email: string;
  phone: string;
}

// Интерфейс для информации о заказе
export interface IOrder {
  items: string[];      // Массив ID товаров
  payment: 'online' | 'cash';
  total: number;
  address: string;
  email: string;
  phone: string;
}

// Интерфейс для результата оформления заказа
export interface IOrderResult {
  orderId: string;
  totalSpent: number;
}

// Интерфейс для компонента карточки товара (отображение товара)
export interface IProductCardView {
  product: IProduct;
  onAddToBasket: (productId: string) => void;
  onRemoveFromBasket: (productId: string) => void;
}

// Интерфейс для компонента корзины
export interface IBasketView {
  items: IProduct[];
  total: number;
  onRemoveItem: (productId: string) => void;
  onCheckout: () => void;
}

// Интерфейс для компонента формы заказа
export interface IOrderFormView {
  formData: IOrderForm;
  onSubmit: (formData: IOrderForm) => void;
  onInputChange: (field: keyof IOrderForm, value: string) => void;
}

// Интерфейс для базового компонента
export interface IBaseComponent<T> {
  render(data?: T): HTMLElement;
  setText(element: HTMLElement, value: string): void;
  setDisabled(element: HTMLElement, state: boolean): void;
  setImage(el: HTMLImageElement, src: string, alt?: string): void;
}

// Интерфейс для событий
export interface IEvents {
  on(event: string, callback: Function): void;
  off(event: string, callback: Function): void;
  emit(event: string, data?: any): void;
}

// Перечисление для всех событий
export enum Events {
  PRODUCT_SELECTED = 'product:selected',
  ADD_TO_BASKET = 'addToBasket',
  REMOVE_FROM_BASKET = 'removeFromBasket',
  ORDER_SUBMITTED = 'order:submitted',
  ORDER_SUCCESS = 'order:success',
  BASKET_UPDATED = 'basket:updated',
  // другие события
}

// Интерфейс для события добавления товара в корзину
export interface AddToBasketEvent {
  type: Events.ADD_TO_BASKET;
  payload: {
    productId: string;
    quantity: number;
  };
}

// Интерфейс для события удаления товара из корзины
export interface RemoveFromBasketEvent {
  type: Events.REMOVE_FROM_BASKET;
  payload: {
    productId: string;
  };
}

// Интерфейс для события успешного оформления заказа
export interface OrderSuccessEvent {
  type: Events.ORDER_SUCCESS;
  payload: {
    orderId: string;
    totalSpent: number;
  };
}
