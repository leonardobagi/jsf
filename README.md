# JSF
A small, yet powerful JS library to help with web development

# Why?
This package's purpose is to have nice features to help with all the kinds of issues programmers have, including HTTP requests management, observer and others utilities, while still avoiding legacy and obsolete features.

# Using
Download the source code and the latest version of TypeScript.
```
npm install typescript@latest
```

Bundle the code. The package already has a tsconfig, but you can still change it.
```
tsc
```

Now simply import the package using ES modules!
```js
import jsf, { RequestsManager } from "./jsf.js";

const calculator = jsf("div.calculator");

const manager = new RequestsManager();

manager.post("/api", { data: 123 }, { responseType: "document" });
```

# Documentation
I don't have any yet, but everything is in TypeScript and with JSDoc, so it can be really self-explanatory
