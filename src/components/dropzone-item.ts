import { INode, resolve, bindable, bound } from "aurelia";
import interact from "interactjs";
import { DropzoneOptions } from "@interactjs/actions/drop/plugin";
import { X_OFFSET_TRACKER_ATTR, Y_OFFSET_TRACKER_ATTR } from "./draggable-item";

export class DropzoneItem {
  ref: HTMLElement = resolve(INode) as HTMLElement;
  isDragover: boolean = false;
  @bindable accept: DropzoneOptions["accept"];

  @bound
  onDragenter() {
    this.isDragover = true;
  }

  @bound
  onDragleave() {
    this.isDragover = false;
  }

  @bound
  onDrop(e: any) {
    const thisDropzoneRect = e.target.getBoundingClientRect();
    const draggableItemRect = e.relatedTarget.getBoundingClientRect();

    const offsetX = thisDropzoneRect.x - draggableItemRect.x;
    const offsetY = thisDropzoneRect.y - draggableItemRect.y;

    const currentPositionOffsetX = parseFloat(
      e.relatedTarget.getAttribute(X_OFFSET_TRACKER_ATTR),
    );
    const currentPositionOffsetY = parseFloat(
      e.relatedTarget.getAttribute(Y_OFFSET_TRACKER_ATTR),
    );

    if (isNaN(currentPositionOffsetY) || isNaN(currentPositionOffsetY)) return;

    const x = currentPositionOffsetX + offsetX;
    const y = currentPositionOffsetY + offsetY;

    e.relatedTarget.setAttribute(X_OFFSET_TRACKER_ATTR, `${x}`);
    e.relatedTarget.setAttribute(Y_OFFSET_TRACKER_ATTR, `${y}`);
    e.relatedTarget.style.transform = `translate(${x}px, ${y}px)`;

    this.isDragover = false;
  }

  attached() {
    if (!this.ref) return;

    this.ref.style.position = "relative";

    setTimeout(() => {
      if (!this.accept) return;

      interact(this.ref).dropzone({
        accept: this.accept,
        // overlap: 0.75,
        ondragenter: this.onDragenter,
        ondragleave: this.onDragleave,
        ondrop: this.onDrop,
      });
    }, 0);
  }
}
