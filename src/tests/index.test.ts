/**
 * @jest-environment jsdom
 */

import { BaseComponent } from '../components/base-component/base-component';
import { LocalStorage } from '../components/local-storage/local-storage';
import { conctants } from '../constants/constants';
import { IBaseComponent, ILocalStorage } from '../types/types';

const parent: HTMLElement = document.createElement('div');
const tag: keyof HTMLElementTagNameMap = 'div';
const className: string = 'test';
const testObjCorrect: { [value: string]: string } = {
  NAME_OF_CHECKED_CLASS: 'checked',
};
const testObjWrong: { [value: string]: string } = {
  NAME_OF_CHECKED_CLASS: '',
};

test("matches if the actual object contains { NAME_OF_CHECKED_CLASS: 'checked' }", (): void => {
  expect(conctants).toEqual(expect.objectContaining(testObjCorrect));
});

test("matches if the actual object does not contain { NAME_OF_CHECKED_CLASS: '' }", (): void => {
  expect(conctants).toEqual(expect.not.objectContaining(testObjWrong));
});

test("matches if the actual object contains property 'element'", (): void => {
  const component: IBaseComponent = new BaseComponent(parent, tag, className);
  expect(component).toHaveProperty('element');
});

test("matches if the actual element is the instance of 'HTMLElement' class", (): void => {
  const component: IBaseComponent = new BaseComponent(parent, tag, className);
  expect(component.element).toBeInstanceOf(HTMLElement);
});

test('matches if the actual element is not null', (): void => {
  const component: IBaseComponent = new BaseComponent(parent, tag, className);
  expect(component.element).not.toBeNull();
});

test('matches if the "clear" method of actual object returns undefined', (): void => {
  const storage: ILocalStorage = new LocalStorage();
  expect(storage.clear()).toBeUndefined();
});

test("matches if the actual object's property equals to values from localStorage", (): void => {
  const storage: ILocalStorage = new LocalStorage();
  storage.colors = ['testColor'];
  localStorage.setItem('storage', JSON.stringify({ colors: ['testColor'] }));
  expect(storage.colors).toEqual(JSON.parse(localStorage.getItem('storage') ?? '').colors);
});

test("matches if the actual element's classes containes expected class", (): void => {
  const component: IBaseComponent = new BaseComponent(parent, tag, className);
  expect(component.element.className).toEqual(expect.stringContaining('test'));
});

test("matches if the actual element's tagname equals input tagname", (): void => {
  const component: IBaseComponent = new BaseComponent(parent, tag, className);
  expect(component.element.tagName).toBe(tag.toUpperCase());
});

test("matches if the actual element's parentElement exists", (): void => {
  const component: IBaseComponent = new BaseComponent(parent, tag, className);
  expect(component.element.parentElement).toEqual(expect.anything());
});
