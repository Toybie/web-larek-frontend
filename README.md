# Проектная работа "Веб-ларек"

## **Оглавление**
1. [Запуск](#запуск)
2. [Сборка](#сборка)
3. [Описание](#описание)
   - [Описание компонентов](#описание-компонентов)
   - [Документация](#документация)
     - [Типы данных](#типы-данных)
     - [Модели данных](#модели-данных)
     - [События](#события)
4. [Автор](#автор)


---

## **Запуск**

Для установки и запуска проекта необходимо выполнить команды:

```bash
npm install
npm run start

или
yarn
yarn start


Сборка
Для сборки приложения выполните одну из команд:
npm run build
или
yarn build


Описание
Онлайн магазин необходимых для веб-разработчика мелочей.
Стек технологий
HTML
SCSS
TypeScript
Webpack
Структура проекта
src/ — исходные файлы проекта
src/components/ — папка с JS компонентами
src/components/base/ — папка с базовым кодом


Важные файлы:
src/pages/index.html — HTML-файл главной страницы
src/types/index.ts — файл с типами
src/index.ts — точка входа приложения
src/scss/styles.scss — корневой файл стилей
src/utils/constants.ts — файл с константами
src/utils/utils.ts — файл с утилитами

Описание компонентов
Компонент ProductCard
Назначение: Компонент ProductCard отображает информацию о товаре в каталоге. Он показывает изображение товара, его название, категорию и цену, а также предоставляет кнопки для добавления товара в корзину и удаления из корзины.
Функции:
Отображает товар с данными: изображение, название, цена.
Позволяет пользователю добавить товар в корзину или удалить его.
Связан с компонентом корзины, через события ADD_TO_BASKET и REMOVE_FROM_BASKET.
Компонент Basket
Назначение: Компонент Basket отображает содержимое корзины покупок. Он показывает список товаров в корзине, их количество, цену и предоставляет возможность удаления товара из корзины или оформления заказа.
Функции:
Отображает список товаров в корзине.
Рассчитывает итоговую сумму всех товаров в корзине.
Реализует события REMOVE_FROM_BASKET и CHECKOUT.
Компонент OrderForm
Назначение: Компонент OrderForm отвечает за отображение формы для ввода данных о способе оплаты и адресе доставки.
Функции:
Отображает поля для ввода адреса доставки, email, телефона.
Проверяет корректность введенных данных.
Отправляет данные формы для оформления заказа.

Документация
Типы данных
Категории товара
type CategoryType =
  | 'другое'
  | 'софт-скил'
  | 'дополнительное'
  | 'кнопка'
  | 'хард-скил';

Интерфейс товара
interface IProduct {
  id: string;
  title: string;
  description: string;
  price: number | null;
  image: string;
  category: CategoryType;
  selected: boolean;
}

Интерфейс состояния приложения
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


Модели данных
Базовая модель
abstract class Model<T> {
  constructor(data: Partial<T>, protected events: IEvents) {}
  emitChanges(event: string, payload?: object) {}
}

Состояние приложения
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


События
Перечисление событий
enum Events {
  PRODUCT_SELECTED = 'product:selected',
  ADD_TO_BASKET = 'addToBasket',
  REMOVE_FROM_BASKET = 'removeFromBasket',
  ORDER_SUBMITTED = 'order:submitted',
  ORDER_SUCCESS = 'order:success',
  BASKET_UPDATED = 'basket:updated',
  // другие события
}

Интерфейс для события добавления товара в корзину
export interface AddToBasketEvent {
  type: Events.ADD_TO_BASKET;
  payload: {
    productId: string;
    quantity: number;
  };
}


Автор
Разработчик: Boris Tauber

