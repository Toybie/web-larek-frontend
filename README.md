
# Проектная работа "Веб-ларек"

## Оглавление

- [Запуск](#запуск)
- [Сборка](#сборка)
- [Описание](#описание)
- [Документация](#документация)
- [Автор](#автор)

## Запуск

Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```

## Сборка

```
npm run build
```

или

```
yarn build
```

## Описание

Онлайн магазин необходимых для веб разработчика мелочей.

Стек технологий
HTML
SCSS
TypeScript
Webpack

Структура проекта:

- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:

- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/styles/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами


## Документация

### Типы данных

Категории товара

```TypeScript
/*
    Тип описывающий все возможные категории товара
*/
type CategoryType =
  | 'другое'
  | 'софт-скил'
  | 'дополнительное'
  | 'кнопка'
  | 'хард-скил';

/*
    Тип, описывающий ошибки валидации форм
*/
type FormErrors = Partial<Record<keyof IOrderForm, string>>;

/*
  * Интерфейс, описывающий карточку товара в магазине
* */
interface IProduct {
  id: string;
  title: string;
  description: string;
  price: number | null;
  image: string;
  category: CategoryType;
  selected: boolean;
}

/*
  * Интерфейс, описывающий внутренне состояние приложения
    Используется для хранения карточек, корзины, заказа пользователя, ошибок
    в формах
    Так же имеет методы для работы с карточками и корзиной
  * */
interface IAppState {
  basket: Product[];
  store: Product[];
  order: IOrder;
  formErrors: FormErrors;
  addToBasket(value: Product): void;
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

/*
  * Интерфейс, описывающий поля заказа товара
* */
export interface IOrder {
  items: string[];
  payment: string;
  total: number;
  address: string;
  email: string;
  phone: string;
}

/*
  * Интерфейс, описывающий карточку товара
* */
interface ICard {
  id: string;
  title: string;
  category: string;
  description: string;
  image: string;
  price: number | null;
  selected: boolean;
}

/*
  * Интерфейс описывающий страницу
  * */
interface IPage {
  counter: number;
  store: HTMLElement[];
  locked: boolean;
}

/*
  * Интерфейс, описывающий корзину товаров
  * */
export interface IBasket {
  list: HTMLElement[];
  price: number;
}

/*
  * Интерфейс, описывающий окошко заказа товара
  * */
export interface IOrder {
  address: string;
  payment: string;
}

/*
  * Интерфейс, описывающий окошко контакты
  * */
export interface IContacts {
  phone: string;
  email: string;
}
```

### Модели данных

```TypeScript
/**
 * Базовая модель, чтобы можно было отличить ее от простых объектов с данными
 */
abstract class Model<T> {
  constructor(data: Partial<T>, protected events: IEvents) {}
  emitChanges(event: string, payload?: object) {}
}

/*
  * Класс, описывающий состояние приложения
  * */
class AppState extends Model<IAppState> {
  basket: Product[] = [];
  store: Product[];
  order: IOrder = {
    items: [],
    payment: '',
    total: null,
    address: '',
    email: '',
    phone: '',
  };

  // Объект с ошибками форм
  formErrors: FormErrors = {};
  addToBasket(value: Product): void;
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
```

### Классы представления 
```TypeScript
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
```

### Описание событий

```TypeScript
/*
    Перечисление событий
*/
enum Events {
  PRODUCT_SELECTED = 'product:selected',
  ADD_TO_BASKET = 'addToBasket',
  REMOVE_FROM_BASKET = 'removeFromBasket',
  ORDER_SUBMITTED = 'order:submitted',
  ORDER_SUCCESS = 'order:success',
  BASKET_UPDATED = 'basket:updated',
  // другие события
}


/*
    Интерфейс для события добавления товара в корзину
*/
export interface AddToBasketEvent {
  type: Events.ADD_TO_BASKET;
  payload: {
    productId: string;
    quantity: number;
  };
}

```

## Автор

- Github - [Boris Tauber](https://github.com/Toybie)

