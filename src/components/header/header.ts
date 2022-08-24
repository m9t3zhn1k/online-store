import { IBaseComponent, ICart, IHeader } from '../../types/types';
import { BaseComponent } from '../base-component/base-component';
import { Cart } from '../cart/cart';
import './header.scss';

export class Header extends BaseComponent implements IHeader {
  public readonly cart: ICart;

  constructor(
    parent: HTMLElement,
    tag: keyof HTMLElementTagNameMap = 'div',
    className: string = ''
  ) {
    super(parent, tag, className);
    const container: IBaseComponent = new BaseComponent(
      this.element,
      'div',
      'header__container container'
    );
    const logoContainer: IBaseComponent = new BaseComponent(
      container.element,
      'a',
      'header__logo-container',
      { href: '#' }
    );
    new BaseComponent(logoContainer.element, 'img', 'header__logo', {
      src: './assets/images/logo/kitchen_knives_logo.png',
      alt: 'logo',
    });
    new BaseComponent(logoContainer.element, 'h1', 'header__title').element.textContent =
      'Kitchen knives';
    this.cart = new Cart(container.element, 'div', 'header__cart-container cart');
  }
}
