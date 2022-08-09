export {};

declare global {
    type Awaitable<T> = T | Promise<T>;

    interface NameAndValue {
        name: string;
        value?: string;
    }

    type CSSDisplay = "grid" | "flex" | "block" | "inline";

    interface InsertElementOptions {
        /** Where to insert the new string */
        where: "before" | "after" | "first" | "last";
        /** The HTML string or element to insert */
        html: string | HTMLElement;
    }

    interface InsertOnSiblingElementOptions {
        /** Where to insert the new string */
        where: "beforeChildren" | "afterChildren";
        /** The HTML string or element to insert */
        html: string | HTMLElement;
        /**  Selector or numeric index to insert the element before or after */
        target: number | string;
    }

    type AnyInsertElementOptions = InsertElementOptions | InsertOnSiblingElementOptions;

    type ParseResponseType = "json" | "arrayBuffer" | "text" | "document" | "blob" | "formData";

    interface RequestOptions extends Omit<RequestInit, "body"> {
        responseType?: ParseResponseType;
    }

    interface JSFRequestParameters<T = any> {
        res: Response;
        data: T;
        options: Partial<RequestOptionsAndBody>;
    }

    interface RequestOptionsAndBody extends RequestOptions {
        body: any;
    }

    interface ObserverEvents {
        childListChange: [addedElements: Node[], removedElements: Node[]];
        classNameChange: [oldValue: string[], newValue: string[]];
        attributeChange: [attributeName: string, oldValue: string[], newValue: string[]];
    }

    type ObserverEventCallback<T extends keyof ObserverEvents = keyof ObserverEvents> = (...args: ObserverEvents[T]) => any;

    type HTMLElementListener<T extends keyof HTMLElementEventMap = keyof HTMLElementEventMap> = (
        this: HTMLElement,
        args: HTMLElementEventMap[T]
    ) => Awaitable<void>;

    type AnyEventCallback<
        T extends keyof ObserverEvents | keyof HTMLElementEventMap = keyof ObserverEvents | keyof HTMLElementEventMap
    > = T extends keyof ObserverEvents
        ? ObserverEventCallback<T>
        : T extends keyof HTMLElementEventMap
        ? HTMLElementListener<T>
        : never;
}
