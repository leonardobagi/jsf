/**
 * Class to manage attributes
 */

export class AttributeManager {
    public constructor(public element: HTMLElement) {}

    /**
     * Adds an attribute to the element
     * @param name The name of the attribute
     * @param value The value of the attribute, if any
     * @returns {this}
     */
    add(name: string, value?: string): this {
        this.element.setAttribute(name, value ?? name);
        return this;
    }

    /**
     * Removes an attribute from the element
     * @param name The name of the attribute
     * @returns {this}
     */
    remove(name: string): this {
        this.element.removeAttribute(name);
        return this;
    }

    /**
     * Gets an attribute value
     * @param name The attribute name
     * @returns {string | null} The attribute value, or null if it doesn't exist
     */
    get(name: string): string | null {
        return this.element.getAttribute(name);
    }

    /**
     * Adds the attribute if it doesn't exist, otherwise add it.
     * @param name The attribute name
     *
     * @returns {this}
     */
    toggle(name: string): this;

    /**
     * Adds the attribute if it doesn't exist, otherwise add it.
     * @param name The attribute name
     * @param value The attribute value, if any.
     *
     * @returns {this}
     */
    toggle(name: string, value: string): this;
    toggle(name: string, value: string = ""): this {
        this.element.hasAttribute(name) ? this.element.removeAttribute(name) : this.element.setAttribute(name, value);
        return this;
    }

    /**
     * Returns true if the element contains the specified attributes
     * @param names
     * @returns {boolean} A boolean indicating whether all the attributes belong to the element
     */
    has(...names: string[]): boolean {
        return names.every(e => this.element.hasAttribute(e));
    }

    /**
     * Returns an array of objects (`{ name, value }[]`) of all the attributes of the element
     *
     * @type {NameAndValue[]}
     */
    public get all(): NameAndValue[] {
        return [...this.element.attributes].map(e => ({ name: e.name, value: e.value || undefined }));
    }
}
