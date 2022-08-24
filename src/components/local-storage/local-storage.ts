import { ILocalStorage } from '../../types/types';

export class LocalStorage implements ILocalStorage {
  public search: string = '';

  public select: string = '';

  public manufacturers: string[] = [];

  public colors: string[] = [];

  public types: string[] = [];

  public isPopular: boolean = false;

  public weights: string[] = [];

  public blades: string[] = [];

  public cart: string[] = [];

  constructor() {
    const storage = localStorage.getItem('storage');
    this.search = storage ? JSON.parse(storage)?.search : '';
    this.select = storage ? JSON.parse(storage)?.select : '';
    this.isPopular = storage ? JSON.parse(storage)?.isPopular : false;
    this.manufacturers = storage ? JSON.parse(storage)?.manufacturers : [];
    this.colors = storage ? JSON.parse(storage)?.colors : [];
    this.types = storage ? JSON.parse(storage)?.types : [];
    this.weights = storage ? JSON.parse(storage)?.weights : [];
    this.blades = storage ? JSON.parse(storage)?.blades : [];
    this.cart = storage ? JSON.parse(storage)?.cart : [];
  }

  public save(): void {
    localStorage.setItem('storage', JSON.stringify(this));
  }

  public clear(): void {
    localStorage.removeItem('storage');
    localStorage.clear();
  }

  public setToDefault(): void {
    this.search = '';
    this.manufacturers = [];
    this.colors.length = 0;
    this.types.length = 0;
    this.weights.length = 0;
    this.blades.length = 0;
    this.cart.length = 0;
    this.isPopular = false;
  }
}
