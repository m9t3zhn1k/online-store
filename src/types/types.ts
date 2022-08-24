import { target } from 'nouislider';

export interface IApplication {
  readonly header: IHeader;
  readonly main: IMain;
  readonly footer: IFooter;
}

export interface IBaseComponent {
  element: HTMLElement;
}

export type IFooter = IBaseComponent;

export interface IHeader extends IBaseComponent {
  readonly cart: ICart;
}

export interface IMain extends IBaseComponent {
  settings: ISettings;
  cards: ICards;
  cart: ICart;
  readonly localStorage: ILocalStorage;
}

export interface ILocalStorage {
  search: string;
  select: string;
  manufacturers: string[];
  colors: string[];
  types: string[];
  isPopular: boolean;
  weights: string[];
  blades: string[];
  cart: string[];
  save(): void;
  clear(): void;
  setToDefault(): void;
}

export interface ICart extends IBaseComponent {
  value: IBaseComponent;
  content: ICard[];
  readonly localStorage: ILocalStorage;
  addItemToCart(item: ICard): void;
  removeItemFromCart(item: ICard): void;
}

export interface ICards extends IBaseComponent {
  cards: ICard[];
  createCards(goods: IGood[]): ICard[];
  clearCards(): void;
  updateCards(goods: IGood[]): void;
}

export interface ICard extends IBaseComponent {
  title: string;
}

export interface IGood {
  readonly name: string;
  readonly manufacturer: string;
  readonly price: number;
  readonly weight: number;
  readonly blade: number;
  readonly type: string;
  readonly hadnleColor: string;
  readonly isPopular: boolean;
  readonly description?: string;
  readonly image: string;
}

export interface IFiltration {
  filteredGoods: IGood[];
  filterByAll({}: IFilterElements): void;
}

export interface ISettings {
  readonly searcher: IBaseComponent;
  readonly manufacturerFilters: IBaseComponent[];
  readonly sorter: IBaseComponent;
  readonly typeFilters: IBaseComponent[];
  readonly handleColorFilters: IBaseComponent[];
  readonly isPopularFilter: IBaseComponent;
  readonly resetFiltersButton: IBaseComponent;
  readonly resetSettingsButton: IBaseComponent;
  rangeByWeight: target;
  rangeByBlade: target;
  resetSettings(): void;
  resetSettingsToDefault(): void;
}

export type UiSliderResult = [number, number];

export type IConctants = {
  NAME_OF_CHECKED_CLASS: string;
  MAX_ITEMS_IN_CART: number;
  REQUIRED_SHUFFLE: number;
  NOT_REQUIRED_SHUFFLE: number;
};

export interface IFilterElements {
  search: IBaseComponent;
  manufacturers: IBaseComponent[];
  handleColors: IBaseComponent[];
  types: IBaseComponent[];
  popular: IBaseComponent;
  sorting: IBaseComponent;
  rangeByWeight: target;
  rangeByBlade: target;
}

export type UpdateCardsGeneric<T> = (elements: T[]) => void;
