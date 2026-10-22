import { viewportWidth } from './viewport';
export interface View { zoom: number; x: number; y: number }
interface Point { x: number; y: number }
const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));

export class Interaction {
  readonly view: View = { zoom: 1, x: viewportWidth() / 2, y: innerHeight / 2 };
  targetZoom = 1;
  private anchor: Point = { x: viewportWidth() / 2, y: innerHeight / 2 };
  private world: Point = { x: viewportWidth() / 2, y: innerHeight / 2 };
  private resetting = false;
  private contentWidth = viewportWidth();
  private contentHeight = innerHeight;
  private nativeScroll = window.scrollY;
  private pointers = new Map<number, Point>();
  private reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  onChange = () => {};

  constructor(canvas: HTMLCanvasElement) {
    window.addEventListener('wheel', (event) => {
      if (!event.ctrlKey) return;
      event.preventDefault();
      const delta = event.deltaY * (event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? innerHeight : 1);
      this.setZoom(this.targetZoom * Math.exp(-clamp(delta, -240, 240) * .004), event.clientX, event.clientY);
    }, { passive: false });
    canvas.addEventListener('dblclick', (event) => {
      event.preventDefault();
      this.setZoom(this.targetZoom * (event.shiftKey ? .5 : 2.5), event.clientX, event.clientY);
    });
    canvas.addEventListener('contextmenu', (event) => {
      event.preventDefault();
      this.setZoom(this.targetZoom / 2.5, event.clientX, event.clientY);
    });
    canvas.addEventListener('pointerdown', (event) => {
      if (event.button !== 0 || event.pointerType === 'touch') return;
      this.pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
      canvas.setPointerCapture(event.pointerId);
      canvas.classList.add('dragging');
      canvas.focus({ preventScroll: true });
    });
    canvas.addEventListener('pointermove', (event) => this.pointerMove(event));
    const release = (event: PointerEvent) => {
      this.pointers.delete(event.pointerId);
      if (!this.pointers.size) canvas.classList.remove('dragging');
    };
    canvas.addEventListener('pointerup', release);
    canvas.addEventListener('pointercancel', release);
    canvas.addEventListener('lostpointercapture', release);
    // Touch Events allow a two-finger pinch to start at 1x while preserving
    // native one-finger scrolling. Keep mouse/trackpad Pointer Events unchanged.
    let touches: Point[] = [];
    const points = (event: TouchEvent) => Array.from(event.touches, touch => ({ x: touch.clientX, y: touch.clientY }));
    canvas.addEventListener('touchstart', event => {
      touches = points(event);
      if (touches.length >= 2 || this.view.zoom > 1) event.preventDefault();
    }, { passive: false });
    canvas.addEventListener('touchmove', event => {
      const next = points(event);
      if (next.length === 2 && touches.length === 2) {
        event.preventDefault();
        const distance = (a: Point, b: Point) => Math.hypot(a.x - b.x, a.y - b.y);
        const before = distance(touches[0], touches[1]);
        const after = distance(next[0], next[1]);
        this.pan((next[0].x + next[1].x - touches[0].x - touches[1].x) / 2,
          (next[0].y + next[1].y - touches[0].y - touches[1].y) / 2);
        if (before > 0) this.setZoom(this.targetZoom * after / before,
          (next[0].x + next[1].x) / 2, (next[0].y + next[1].y) / 2);
      } else if (next.length === 1 && touches.length === 1 && this.view.zoom > 1) {
        event.preventDefault();
        this.pan(next[0].x - touches[0].x, next[0].y - touches[0].y);
      }
      touches = next;
    }, { passive: false });
    const releaseTouch = (event: TouchEvent) => { touches = points(event); };
    canvas.addEventListener('touchend', releaseTouch);
    canvas.addEventListener('touchcancel', releaseTouch);
    window.addEventListener('keydown', (event) => {
      if (event.defaultPrevented || event.ctrlKey || event.metaKey || event.altKey) return;
      if (event.target instanceof HTMLElement && event.target.closest('input, textarea, select, [contenteditable], #settings-popover')) return;
      if (['r', 'R', '0'].includes(event.key)) this.reset();
      else if (event.key === '+' || event.key === '=') this.setZoom(this.targetZoom * 1.6);
      else if (event.key === '-') this.setZoom(this.targetZoom / 1.6);
      else if (event.key.startsWith('Arrow') && this.view.zoom > 1) {
        event.preventDefault();
        this.pan(event.key === 'ArrowLeft' ? 50 : event.key === 'ArrowRight' ? -50 : 0,
          event.key === 'ArrowUp' ? 50 : event.key === 'ArrowDown' ? -50 : 0);
      }
    });
  }

  setZoom(zoom: number, x = viewportWidth() / 2, y = innerHeight / 2) {
    // Remember the source point under the cursor. Recompute the camera for each
    // damped zoom frame, so the point stays still throughout the whole animation.
    this.anchor = { x, y };
    this.world = {
      x: this.view.x + (x - viewportWidth() / 2) / this.view.zoom,
      y: this.view.y + (y - innerHeight / 2) / this.view.zoom,
    };
    this.targetZoom = clamp(zoom, 1, 2048);
    this.resetting = false;
    this.onChange();
  }

  setContentSize(width: number, height: number) {
    this.contentWidth = width;
    this.contentHeight = Math.max(innerHeight, height);
  }

  scrollTo(y: number) {
    const dy = (y - this.nativeScroll) / this.view.zoom;
    this.nativeScroll = y;
    this.view.y += dy;
    this.world.y += dy;
    this.resetting = false;
    this.bound();
    this.onChange();
  }

  private pan(dx: number, dy: number) {
    if (this.view.zoom === 1) {
      window.scrollBy({ top: -dy, behavior: 'instant' });
      return;
    }
    this.view.x -= dx / this.view.zoom;
    this.view.y -= dy / this.view.zoom;
    this.world.x -= dx / this.view.zoom;
    this.world.y -= dy / this.view.zoom;
    this.resetting = false;
    this.bound();
    this.onChange();
  }

  private pointerMove(event: PointerEvent) {
    const previous = this.pointers.get(event.pointerId);
    if (!previous) return;
    const before = [...this.pointers.values()];
    this.pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
    if (this.pointers.size === 2) {
      const after = [...this.pointers.values()];
      const distance = (a: Point, b: Point) => Math.hypot(a.x - b.x, a.y - b.y);
      const d0 = distance(before[0], before[1]);
      const d1 = distance(after[0], after[1]);
      this.pan((after[0].x + after[1].x - before[0].x - before[1].x) / 2,
        (after[0].y + after[1].y - before[0].y - before[1].y) / 2);
      if (d0 > 0) this.setZoom(this.targetZoom * d1 / d0, (after[0].x + after[1].x) / 2, (after[0].y + after[1].y) / 2);
    } else this.pan(event.clientX - previous.x, event.clientY - previous.y);
  }

  private bound() {
    const halfWidth = viewportWidth() / (2 * this.view.zoom);
    const halfHeight = innerHeight / (2 * this.view.zoom);
    const x = clamp(this.view.x, halfWidth, this.contentWidth - halfWidth);
    const y = clamp(this.view.y, halfHeight, this.contentHeight - halfHeight);
    this.world.x += x - this.view.x;
    this.world.y += y - this.view.y;
    this.view.x = x;
    this.view.y = y;
  }

  reset(immediate = false) {
    this.targetZoom = 1;
    this.resetting = true;
    this.nativeScroll = window.scrollY;
    if (immediate) Object.assign(this.view, { zoom: 1, x: viewportWidth() / 2, y: window.scrollY + innerHeight / 2 });
    this.onChange();
  }

  private syncNativeView() {
    this.nativeScroll = window.scrollY;
    this.view.x = viewportWidth() / 2;
    this.view.y = this.nativeScroll + innerHeight / 2;
    this.world = { x: this.view.x + this.anchor.x - viewportWidth() / 2, y: this.view.y + this.anchor.y - innerHeight / 2 };
    this.resetting = false;
  }

  resize(center?: Point) {
    if (this.view.zoom === 1 && this.targetZoom === 1) this.syncNativeView();
    else {
      // A new article snapshot may move the observed image or section after reflow.
      if (center) Object.assign(this.view, center);
      this.anchor = { x: viewportWidth() / 2, y: innerHeight / 2 };
      this.world = { x: this.view.x, y: this.view.y };
      this.bound();
    }
    this.onChange();
  }

  update(dt: number) {
    if (this.view.zoom === 1 && this.targetZoom === 1) {
      // Native scrolling owns the position, including momentum between scroll events.
      this.syncNativeView();
      return false;
    }
    const factor = this.reducedMotion.matches ? 1 : 1 - Math.exp(-dt * 13);
    // Log-space damping feels equally responsive at 1x and 1000x, independent of FPS.
    const logError = Math.log(this.targetZoom / this.view.zoom);
    this.view.zoom *= Math.exp(logError * factor);
    if (Math.abs(logError) < .00001) this.view.zoom = this.targetZoom;
    if (this.resetting) {
      this.view.x += (viewportWidth() / 2 - this.view.x) * factor;
      this.view.y += (window.scrollY + innerHeight / 2 - this.view.y) * factor;
    } else {
      this.view.x = this.world.x - (this.anchor.x - viewportWidth() / 2) / this.view.zoom;
      this.view.y = this.world.y - (this.anchor.y - innerHeight / 2) / this.view.zoom;
    }
    this.bound();
    if (this.view.zoom === 1 && this.targetZoom === 1) {
      // Write once when zooming out, never during steady native scrolling.
      if (!this.resetting) window.scrollTo({ top: this.view.y-innerHeight/2, behavior: 'instant' });
      this.syncNativeView();
    }
    const cameraMoving = this.resetting && (Math.abs(this.view.x - viewportWidth() / 2) + Math.abs(this.view.y - window.scrollY - innerHeight / 2) > .001);
    return this.view.zoom !== this.targetZoom || cameraMoving;
  }
}
