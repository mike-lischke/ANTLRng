[![CircleCI](https://circleci.com/gh/mike-lischke/a4tstool/tree/master.svg?style=svg)](https://circleci.com/gh/mike-lischke/a4tstool/tree/master)

<img src="https://raw.githubusercontent.com/mike-lischke/mike-lischke/master/images/ANTLRng2.svg" title="ANTLR Next Generation" alt="ANTLRng" width="96" height="96"/><label style="font-size: 70%">Part of the Next Generation ANTLR Project</label>


# ANTLRng 

This project is a TypeScript port of the ANTLR tool, which is written in Java. And it will not only be a simple port, but a real next-generation tool.

## Design Goals

- Strict separation of the tool and its runtimes, which simplifies the maintenance and releases of the tool a lot.
- Runtimes are completely handled by their owners, using a plugin system as used by many other tools, and are no longer part of the tool.
- The new tool is supposed to run in web browsers, as well as in Node.js environments. No further dependency is required, beyond that (especially no Java).
- The ANTLR language and the tool are developed further, to make it more powerful and easier to use. Ideas are:
  - Rework the import feature. Allow paths for the imports and allow to override imported rules. Make diamond imports working properly.
  - Export rules as ATN network and railroad diagram SVG files.
  - ...

The code currently does not fully compile (though the tests do). The code in the runtime folder was generated using the [java2ts tool](https://github.com/mike-lischke/java2typescript). Some of the files have already been cleaned up and, besides improving the java2ts converter, this will be the main task here, in the near future.
