import { conctants } from '../../constants/constants';
import { ICard, ICards, ICart, IGood, ILocalStorage, UpdateCardsGeneric } from '../../types/types';
import { BaseComponent } from '../base-component/base-component';
import { Card } from '../card/card';
import { LocalStorage } from '../local-storage/local-storage';
import './cards.scss';

export class Cards extends BaseComponent implements ICards {
  public cards: ICard[] = [];

  private readonly localStorage: ILocalStorage = new LocalStorage();

  constructor(
    parent: HTMLElement,
    private readonly cart: ICart,
    tag: keyof HTMLElementTagNameMap = 'div',
    className: string = '',
    attributes = {}
  ) {
    super(parent, tag, className, attributes);
  }

  public createCards(goods: IGood[]): ICard[] {
    this.clearCards();
    const cards: ICard[] = [];
    goods.forEach((good: IGood): void => {
      const isSavedCard: string | undefined = this.localStorage.cart.find(
        (name: string): boolean => name === good.name
      );
      const oldCard: ICard | undefined = this.cart.content.find(
        (card: ICard): boolean => card.title === good.name
      );
      if (oldCard) {
        cards.push(oldCard);
        this.element.append(oldCard.element);
        return;
      }
      const newCard: ICard = new Card(
        this.element,
        good,
        'div',
        `card ${isSavedCard ? conctants.NAME_OF_CHECKED_CLASS : ''}`,
        {}
      );
      if (isSavedCard) {
        this.cart.content.push(newCard);
      }
      newCard.element.addEventListener('click', (): void => {
        this.cart.addItemToCart(newCard);
      });
      cards.push(newCard);
    });
    return cards;
  }

  public clearCards(): void {
    this.cards = [];
    this.element.innerHTML = '';
  }

  public updateCards: UpdateCardsGeneric<IGood> = (goods): void => {
    this.clearCards();
    this.cards = this.createCards(goods);
  };
}
