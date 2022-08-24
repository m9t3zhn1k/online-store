import { IGood, IFooter, IHeader, IApplication, IMain } from '../types/types';
import { Header } from './header/header';
import { Footer } from './footer/footer';
import { Main } from './main/main';
import goodsJson from '../goods.json';

export class Application implements IApplication {
  public readonly header: IHeader;

  public readonly main: IMain;

  public readonly footer: IFooter;

  private readonly goods: IGood[] = goodsJson;

  constructor() {
    this.header = new Header(document.body, 'header', 'header');
    this.main = new Main(document.body, this.goods, this.header.cart, 'main', 'main');
    this.footer = new Footer(document.body, 'footer', 'footer');
  }
}
