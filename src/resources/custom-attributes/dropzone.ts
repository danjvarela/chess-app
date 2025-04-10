import {
  customAttribute,
  INode,
  resolve,
  bound,
  bindable,
  IContainer,
  Scope,
} from "aurelia";
import {
  convertToRenderLocation,
  CustomElement,
  CustomElementDefinition,
  ICustomElementController,
  IPlatform,
  ISyntheticView,
  ViewFactory,
} from "@aurelia/runtime-html";
import interact from "interactjs";
import { Interactable } from "@interactjs/core/Interactable";
import dropzoneHoverOverlayTemplate from "./dropzone-hover-overlay.html";
import dropzoneHintTemplate from "./dropzone-hint.html";

@customAttribute({ name: "dropzone", aliases: ["dropzone-for"] })
export class Dropzone {
  private element: HTMLElement = resolve(INode) as HTMLElement;

  @bindable accept: string | HTMLElement | undefined;

  private interact: Interactable | null = null;

  private hoverOverlayView: ISyntheticView;
  private hoverOverlayController: ICustomElementController<any>;

  private hintView: ISyntheticView;
  private hintController: ICustomElementController<any>;

  private platform: IPlatform = resolve(IPlatform);
  private diContainer = resolve(IContainer);

  attached() {
    if (!this.element) return;
    this.interact = interact(this.element);
  }

  detaching() {
    this.interact?.unset();
    this.removeOverlay();
  }

  protected acceptChanged(value: Dropzone["accept"]) {
    if (value) {
      this.interact = interact(this.element).dropzone({
        accept: value,
        ondragenter: this.ondragenter,
        ondragleave: this.ondragleave,
        ondrop: this.ondrop,
        ondropactivate: this.ondropactivate,
        ondropdeactivate: this.ondropdeactivate,
      });
    } else {
      this.interact?.unset();
    }
  }

  @bound
  private ondragenter(e: any) {
    this.showHoverOverlay(e.target);
  }

  @bound
  private ondragleave() {
    this.removeOverlay();
  }

  @bound
  private ondrop() {
    this.removeOverlay();
  }

  @bound
  private ondropactivate(e: any) {
    this.showDropHint(e.target);
  }

  @bound
  private ondropdeactivate() {
    this.removeHint();
  }

  private removeOverlay() {
    if (this.hoverOverlayView && this.hoverOverlayController) {
      this.hoverOverlayView.deactivate(
        this.hoverOverlayView,
        this.hoverOverlayController,
      );
    }
  }

  private removeHint() {
    if (this.hintView && this.hintController) {
      this.hintView.deactivate(this.hintView, this.hintController);
    }
  }

  private async showHoverOverlay(element: HTMLElement) {
    const template = this.platform.document.createElement("template");
    template.innerHTML = dropzoneHoverOverlayTemplate;
    element.appendChild(template);
    const renderLocation = convertToRenderLocation(template);
    const factory = new ViewFactory(
      this.diContainer,
      CustomElementDefinition.create({
        name: "dropzone-hover-overlay",
        template,
      }),
    );

    this.hoverOverlayController = CustomElement.for(element, {
      optional: true,
    });

    if (!this.hoverOverlayController) return;

    this.hoverOverlayView = factory
      .create(this.hoverOverlayController)
      .setLocation(renderLocation);

    const elementRect = element.getBoundingClientRect();

    const viewModel = {
      style: {
        top: `${elementRect.top}px`,
        left: `${elementRect.left}px`,
        width: `${elementRect.width}px`,
        height: `${elementRect.height}px`,
      },
    };

    await this.hoverOverlayView.activate(
      this.hoverOverlayView,
      this.hoverOverlayController,
      Scope.create(viewModel),
    );
  }

  private async showDropHint(element: HTMLElement) {
    const template = this.platform.document.createElement("template");
    template.innerHTML = dropzoneHintTemplate;
    element.appendChild(template);
    const renderLocation = convertToRenderLocation(template);
    const factory = new ViewFactory(
      this.diContainer,
      CustomElementDefinition.create({
        name: "dropzone-hint",
        template,
      }),
    );

    this.hintController = CustomElement.for(element, { optional: true });

    if (!this.hintController) return;

    this.hintView = factory
      .create(this.hintController)
      .setLocation(renderLocation);

    const elementRect = element.getBoundingClientRect();

    const viewModel = {
      style: {
        top: `${elementRect.top}px`,
        left: `${elementRect.left}px`,
        width: `${elementRect.width}px`,
        height: `${elementRect.height}px`,
      },
    };

    await this.hintView.activate(
      this.hintView,
      this.hintController,
      Scope.create(viewModel),
    );
  }
}
