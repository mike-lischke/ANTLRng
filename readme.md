[![CircleCI](https://circleci.com/gh/mike-lischke/a4tstool/tree/master.svg?style=svg)](https://circleci.com/gh/mike-lischke/a4tstool/tree/master)

# **ANTLRng**

This project is a TypeScript port of the ANTLR tool, which is written in Java. And it will not only be a simple port, but a real next-generation tool.

## Design Goals

- Strict separation of the tool and its runtimes, which simplifies the maintenance and releases of the tool a lot.
- Runtimes are completely handled by their owners, using a plugin system as used by many other tools.
- The new tool is supposed to run in web browsers, as well as in Node.js environments. No further dependency is required, beyond that (especially no Java).
  
The code currently does not fully compile (though the tests do). The code in the runtime folder was generated using the [java2ts tool](https://github.com/mike-lischke/java2typescript). Some of the files have already been cleaned up and, besides improving the java2ts converter, this will be the main task here, in the near future.
