import { customAttribute, INode, resolve, bound, bindable } from "aurelia";
import interact from "interactjs";

@customAttribute({ name: "dropzone", aliases: ["dropzone-for"] })
export class Dropzone {
  private element: HTMLElement = resolve(INode) as HTMLElement;
  @bindable private accept: string | HTMLElement;

  attached() {
    if (!this.element) return;

    interact(this.element).dropzone({
      accept: this.accept,
      ondragenter: this.ondragenter,
      ondragleave: this.ondragleave,
      ondrop: this.ondrop,
    });
  }

  @bound
  private ondragenter(e: any) {
    const target = e.target;
    const targetRect = target.getBoundingClientRect();

    const overlay = document.createElement("div");
    Object.assign(overlay.style, {
      position: "fixed",
      backgroundColor: `color-mix(in oklab, var(--ca-color-amber-200) 45%, transparent)`,
      top: `${targetRect.top}px`,
      left: `${targetRect.left}px`,
      width: `${targetRect.width}px`,
      height: `${targetRect.height}px`,
    });
    overlay.classList.add("dropzone-hover-overlay");

    target.appendChild(overlay);
  }

  @bound
  private ondragleave(e: any) {
    this.removeOverlay(e.target);
  }

  @bound
  private ondrop(e: any) {
    this.removeOverlay(e.target);
  }

  private removeOverlay(element: HTMLElement) {
    element.querySelector(".dropzone-hover-overlay").remove();
  }
}
