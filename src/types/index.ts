// Тип описывающий категорию товара
export type CategoryType = 'другое' | 'софт-скил' | 'дополнительное' | 'кнопка' | 'хард-скил';

// Интерфейс для работы с API
export type ApiListResponse<Type> = {
  total: number;
  items: Type[];
};

export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

// Интерфейс для работы с API
export interface IWebLarekAPI {
  getProductList(): Promise<ApiListResponse<IProduct>>;
  getProductItem(id: string): Promise<IProduct>;
  createOrder(orderData: IOrder): Promise<IOrderResult>;
}

// Интерфейс товара
export interface IProduct {
  id: string;
  title: string;
  description: string;
  price: number | null;
  image: string;
  category: CategoryType;
  selected: boolean;
}

// Элемент корзины
export interface BasketItem {
  productId: string;
  quantity: number;
}

// Интерфейс данных заказа
export interface IOrder {
  items: string[]; // массив ID товаров
  payment: 'online' | 'cash';
  total: number;
  address: string;
  email: string;
  phone: string;
}

// Результат оформления заказа
export interface IOrderResult {
  orderId: string;
  totalSpent: number;
}

// Интерфейс для данных формы заказа
export interface IOrderForm {
  paymentMethod: 'online' | 'cash';
  address: string;
  email: string;
  phone: string;
}

// Интерфейс для компонента товара (отображение в каталоге)
export interface IProductCardView {
  product: IProduct;
  onAddToBasket: (productId: string) => void;
  onRemoveFromBasket: (productId: string) => void;
}

// Интерфейс для компонента корзины
export interface IBasketView {
  items: BasketItem[];
  total: number;
  onRemoveItem: (productId: string) => void;
  onCheckout: () => void;
}

// Интерфейс для компонента формы оформления заказа
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
