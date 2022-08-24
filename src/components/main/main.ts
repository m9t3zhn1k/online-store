import { BaseComponent } from '../base-component/base-component';
import { Cards } from '../cards/cards';
import { Settings } from '../settings/settings';
import { Filtration } from '../filtration/filtration';
import {
  IBaseComponent,
  ICards,
  ICart,
  IFilterElements,
  IFiltration,
  IGood,
  ILocalStorage,
  IMain,
  ISettings,
} from '../../types/types';
import './main.scss';
import { LocalStorage } from '../local-storage/local-storage';

export class Main extends BaseComponent implements IMain {
  public settings: ISettings;

  public cards: ICards;

  public readonly localStorage: ILocalStorage = new LocalStorage();

  private readonly filtration: IFiltration;

  constructor(
    parent: HTMLElement,
    private readonly goods: IGood[],
    public cart: ICart,
    tag: keyof HTMLElementTagNameMap = 'div',
    className: string = ''
  ) {
    super(parent, tag, className);
    const container: HTMLElement = new BaseComponent(
      this.element,
      'div',
      'main__container container'
    ).element;
    this.settings = new Settings(container, goods, 'section', 'main__settings settings');
    this.cards = new Cards(container, cart, 'section', 'main__cards cards');
    this.filtration = new Filtration(goods);
    this.renderCardsSection();
    this.addEventListenersToElements();
  }

  private addEventListenersToElements(): void {
    this.settings.searcher.element.addEventListener('input', this.renderCardsSection.bind(this));

    this.addEventListenersToFilters(this.settings.manufacturerFilters);

    this.addEventListenersToFilters(this.settings.handleColorFilters);

    this.addEventListenersToFilters(this.settings.typeFilters);

    this.settings.isPopularFilter.element.addEventListener(
      'click',
      this.renderCardsSection.bind(this)
    );

    this.settings.sorter.element.addEventListener('change', this.renderCardsSection.bind(this));

    this.settings.rangeByWeight.noUiSlider?.on('slide', this.renderCardsSection.bind(this));

    this.settings.rangeByBlade.noUiSlider?.on('slide', this.renderCardsSection.bind(this));

    this.settings.resetFiltersButton.element.addEventListener('click', (): void => {
      this.settings.resetSettingsToDefault();
      this.renderCardsSection();
    });

    this.settings.resetSettingsButton.element.addEventListener('click', (): void => {
      this.resetSettings();
      this.cart.content = [];
      location.reload();
    });
  }

  private renderCardsSection(): void {
    const filters: IFilterElements = {
      search: this.settings.searcher,
      manufacturers: this.settings.manufacturerFilters,
      handleColors: this.settings.handleColorFilters,
      types: this.settings.typeFilters,
      popular: this.settings.isPopularFilter,
      sorting: this.settings.sorter,
      rangeByWeight: this.settings.rangeByWeight,
      rangeByBlade: this.settings.rangeByBlade,
    };
    this.filtration.filterByAll(filters);
    this.cards.updateCards(this.filtration.filteredGoods);
    if (!this.filtration.filteredGoods.length) {
      this.cards.element.textContent = 'Matches not found...';
    }
  }

  private addEventListenersToFilters(filters: IBaseComponent[]): void {
    filters.forEach((filter: IBaseComponent): void => {
      filter.element.addEventListener('click', this.renderCardsSection.bind(this));
    });
  }

  private resetSettings(): void {
    this.cart.value.element.textContent = `${this.cart.content.length}`;
    this.settings.resetSettings();
  }
}
