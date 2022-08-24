import {
  IFilterElements,
  IFiltration,
  IGood,
  ILocalStorage,
  UiSliderResult,
} from '../../types/types';
import { IBaseComponent } from '../../types/types';
import { target } from 'nouislider';
import { conctants } from '../../constants/constants';
import { LocalStorage } from '../local-storage/local-storage';

export class Filtration implements IFiltration {
  private readonly localStorage: ILocalStorage = new LocalStorage();

  public filteredGoods: IGood[] = [];

  constructor(private readonly goods: IGood[]) {}

  public filterByAll(filters: IFilterElements): void {
    const {
      search,
      manufacturers,
      handleColors,
      types,
      popular,
      sorting,
      rangeByWeight,
      rangeByBlade,
    } = filters;
    this.filteredGoods = this.filterByName(this.goods, search);
    this.filteredGoods = this.filterByManufacturer(this.filteredGoods, manufacturers);
    this.filteredGoods = this.filterByHandleColor(this.filteredGoods, handleColors);
    this.filteredGoods = this.filterByType(this.filteredGoods, types);
    this.filteredGoods = this.filterByPopular(this.filteredGoods, popular);
    this.filteredGoods = this.filterByWeight(this.filteredGoods, rangeByWeight);
    this.filteredGoods = this.filterByBlade(this.filteredGoods, rangeByBlade);
    this.sortGoods(this.filteredGoods, (sorting.element as HTMLInputElement).value);
    this.saveFilterSettings(filters);
  }

  private saveFilterSettings({
    search,
    manufacturers,
    handleColors,
    types,
    popular,
    sorting,
    rangeByWeight,
    rangeByBlade,
  }: IFilterElements): void {
    this.localStorage.search = (search.element as HTMLInputElement).value;
    this.localStorage.isPopular = popular.element.classList.contains(
      conctants.NAME_OF_CHECKED_CLASS
    );
    this.localStorage.select = (sorting.element as HTMLSelectElement).value;
    this.localStorage.manufacturers = this.saveCheckedFilterElements(manufacturers, 'manufacturer');
    this.localStorage.colors = this.saveCheckedFilterElements(handleColors, 'color');
    this.localStorage.types = this.saveCheckedFilterElements(types, 'type');
    const [minW, maxW]: number[] = rangeByWeight.noUiSlider?.get(true) as UiSliderResult;
    this.localStorage.weights = [`${minW}`, `${maxW}`];
    const [minB, maxB]: Array<number> = rangeByBlade.noUiSlider?.get(true) as UiSliderResult;
    this.localStorage.blades = [`${minB}`, `${maxB}`];
    this.localStorage.save();
  }

  private saveCheckedFilterElements(
    goods: IBaseComponent[],
    typeOfFilter: 'manufacturer' | 'color' | 'type'
  ): string[] {
    return goods.map((item: IBaseComponent): string => {
      if (item.element.classList.contains(conctants.NAME_OF_CHECKED_CLASS)) {
        switch (typeOfFilter) {
          case 'manufacturer':
            return item.element.getAttribute('title') || '';
          case 'color':
            return item.element.getAttribute('title')?.toLowerCase() || '';
          case 'type':
            return item.element.textContent?.toLowerCase() || '';
        }
      }
      return '';
    });
  }

  private filterByName(goods: IGood[], search: IBaseComponent): IGood[] {
    return goods.filter(
      (item: IGood): number =>
        ~item.name.toLowerCase().indexOf((search.element as HTMLInputElement).value.toLowerCase())
    );
  }

  private filterByManufacturer(goods: IGood[], manufacturers: IBaseComponent[]): IGood[] {
    return this.filterByParam(goods, manufacturers, 'manufacturer');
  }

  private filterByHandleColor(goods: IGood[], colors: IBaseComponent[]): IGood[] {
    return this.filterByParam(goods, colors, 'color');
  }

  private filterByType(goods: IGood[], types: IBaseComponent[]): IGood[] {
    return this.filterByParam(goods, types, 'type');
  }

  private filterByParam(
    goods: IGood[],
    items: IBaseComponent[],
    typeOfFilter: 'manufacturer' | 'color' | 'type'
  ): IGood[] {
    const checkedItems: IBaseComponent[] = items.filter(
      (item: IBaseComponent): IBaseComponent | undefined => {
        if (item.element.classList.contains(conctants.NAME_OF_CHECKED_CLASS)) {
          return item;
        }
      }
    );
    if (checkedItems.length) {
      return goods.filter((item: IGood): boolean =>
        checkedItems.some((type: IBaseComponent): boolean => {
          switch (typeOfFilter) {
            case 'manufacturer':
              return (
                type.element.getAttribute('title')?.toLowerCase() ===
                item.manufacturer.toLowerCase()
              );
            case 'color':
              return (
                type.element.getAttribute('title')?.toLowerCase() === item.hadnleColor.toLowerCase()
              );
            case 'type':
              return type.element.getAttribute('for')?.toLowerCase() === item.type.toLowerCase();
          }
        })
      );
    }
    return goods;
  }

  private filterByPopular(goods: IGood[], popular: IBaseComponent): IGood[] {
    const checkedPopular: boolean = popular.element.classList.contains(
      conctants.NAME_OF_CHECKED_CLASS
    );
    if (checkedPopular) {
      return goods.filter((item: IGood): boolean => item.isPopular);
    }
    return goods;
  }

  private sortGoods(goods: IGood[], value: string): IGood[] {
    switch (value) {
      case 'byNameToEnd':
        goods.sort((a: IGood, b: IGood): number =>
          a.name > b.name ? conctants.REQUIRED_SHUFFLE : conctants.NOT_REQUIRED_SHUFFLE
        );
        break;
      case 'byNameToStart':
        goods.sort((a: IGood, b: IGood): number =>
          a.name < b.name ? conctants.REQUIRED_SHUFFLE : conctants.NOT_REQUIRED_SHUFFLE
        );
        break;
      case 'byWeightToMax':
        goods.sort((a: IGood, b: IGood): number => a.weight - b.weight);
        break;
      case 'byWeightToMin':
        goods.sort((a: IGood, b: IGood): number => b.weight - a.weight);
        break;
    }
    return goods;
  }

  private filterByWeight(goods: IGood[], range: target): IGood[] {
    const [min, max]: number[] = range.noUiSlider?.get(true) as UiSliderResult;
    return goods.filter((item: IGood): boolean => item.weight >= min && item.weight <= max);
  }

  private filterByBlade(goods: IGood[], range: target): IGood[] {
    const [min, max]: number[] = range.noUiSlider?.get(true) as UiSliderResult;
    return goods.filter((item: IGood): boolean => item.blade >= min && item.blade <= max);
  }
}
