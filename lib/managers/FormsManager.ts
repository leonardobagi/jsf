export class FormsManager {
    public constructor(public form: HTMLFormElement) {}

    /**
     * Gets the values of the form inputs, mapped by their names.
     * If the input doesn't have a name, or is a `File` it will be skipped
     *
     * @returns {NameAndValue[]} `{name, value}[]`
     */
    public getValues(): NameAndValue[] {
        const values = [];

        for (const data of new FormData(this.form)) {
            if (data[1] instanceof File) continue;
            values.push({
                name: data[0],
                value: data[1],
            });
        }

        return values;
    }

    /**
     * Gets the files entered in the forms, mapped by the input name.
     *
     * @returns {{name: string; value: File}[]}
     */
    public getFiles(): { name: string; value: File }[] {
        const values = [];

        for (const data of new FormData(this.form)) {
            if (!(data[1] instanceof File)) continue;
            values.push({
                name: data[0],
                value: data[1],
            });
        }

        return values;
    }

    /**
     * Calls `.preventDefault` on submit event.
     *
     * @returns {this}
     */
    public preventDefault(): this {
        this.form.addEventListener("submit", e => e.preventDefault());
        return this;
    }

    /**
     * Clears all the inputs
     *
     * @returns {this}
     */
    public clear(): this {
        this.form.reset();
        return this;
    }

    /**
     * Submits the form
     *
     * @returns {this}
     */

    public submit(): this {
        this.form.submit();
        return this;
    }

    /**
     * The URL to send the data
     *
     * @type {string}
     */
    public get action(): string {
        return this.form.action;
    }

    /**
     * The method of the form
     *
     * @type {string}
     */
    public get method(): string {
        return this.form.method;
    }
}
