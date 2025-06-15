import { BaseWindow } from './window.js';

export class AppWindow extends BaseWindow {
  constructor(options = {}) {
    options.title = options.title || 'My App';
    super(options);
  }

  onRender(container) {
    super.onRender(container);
  }
}
