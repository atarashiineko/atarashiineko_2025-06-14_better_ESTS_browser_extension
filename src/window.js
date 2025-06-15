import { pf } from './prefix.js';

export class BaseWindow {
  constructor({
    title = '',
    width = 400,
    height = 300,
    minWidth = 200,
    minHeight = 150,
    initialX = 50,
    initialY = 50,
  } = {}) {
    this.title = title;
    this.size = { width, height };
    this.minSize = { width: minWidth, height: minHeight };
    this.position = { x: initialX, y: initialY };
    this.isOpen = false;
    this.el = null;
  }

  onRender(container) {
    container.textContent = 'Hello World';
  }

  onClose() {}

  show() {
    if (!this.el) {
      this.render();
    }
    if (!this.el.parentElement) {
      document.body.appendChild(this.el);
    }
    WindowManager.bringToFront(this);
    this.isOpen = true;
  }

  hide() {
    if (this.el && this.el.parentElement) {
      this.el.parentElement.removeChild(this.el);
    }
    this.isOpen = false;
  }

  close() {
    this.onClose();
    this.hide();
    WindowManager.unregister(this);
  }

  render() {
    const container = document.createElement('div');
    container.className = pf('custom-window');
    container.style.width = this.size.width + 'px';
    container.style.height = this.size.height + 'px';
    container.style.minWidth = this.minSize.width + 'px';
    container.style.minHeight = this.minSize.height + 'px';
    container.style.top = this.position.y + 'px';
    container.style.left = this.position.x + 'px';
    container.style.zIndex = WindowManager.nextZIndex();

    const header = document.createElement('div');
    header.className = pf('window-header');
    const title = document.createElement('span');
    title.className = pf('window-title');
    title.textContent = this.title;
    const closeBtn = document.createElement('button');
    closeBtn.className = pf('window-close-btn');
    closeBtn.textContent = '\u00D7';
    header.appendChild(title);
    header.appendChild(closeBtn);

    const content = document.createElement('div');
    content.className = pf('window-content');

    const resizer = document.createElement('div');
    resizer.className = pf('window-resizer');

    container.appendChild(header);
    container.appendChild(content);
    container.appendChild(resizer);

    closeBtn.addEventListener('click', () => this.close());
    header.addEventListener('mousedown', (e) => this.startDrag(e));
    resizer.addEventListener('mousedown', (e) => this.startResize(e));
    container.addEventListener('mousedown', () => WindowManager.bringToFront(this));

    this.el = container;
    this.contentEl = content;
    this.onRender(content);
  }

  startDrag(e) {
    e.preventDefault();
    const startX = e.clientX;
    const startY = e.clientY;
    const origX = this.position.x;
    const origY = this.position.y;
    const move = (ev) => {
      const dx = ev.clientX - startX;
      const dy = ev.clientY - startY;
      this.position.x = Math.max(0, origX + dx);
      this.position.y = Math.max(0, origY + dy);
      this.el.style.left = this.position.x + 'px';
      this.el.style.top = this.position.y + 'px';
    };
    const up = () => {
      document.removeEventListener('mousemove', move);
      document.removeEventListener('mouseup', up);
    };
    document.addEventListener('mousemove', move);
    document.addEventListener('mouseup', up);
  }

  startResize(e) {
    e.preventDefault();
    const startX = e.clientX;
    const startY = e.clientY;
    const origW = this.size.width;
    const origH = this.size.height;
    const move = (ev) => {
      let newW = origW + (ev.clientX - startX);
      let newH = origH + (ev.clientY - startY);
      newW = Math.max(this.minSize.width, newW);
      newH = Math.max(this.minSize.height, newH);
      this.size.width = newW;
      this.size.height = newH;
      this.el.style.width = newW + 'px';
      this.el.style.height = newH + 'px';
    };
    const up = () => {
      document.removeEventListener('mousemove', move);
      document.removeEventListener('mouseup', up);
    };
    document.addEventListener('mousemove', move);
    document.addEventListener('mouseup', up);
  }
}

export const WindowManager = {
  _windows: [],
  _z: 11000,
  nextZIndex() {
    this._z += 1;
    return this._z;
  },
  register(win) {
    if (!this._windows.includes(win)) {
      this._windows.push(win);
    }
  },
  unregister(win) {
    this._windows = this._windows.filter((w) => w !== win);
  },
  bringToFront(win) {
    win.el.style.zIndex = this.nextZIndex();
  },
  open(win) {
    this.register(win);
    win.show();
  },
};
