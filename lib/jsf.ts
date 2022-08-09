import { AttributeManager } from "./managers/AttributeManager.js";
import { Observer } from "./observer.js";

/**
 *
 * @param element The element or selector to get
 */

export function jsf(element: HTMLElement): JSFElement;
/**
 *
 * @param element The element or selector to get
 * @param required Whether to throw an error if the element was not found
 */

export function jsf(element: string, required?: boolean): JSFElement | null;

/**
 *
 * @param element The element or selector to get
 * @param required Whether to throw an error if the element was not found
 */

export function jsf(element: string, required: true): JSFElement;
export function jsf(element: string | HTMLElement, required?: boolean): JSFElement | null {
    const el = typeof element === "string" ? document.querySelector(element) : element instanceof HTMLElement ? element : null;

    if (!el && required) throw new TypeError("Specified element does not exist");
    if (!(el instanceof HTMLElement)) throw new TypeError("Specified element is not a HTMLElement");

    return el ? new JSFElement(el) : null;
}

export class JSFElement {
    /**
     * @param {HTMLElement} html The original DOM element.
     */
    public constructor(public html: HTMLElement) {}

    /**
     * The element attributes.
     *
     * @type {AttributeManager}
     */
    public attributes: AttributeManager = new AttributeManager(this.html);

    #observer!: Observer;

    /**
     * The element's tag name.
     *
     * @type {string}
     */
    public get tagName(): string {
        return this.html.tagName;
    }

    /**
     * The string representation of this HTML element and its children.
     *
     * @type {string}
     */
    public get htmlString(): string {
        return this.html.outerHTML;
    }

    /**
     * The text of the element and its children.
     *
     * @type {string}
     */
    public get text(): string {
        return this.html.innerText;
    }

    /**
     * A `JSFElement` array for each children of this element.
     * If an element is not an instance of HTMLElement, it will be skipped.
     *
     * @type {JSFElement[]}
     */
    public get children(): JSFElement[] {
        return (<HTMLElement[]>[...this.html.children].filter(e => e instanceof HTMLElement)).map(e => new JSFElement(e));
    }

    /**
     * Returns the closest sibling matching the specified selector.
     * Returns null if no element is found.
     *
     * @returns {JSFElement | null}
     */
    public closest(selector: string): JSFElement | null {
        const element = this.html.closest(selector);

        if (!element) return null;

        if (!(element instanceof HTMLElement)) throw new TypeError("Specified selector does not target a HTMLElement");

        return new JSFElement(element);
    }

    /**
     * Returns the first children matching the selector
     * Returns null if no element is found.
     *
     * @returns {JSFElement | null}
     */
    public closestChild(selector: string): JSFElement | null {
        const element = this.html.querySelector(":scope " + selector);

        if (!element) return null;

        if (!(element instanceof HTMLElement)) throw new TypeError("Specified selector does not target a HTMLElement");

        return new JSFElement(element);
    }

    /**
     * Binds a function to an event of this element.
     * @param event The event name. It can be either an event of the `Observer` class of a native HTML event.
     * @param handler The function to bind. It can be either a callback of the `Observer` class of a native HTML callback.
     *
     * @returns {this}
     */
    public on<T extends keyof ObserverEvents>(event: T, handler: ObserverEventCallback<T>): this;
    public on<T extends keyof HTMLElementEventMap>(event: T, handler: HTMLElementListener<T>): this;
    public on<T extends keyof HTMLElementEventMap | keyof ObserverEvents>(event: T, handler: AnyEventCallback<T>): this {
        if (Observer.isCustomEvent(event)) {
            if (!this.#observer) this.#observer = new Observer(this.html);

            this.#observer.on(event, handler as ObserverEventCallback);
        } else if (Observer.isNotCustomEvent(event)) this.html.addEventListener(event, handler as HTMLElementListener);

        return this;
    }

    /**
     * Clicks this element.
     *
     * @returns {this}
     */
    public click(): this {
        this.html.click();
        return this;
    }

    /**
     * Inserts an element inside, before or after this element.
     * @param options An object specifying the necessary data to insert this element.
     * @returns {this}
     */
    public insertElement(options: AnyInsertElementOptions): this {
        const html =
            typeof options.html === "string"
                ? [...new DOMParser().parseFromString(options.html, "text/html").body.children]
                : [options.html];

        if (options.where.endsWith("Children")) {
            const target = (options as InsertOnSiblingElementOptions).target;

            const sibling = typeof target === "string" ? document.querySelector(":scope " + target) : this.html.children[target];

            if (!sibling) throw new TypeError("Specified sibling does not exist");

            const position = options.where === "afterChildren" ? "beforeend" : "afterbegin";

            for (const element of html) element.insertAdjacentElement(position, element);
        } else {
            const position: InsertPosition = (() => {
                switch (options.where) {
                    case "after":

                    case "before":
                        return "beforebegin";

                    case "first":
                        return "afterbegin";

                    case "last":
                        return "beforeend";

                    default:
                        return "beforeend";
                }
            })();

            for (const element of html) element.insertAdjacentElement(position, element);
        }

        return this;
    }

    /**
     * Hides or shows an element
     * @param display The `display` css property to use.
     */
    public toggleVisibility(display?: CSSDisplay): this;
    public toggleVisibility(display?: string): this;
    public toggleVisibility(display: string = "block"): this {
        this.html.style.display = this.html.style.display === "none" ? display : "none";
        return this;
    }
}
