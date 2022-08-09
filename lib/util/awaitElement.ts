/**
 * Waits for an element to exist.
 *
 * @param selector The selector to wait.
 *
 * @returns {Promise<Element>} A promise resolving to the element when it exists.
 */
export default (selector: string): Promise<Element> =>
    new Promise(resolve => {
        if (document.querySelector(selector)) resolve(document.querySelector(selector)!);
        const observer = new MutationObserver(() => {
            if (document.querySelector(selector)) {
                observer.disconnect();
                resolve(document.querySelector(selector)!);
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true,
        });
    });
