import { IGood, IBaseComponent, ISettings, ILocalStorage } from '../../types/types';
import { BaseComponent } from '../base-component/base-component';
import 'nouislider/dist/nouislider.css';
import './settings.scss';
import noUiSlider, { target } from 'nouislider';
import { conctants } from '../../constants/constants';
import { LocalStorage } from '../local-storage/local-storage';

const SLIDER_MARGIN: number = 1;
const SLIDER_STEP: number = 1;

export class Settings extends BaseComponent implements ISettings {
  private readonly localStorage: ILocalStorage = new LocalStorage();

  public readonly searcher: IBaseComponent;

  public readonly manufacturerFilters: IBaseComponent[];

  public readonly sorter: IBaseComponent;

  public readonly typeFilters: IBaseComponent[];

  public readonly handleColorFilters: IBaseComponent[];

  public readonly isPopularFilter: IBaseComponent;

  public readonly resetFiltersButton: IBaseComponent;

  public readonly resetSettingsButton: IBaseComponent;

  public rangeByWeight: target;

  public rangeByBlade: target;

  constructor(
    parent: HTMLElement,
    private goods: IGood[],
    tag: keyof HTMLElementTagNameMap = 'div',
    className: string = '',
    attributes: { [key: string]: string } = {}
  ) {
    super(parent, tag, className, attributes);
    this.searcher = this.createSearcher();
    this.manufacturerFilters = this.createManufacturerFilters(this.goods);
    this.sorter = this.createSorter();
    this.rangeByWeight = this.createRange(this.goods, 'weight');
    this.rangeByBlade = this.createRange(this.goods, 'blade');
    this.typeFilters = this.createTypeFilters(this.goods);
    this.handleColorFilters = this.createHandleColorFilters(this.goods);
    this.isPopularFilter = this.createAvailabilityFilter();
    [this.resetFiltersButton, this.resetSettingsButton] = this.createResetButtons();
  }

  private createSearcher(): IBaseComponent {
    const searcher: IBaseComponent = new BaseComponent(
      this.element,
      'input',
      'settings__search settings__item',
      {
        autocomplete: 'off',
        type: 'search',
        placeholder: 'Search',
      }
    );
    if (this.localStorage.search) {
      (searcher.element as HTMLInputElement).value = this.localStorage.search;
    }
    searcher.element.focus();
    searcher.element.addEventListener('input', (): void => {
      searcher.element.classList.add('not-empty');
      if (!(searcher.element as HTMLInputElement).value) {
        searcher.element.classList.remove('not-empty');
      }
    });
    return searcher;
  }

  private createManufacturerFilters(goods: IGood[]): IBaseComponent[] {
    const manufactures: string[] = [
      ...new Set(goods.map((good: IGood): string => good.manufacturer)),
    ];
    const filters: BaseComponent[] = [];
    const container: BaseComponent = new BaseComponent(
      this.element,
      'div',
      'settings__manufacturer settings__item manufacturer'
    );
    const title: IBaseComponent = new BaseComponent(container.element, 'h3', 'settings__title');
    const list: IBaseComponent = new BaseComponent(container.element, 'ul', 'manufacturer__items');
    title.element.textContent = 'Manufacturer';
    manufactures.forEach((item: string): void => {
      const li: IBaseComponent = new BaseComponent(list.element, 'li', '');
      const filter: IBaseComponent = new BaseComponent(
        li.element,
        'button',
        `manufacturer__item manufacturer__item_${item.toLowerCase()}`,
        {
          title: `${item}`,
        }
      );
      if (
        this.localStorage.manufacturers.find(
          (manufacturer: string): boolean => manufacturer === item
        )
      ) {
        filter.element.classList.add(conctants.NAME_OF_CHECKED_CLASS);
      }
      filter.element.addEventListener('click', (): boolean =>
        filter.element.classList.toggle(conctants.NAME_OF_CHECKED_CLASS)
      );
      filters.push(filter);
    });
    return filters;
  }

  private createSorter(): IBaseComponent {
    const items: { [key: string]: string } = {
      byNameToEnd: 'By name from "A" to "Z"',
      byNameToStart: 'By name from "Z" to "A"',
      byWeightToMax: 'By weight to max',
      byWeightToMin: 'By weight to min',
    };
    const container: BaseComponent = new BaseComponent(
      this.element,
      'div',
      'settings__sorting settings__item sorting'
    );
    const title: IBaseComponent = new BaseComponent(container.element, 'h3', 'settings__title');
    const selectionList: IBaseComponent = new BaseComponent(
      container.element,
      'select',
      'sorting__select'
    );
    title.element.textContent = 'Sorting';
    Object.entries(items).forEach(([selection, textContent]: [string, string]): void => {
      const option: IBaseComponent = new BaseComponent(selectionList.element, 'option', '', {
        value: selection,
      });
      if (this.localStorage.select === selection) {
        option.element.setAttribute('selected', '');
      }
      option.element.textContent = textContent;
    });
    return selectionList;
  }

  private createTypeFilters(goods: IGood[]): IBaseComponent[] {
    const types: string[] = [...new Set(goods.map((good: IGood): string => good.type))];
    const filters: BaseComponent[] = [];
    const container: BaseComponent = new BaseComponent(
      this.element,
      'div',
      'settings__type settings__item type'
    );
    const title: IBaseComponent = new BaseComponent(container.element, 'h3', 'settings__title');
    const list: IBaseComponent = new BaseComponent(container.element, 'ul', 'type__items');
    title.element.textContent = 'Type';
    types.forEach((item: string): void => {
      const li: IBaseComponent = new BaseComponent(list.element, 'li', 'type__item');
      const input: HTMLInputElement = new BaseComponent(li.element, 'input', '', {
        type: 'checkbox',
        name: 'type',
        id: `${item}`,
      }).element as HTMLInputElement;
      const label: IBaseComponent = new BaseComponent(li.element, 'label', '', {
        for: `${item}`,
      });
      label.element.textContent = item.slice(0, 1).toUpperCase() + item.slice(1);
      if (this.localStorage.types.find((type: string): boolean => type === item)) {
        label.element.classList.add(conctants.NAME_OF_CHECKED_CLASS);
      }
      label.element.addEventListener('click', (): void => {
        this.toggleItemCheckedStatus(label, input);
      });
      filters.push(label);
    });
    return filters;
  }

  private createHandleColorFilters(goods: IGood[]): IBaseComponent[] {
    const colors: string[] = [...new Set(goods.map((good: IGood): string => good.hadnleColor))];
    const filters: BaseComponent[] = [];
    const container: BaseComponent = new BaseComponent(
      this.element,
      'div',
      'settings__color settings__item color'
    );
    const title: IBaseComponent = new BaseComponent(container.element, 'h3', 'settings__title');
    const list: IBaseComponent = new BaseComponent(container.element, 'ul', 'color__items');
    title.element.textContent = 'Handle color';
    colors.forEach((item: string): void => {
      const li: IBaseComponent = new BaseComponent(
        list.element,
        'li',
        `color__item color__item_${item}`
      );
      const input: HTMLInputElement = new BaseComponent(li.element, 'input', '', {
        type: 'checkbox',
        name: 'color',
        id: `${item}`,
      }).element as HTMLInputElement;
      const label: IBaseComponent = new BaseComponent(li.element, 'label', '', {
        for: `${item}`,
        title: `${item.slice(0, 1).toUpperCase() + item.slice(1)}`,
      });
      if (this.localStorage.colors.find((color: string): boolean => color === item)) {
        label.element.classList.add(conctants.NAME_OF_CHECKED_CLASS);
      }
      label.element.addEventListener('click', (): void => {
        this.toggleItemCheckedStatus(label, input);
      });
      filters.push(label);
    });
    return filters;
  }

  private createAvailabilityFilter(): IBaseComponent {
    const container: BaseComponent = new BaseComponent(
      this.element,
      'div',
      'settings__popular settings__item popular'
    );
    const title: IBaseComponent = new BaseComponent(container.element, 'h3', 'settings__title');
    const input: HTMLInputElement = new BaseComponent(container.element, 'input', '', {
      type: 'checkbox',
      name: 'popular',
      id: 'popular',
    }).element as HTMLInputElement;
    const label: IBaseComponent = new BaseComponent(container.element, 'label', '', {
      for: 'popular',
      title: 'Only popular',
    });
    title.element.textContent = 'Only popular';
    if (this.localStorage.isPopular) {
      label.element.classList.add(conctants.NAME_OF_CHECKED_CLASS);
    }
    label.element.addEventListener('click', (): void => {
      this.toggleItemCheckedStatus(label, input);
    });
    return label;
  }

  private createResetButtons(): IBaseComponent[] {
    const container: BaseComponent = new BaseComponent(
      this.element,
      'div',
      'settings__reset settings__item reset'
    );
    const resetFiltersButton: IBaseComponent = new BaseComponent(
      container.element,
      'button',
      'reset__btn'
    );
    const resetSettingsButton: IBaseComponent = new BaseComponent(
      container.element,
      'button',
      'reset__btn'
    );
    resetFiltersButton.element.textContent = 'Reset filters';
    resetSettingsButton.element.textContent = 'Reset settings';
    return [resetFiltersButton, resetSettingsButton];
  }

  private createRange(goods: IGood[], param: 'weight' | 'blade'): target {
    const container: IBaseComponent = new BaseComponent(
      this.element,
      'div',
      `settings__${param} settings__item ${param}`
    );
    const title: IBaseComponent = new BaseComponent(container.element, 'h3', 'settings__title');
    const range: target = new BaseComponent(container.element, 'div', '').element;
    const rangeResults: IBaseComponent = new BaseComponent(
      container.element,
      'div',
      'range__results-container'
    );
    const rangeResultsLow: IBaseComponent = new BaseComponent(
      rangeResults.element,
      'span',
      'range__results_low'
    );
    const rangeResultsHigh: IBaseComponent = new BaseComponent(
      rangeResults.element,
      'span',
      'range__results_high'
    );
    const [minParam, maxParam]: number[] = [
      Math.min(...goods.map((good: IGood): number => good[param])),
      Math.max(...goods.map((good: IGood): number => good[param])),
    ];
    noUiSlider.create(range, {
      start: [minParam, maxParam],
      connect: true,
      margin: SLIDER_MARGIN,
      step: SLIDER_STEP,
      range: {
        min: minParam,
        max: maxParam,
      },
      format: {
        to: (value: number): number => parseInt(String(value)),
        from: (value: string): number => parseInt(value),
      },
    });
    if (param === 'weight') {
      title.element.textContent = param.slice(0, 1).toUpperCase() + param.slice(1) + ', g';
    } else {
      title.element.textContent = param.slice(0, 1).toUpperCase() + param.slice(1) + ', mm';
    }
    if (param === 'weight' && this.localStorage.weights.length) {
      range.noUiSlider?.set(this.localStorage.weights);
    } else if (param === 'blade' && this.localStorage.blades.length) {
      range.noUiSlider?.set(this.localStorage.blades);
    }
    if (range.noUiSlider) {
      range.noUiSlider.on('update', (values: (string | number)[]): void => {
        rangeResultsHigh.element.textContent = `${values[1]}`;
        rangeResultsLow.element.textContent = `${values[0]}`;
      });
    }
    return range;
  }

  public resetSettingsToDefault(): void {
    (this.searcher.element as HTMLInputElement).value = '';
    this.manufacturerFilters.forEach((manufacturer: IBaseComponent): void => {
      this.removeCheckedClass(manufacturer.element);
    });
    this.handleColorFilters.forEach((color: IBaseComponent): void => {
      this.removeCheckedClass(color.element);
    });
    this.typeFilters.forEach((type: IBaseComponent): void => {
      this.removeCheckedClass(type.element);
    });
    this.isPopularFilter.element.classList.remove(conctants.NAME_OF_CHECKED_CLASS);
    this.rangeByBlade.noUiSlider?.set(this.calculateBorderValues('blade'));
    this.rangeByWeight.noUiSlider?.set(this.calculateBorderValues('weight'));
  }

  public resetSettings(): void {
    this.localStorage.clear();
    this.resetSettingsToDefault();
  }

  private toggleItemCheckedStatus(label: IBaseComponent, input: HTMLInputElement): void {
    label.element.classList.toggle(conctants.NAME_OF_CHECKED_CLASS);
    input.checked = label.element.classList.contains(conctants.NAME_OF_CHECKED_CLASS);
  }

  private removeCheckedClass(element: HTMLElement): void {
    element.classList.remove(conctants.NAME_OF_CHECKED_CLASS);
  }

  private calculateBorderValues(property: 'blade' | 'weight'): number[] {
    return [
      Math.min(...this.goods.map((good: IGood): number => good[property])),
      Math.max(...this.goods.map((good: IGood): number => good[property])),
    ];
  }
}
