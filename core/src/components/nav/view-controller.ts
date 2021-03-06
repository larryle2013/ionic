
import { NavOptions, ViewState } from './nav-util';
import { assert } from '../../utils/helpers';
import { FrameworkDelegate, Nav } from '../..';
import { attachComponent } from '../../utils/framework-delegate';

/**
 * @name ViewController
 * @description
 * Access various features and information about the current view.
 * @usage
 *  ```ts
 * import { Component } from '@angular/core';
 * import { ViewController } from 'ionic-angular';
 *
 * @Component({...})
 * export class MyPage{
 *
 *   constructor(public viewCtrl: ViewController) {}
 *
 * }
 * ```
 */
export class ViewController {

  private _cntDir: any;
  private _leavingOpts: NavOptions;

  nav: Nav;
  _state: ViewState = ViewState.New;

  /** @hidden */
  id: string;
  element: HTMLElement;
  delegate: FrameworkDelegate;

  constructor(
    public component: any,
    public data: any
  ) {}

  /**
   * @hidden
   */
  async init(container: HTMLElement) {
    this._state = ViewState.Attached;

    if (!this.element) {
      const component = this.component;
      this.element = await attachComponent(this.delegate, container, component, ['ion-page', 'hide-page'], this.data);
    }
  }

  /**
   * @hidden
   */
  setLeavingOpts(opts: NavOptions) {
    this._leavingOpts = opts;
  }

  matches(id: string, params: any): boolean {
    if (this.component !== id) {
      return false;
    }
    const currentParams = this.data;
    const null1 = (currentParams == null);
    const null2 = (params == null);
    if (null1 !== null2) {
      return false;
    }
    if (null1 && null2) {
      return true;
    }

    const keysA = Object.keys(currentParams);
    const keysB = Object.keys(params);
    if (keysA.length !== keysB.length) {
      return false;
    }

    // Test for A's keys different from B.
    for (let i = 0; i < keysA.length; i++) {
      const key = keysA[i];
      if (currentParams[key] !== params[key]) {
        return false;
      }
    }
    return true;
  }

  /**
   * @hidden
   * DOM WRITE
   */
  _destroy() {
    assert(this._state !== ViewState.Destroyed, 'view state must be ATTACHED');

    const element = this.element;
    if (element) {
      if (this.delegate) {
        this.delegate.removeViewFromDom(element.parentElement, element);
      } else {
        element.remove();
      }
    }
    this.nav = this._cntDir = this._leavingOpts = null;
    this._state = ViewState.Destroyed;
  }

  /**
   * Get the index of the current component in the current navigation stack.
   * @returns {number} Returns the index of this page within its `NavController`.
   */
  get index(): number {
    return (this.nav ? this.nav.indexOf(this) : -1);
  }
}

export function isViewController(viewCtrl: any): viewCtrl is ViewController {
  return viewCtrl instanceof ViewController;
}
