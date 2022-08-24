import { IBaseComponent, IFooter } from '../../types/types';
import { BaseComponent } from '../base-component/base-component';
import './footer.scss';

export class Footer extends BaseComponent implements IFooter {
  constructor(
    parent: HTMLElement,
    tag: keyof HTMLElementTagNameMap = 'div',
    className: string = ''
  ) {
    super(parent, tag, className);
    const container: IBaseComponent = new BaseComponent(
      this.element,
      'div',
      'footer__container container'
    );
    new BaseComponent(container.element, 'a', 'footer__item footer__rs-logo', {
      href: 'https://rs.school/js/',
      target: '_blank',
    });
    new BaseComponent(container.element, 'p', 'footer__item footer__year').element.textContent =
      '2022';
    new BaseComponent(container.element, 'a', 'footer__item footer__github', {
      href: 'https://github.com/m9t3zhn1k',
      target: '_blank',
    });
  }
}
