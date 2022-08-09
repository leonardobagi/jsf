export class Observer {
    #observer: MutationObserver;
    #callbacks: { event: string; callback: Function }[] = [];

    /**
     * @param element The element to observe
     */
    public constructor(public element: HTMLElement) {
        this.#observer = new MutationObserver(mutations => {
            mutations.forEach(e => {
                if (e.type === "childList") this.emit("childListChange", [...e.addedNodes], [...e.removedNodes]);
                if (e.type === "attributes")
                    e.attributeName === "class"
                        ? this.emit("classNameChange", e.oldValue!.split(" "), [...element.classList])
                        : this.emit("attributeChange", e.attributeName!, e.oldValue!.split(" "), [...element.classList]);
            });
        });

        this.#observer.observe(element, {
            childList: true,
            subtree: true,
            attributes: true,
        });
    }

    /**
     * Binds a function to an event.
     * @param {keyof ObserverEvents} eventName The name of the event
     * @param {ObserverEventCallback} handler The function to bind
     * @returns {this}
     */
    public on<T extends keyof ObserverEvents>(eventName: T, handler: ObserverEventCallback<T>): this {
        this.#callbacks.push({ event: eventName, callback: handler });

        return this;
    }

    /**
     * Emits an event, running all the listeners of that event
     * @param {keyof ObserverEvents} eventName The name of the events
     * @param {...ObserverEvents[keyof ObserverEvents]} args The arguments of the callback
     * @returns
     */
    public emit<T extends keyof ObserverEvents>(eventName: T, ...args: ObserverEvents[T]): this {
        const callbacks = this.#callbacks.filter(e => e.event === eventName);

        callbacks.forEach(e => e.callback(...args));

        return this;
    }

    /**
     * Stops the observer.
     * @returns {this}
     */
    public stop(): this {
        this.#observer.disconnect();

        return this;
    }

    /**
     * Starts the observer.
     * @returns {this}
     */
    public start(): this {
        this.#observer.observe(this.element, { childList: true, subtree: true, attributes: true });
        return this;
    }

    public static isCustomEvent(event: string): event is keyof ObserverEvents {
        return ["childListChange", "classNameChange", "attributeChange"].includes(event);
    }

    public static isNotCustomEvent(event: string): event is keyof HTMLElementEventMap {
        return !this.isCustomEvent(event);
    }
}
