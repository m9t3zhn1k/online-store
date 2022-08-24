import { IBaseComponent, ICard, IGood } from '../../types/types';
import { BaseComponent } from '../base-component/base-component';
import './card.scss';

export class Card extends BaseComponent implements ICard {
  public title: string = '';

  constructor(
    parent: HTMLElement,
    good: IGood,
    tag: keyof HTMLElementTagNameMap = 'div',
    className: string = '',
    attributes: { [key: string]: string } = {}
  ) {
    super(parent, tag, className, attributes);
    this.createCard(this.element, good);
  }

  private createCard(parent: HTMLElement, good: IGood): void {
    const imageContainer: IBaseComponent = new BaseComponent(
      parent,
      'div',
      'card__image_container'
    );
    const title: IBaseComponent = new BaseComponent(parent, 'p', 'card__title');
    const type: IBaseComponent = new BaseComponent(parent, 'p', 'card__type');
    const manufacturer: IBaseComponent = new BaseComponent(parent, 'p', 'card__manufacturer');
    const weight: IBaseComponent = new BaseComponent(parent, 'p', 'card__weight');
    const blade: IBaseComponent = new BaseComponent(parent, 'p', 'card__blade');
    const handleColor: IBaseComponent = new BaseComponent(parent, 'p', 'card__handle-color');
    const isPopular: IBaseComponent = new BaseComponent(parent, 'p', 'card__popular');
    const price: IBaseComponent = new BaseComponent(parent, 'p', 'card__price');
    new BaseComponent(imageContainer.element, 'img', 'card__image', {
      alt: good.name,
      src: good.image,
    });
    title.element.textContent = good.name;
    this.title = good.name;
    type.element.textContent = `Type: ${good.type.slice(0, 1).toUpperCase() + good.type.slice(1)}`;
    manufacturer.element.textContent = `Manufacturer: ${
      good.manufacturer.slice(0, 1).toUpperCase() + good.manufacturer.slice(1)
    }`;
    weight.element.textContent = `Weight: ${good.weight} g`;
    blade.element.textContent = `Blade: ${good.blade} mm`;
    handleColor.element.textContent = `Handle color: ${good.hadnleColor}`;
    isPopular.element.textContent = `Popular: ${good.isPopular}`;
    price.element.textContent = `Price: ${good.price}$`;
  }
}
