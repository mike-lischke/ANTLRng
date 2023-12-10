<img src="https://raw.githubusercontent.com/mike-lischke/mike-lischke/master/images/ANTLRng2.svg" title="ANTLR Next Generation" alt="ANTLRng" width="96" height="96"/><label style="font-size: 70%">Part of the Next Generation ANTLR Project</label>


# ANTLRng

This project is (actually: will be) a TypeScript port of the ANTLR tool, which is written in Java. And it will not only be a simple port, but a real next-generation tool. Currently this repository is rather a placeholder until important conditions are met, one of them being to have a full TypeScript runtime for the latest ANTLR4 version.

## Status

See the [current milestone](https://github.com/mike-lischke/ANTLRng/issues/9) for the current status and the plan.

## Design Goals

- Strict separation of the tool and its runtimes, which simplifies the maintenance and releases of the tool a lot.
- Runtimes are completely handled by their owners, using a plugin system as used by many other tools, and are no longer part of the tool.
- The new tool is supposed to run in web browsers, as well as in Node.js environments. No further dependency is required, beyond that (especially no Java).
- The ANTLR language and the tool are developed further, to make it more powerful and easier to use (see next chapter).
- Remove dependency on ANTLR3.
- Replace the rather generic string template system by a type safe template engine, which provides inline code hints, to simplify writing target language mappers.

## Other Ideas

- Rework the import feature. Allow paths for the imports and allow to override imported rules. Make diamond imports working properly.
- Export rules as ATN network and railroad diagram SVG files.
- Save/load state to lower cold start time.
- Code optimizations (like converting recursions to iterations in the prediction code path).
- Find a better solution for target specific code, e.g. by extending the ANTLR language with target specific named action blocks.
- ...


There is currently no code to compile. Once the initial TypeScript runtime is available this repo will start off by providing a TS port of the ANTLR4 runtime tests.
