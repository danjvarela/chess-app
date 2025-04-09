import { INode, resolve, customAttribute, bound } from "aurelia";
import interact from "interactjs";

type PositionOffsets = { x: number; y: number };

@customAttribute({ name: "draggable" })
export class Draggable {
  private element: HTMLElement = resolve(INode) as HTMLElement;
  private isDragged: boolean;
  private positionOffsetsBeforePickup: PositionOffsets;

  attached() {
    this.element.classList.add("ca:cursor-grab", "ca:active:cursor-grabbing");
    const currentPositionOffsets = this.getPositionOffsets(this.element);
    this.updatePositionOffsets(currentPositionOffsets, this.element);

    this.positionOffsetsBeforePickup = currentPositionOffsets;

    interact(this.element)
      .draggable({
        modifiers: [
          interact.modifiers.restrictRect({
            restriction: "parent",
          }),
        ],
        listeners: {
          start: this.ondragstart,
          move: this.ondragmove,
          end: this.ondragend,
        },
      })
      .on("down", this.onmousedown)
      .on("up", this.onmouseup)
      .on("contextmenu", (e) => e.preventDefault())
      .styleCursor(false);
  }

  @bound
  private ondragstart() {
    this.isDragged = true;
  }

  @bound
  private ondragmove(e: any) {
    const target = e.interactable.target;

    const currentOffsets = this.getPositionOffsets(target);

    const x = currentOffsets.x + e.dx;
    const y = currentOffsets.y + e.dy;

    this.updatePositionOffsets({ x, y }, target);
  }

  @bound
  private ondragend(e: any) {
    e.interactable.target.style.zIndex = "unset";

    const dropzone = e.relatedTarget;
    const draggedItem = e.target;

    const draggedItemRect = draggedItem.getBoundingClientRect();
    const dropzoneRect = dropzone.getBoundingClientRect();

    const currentOffsets = this.getPositionOffsets(draggedItem);

    const x = currentOffsets.x + dropzoneRect.x - draggedItemRect.x;
    const y = currentOffsets.y + dropzoneRect.y - draggedItemRect.y;

    this.updatePositionOffsets({ x, y }, draggedItem);
  }

  @bound
  private onmousedown(e: any) {
    if (e.button !== 0) return;
    this.positionOffsetsBeforePickup = this.getPositionOffsets(
      e.interactable.target,
    );
    this.moveCenterToCursor(e.interactable.target, e);
    e.interactable.target.style.zIndex = "9999";
  }

  @bound
  private onmouseup(e: any) {
    e.interactable.target.style.zIndex = "unset";

    if (!this.isDragged) {
      this.restorePositionOffsetsBeforePickup(e.interactable.target);
    }

    this.isDragged = false;
  }

  private restorePositionOffsetsBeforePickup(element: HTMLElement) {
    this.updatePositionOffsets(this.positionOffsetsBeforePickup, element);
  }

  private getPositionOffsets(element: HTMLElement): PositionOffsets {
    const style = getComputedStyle(element);
    const matrix = new DOMMatrixReadOnly(style.transform);

    let x = matrix.m41;
    let y = matrix.m42;

    if (isNaN(x)) x = 0;
    if (isNaN(y)) y = 0;

    return { x, y };
  }

  private updatePositionOffsets(
    value: { x: number; y: number },
    element: HTMLElement,
  ) {
    element.style.transform = `translate(${value.x}px, ${value.y}px)`;
  }

  private moveCenterToCursor(element: HTMLElement, event: any) {
    const currentOffsets = this.getPositionOffsets(element);

    const elementRect = element.getBoundingClientRect();

    const offsetX = event.clientX - elementRect.x - elementRect.width / 2;
    const offsetY = event.clientY - elementRect.y - elementRect.height / 2;

    const x = currentOffsets.x + offsetX;
    const y = currentOffsets.y + offsetY;

    this.updatePositionOffsets({ x, y }, element);
  }
}
