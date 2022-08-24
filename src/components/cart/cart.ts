import { IBaseComponent, ICard, ICart, ILocalStorage } from '../../types/types';
import { BaseComponent } from '../base-component/base-component';
import './cart.scss';
import { conctants } from '../../constants/constants';
import { LocalStorage } from '../local-storage/local-storage';

export class Cart extends BaseComponent implements ICart {
  public value: IBaseComponent;

  public content: ICard[] = [];

  public readonly localStorage: ILocalStorage = new LocalStorage();

  constructor(
    parent: HTMLElement,
    tag: keyof HTMLElementTagNameMap = 'div',
    className: string = ''
  ) {
    super(parent, tag, className);
    const title: IBaseComponent = new BaseComponent(this.element, 'span', 'cart__title');
    title.element.textContent = 'Cart';
    new BaseComponent(this.element, 'span', 'cart__icon');
    this.value = new BaseComponent(this.element, 'span', 'cart__value');
    this.value.element.textContent = `${this.localStorage.cart.length}`;
  }

  public addItemToCart(item: ICard): void {
    if (this.content.includes(item)) {
      this.removeItemFromCart(item);
    } else {
      if (this.content.length >= conctants.MAX_ITEMS_IN_CART) {
        this.element.classList.add('full');
        setTimeout((): void => this.element.classList.remove('full'), 1500);
        return;
      }
      this.content.push(item);
    }
    this.value.element.textContent = `${this.content.length}`;
    item.element.classList.toggle(conctants.NAME_OF_CHECKED_CLASS);
    this.localStorage.cart = [...this.content.map((card: ICard): string => card.title)];
    this.localStorage.save();
  }

  public removeItemFromCart(item: ICard): void {
    this.content = this.content.filter((card: ICard): boolean => card.title != item.title);
  }
}
