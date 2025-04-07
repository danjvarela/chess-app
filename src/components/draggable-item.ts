import { bound, INode, resolve } from "aurelia";
import interact from "interactjs";

export const X_OFFSET_TRACKER_ATTR = "data-pos-offset-x";
export const Y_OFFSET_TRACKER_ATTR = "data-pos-offset-y";

export class DraggableItem {
  ref: HTMLElement = resolve(INode) as HTMLElement;

  protected getPositionOffsets() {
    let x = parseFloat(this.ref.getAttribute(X_OFFSET_TRACKER_ATTR));
    let y = parseFloat(this.ref.getAttribute(Y_OFFSET_TRACKER_ATTR));

    if (isNaN(x)) x = 0;
    if (isNaN(y)) y = 0;

    return { x, y };
  }

  protected updatePositionOffsets(opts: { x: number; y: number }) {
    this.ref.setAttribute(X_OFFSET_TRACKER_ATTR, `${opts.x}`);
    this.ref.setAttribute(Y_OFFSET_TRACKER_ATTR, `${opts.y}`);
  }

  @bound
  onDragMove(e: any) {
    // moves the dragged item
    const target = e.target;

    const currentOffsets = this.getPositionOffsets();

    const x = currentOffsets.x + e.dx;
    const y = currentOffsets.y + e.dy;

    this.updatePositionOffsets({ x, y });

    target.style.transform = `translate(${x}px, ${y}px)`;
  }

  @bound
  onMousedown(e: any) {
    if (e.button !== 0) return;

    // moves the dragged item so that it's center is the current mouse position
    const target = e.interactable.target;
    const targetRect = target.getBoundingClientRect();

    const offsetX = e.clientX - targetRect.x - targetRect.width / 2;
    const offsetY = e.clientY - targetRect.y - targetRect.height / 2;

    const currentOffsets = this.getPositionOffsets();

    const x = currentOffsets.x + offsetX;
    const y = currentOffsets.y + offsetY;

    this.updatePositionOffsets({ x, y });

    target.style.transform = `translate(${x}px, ${y}px)`;
  }

  attached() {
    if (!this.ref) return;
    setTimeout(() => {
      interact(this.ref)
        .draggable({
          modifiers: [
            interact.modifiers.restrictRect({
              restriction: "parent",
            }),
          ],
          listeners: {
            move: this.onDragMove,
          },
        })
        .on("down", this.onMousedown)
        .on("contextmenu", (e) => e.preventDefault())
        .styleCursor(false);
    }, 0);
  }
}
