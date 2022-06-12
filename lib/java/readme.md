# Java SDK Polyfills

This folder contains Typescript implementations for certain Java SDK members. They are organized so that converted source code can access them with their normal SDK name (fully qualified), for instance `java.lang.Character`.

This is accomplished by create one file per SDK class, named after the last package ID part (e.g. `Character.ts`), which exports exactly that single class. This file is then imported in the index.ts file in that folder. The index.ts file itself is then re-exported again in another file in the same folder, whose name corresponds to the second last package ID part, here `lang.ts`, with the exported name `lang`.

This pattern is then used for all parent folders up to `java` and at the end makes all SDK classes + interfaces available with the single `java` import. It might look a bit long-winded using multiple imports and (re) exports, but it turned out to be the best way, since namespaces are discouraged (and namespace merging has its limits) and modules cannot be merged.

# Creating a New Polyfill

This chapter explains how to add a new SDK class from a new package, that isn't available yet in the library folder.

Assume you want to add the package class `java.awt.image.ColorModel`.

1. Start by creating the folder `awt` in `java` and the folder `image` in the new `awt` folder.
2. Create the files `index.ts` and `awt.ts` in `java/awt`.
3. Create the files `index.ts` and `image.ts` in `java/awt/image`.
4. Create your `ColorModel.ts` implementation and put it into `java/awt/image/`.
5. Add `import * from "ColorModel";` to the `index.ts` file in the same folder.
6. Add

```typescript
import * as image from "./index";

export { image };
```

to the `image.ts` file.

7. Add `export * from "./image/image";` to `java/awt/index.ts`.
8. Add

```typescript
import * as awt from "./index";

export { awt };
```

to the `awt.ts` file.

9. Add `export * from "./awt/awt";` to `java/index.ts`.

Obviously the folder creation and changes to `image.ts`, `awt.ts` and `java/index.ts` are one time tasks, as long as new TS files end up in existing folders. The only change which is always needed is to add a new class to the `index.ts` file in its folder.
