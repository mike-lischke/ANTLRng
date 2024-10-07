[![GitHub Workflow Status (with event)](https://img.shields.io/github/actions/workflow/status/mike-lischke/ANTLRng/nodejs.yml?style=for-the-badge&logo=github)](https://github.com/mike-lischke/ANTLRng/actions/workflows/nodejs.yml)

<img src="https://raw.githubusercontent.com/mike-lischke/mike-lischke/master/images/ANTLRng2.svg" title="ANTLR Next Generation" alt="ANTLRng" width="96" height="96"/><label style="font-size: 70%">Part of the Next Generation ANTLR Project</label>


# ANTLRng

This project is a TypeScript port of the ANTLR tool (originally written in Java) and is still work-in-progress. It implements own mechanisms to work with ANTLR grammars, works in browsers and generally moves away from its Java centric roots.

## Status

See the [milestone 3](https://github.com/mike-lischke/ANTLRng/issues/10) for the current status and the plan.

## Design Goals

- Strict separation of the tool and its runtimes, which simplifies the maintenance and releases of the tool a lot.
- Runtimes are completely handled by their owners, using a plugin system as used by many other tools, and are no longer part of the tool.
- The new tool is supposed to run in web browsers, as well as in Node.js environments. No further dependency is required, beyond that (especially no Java).
- The ANTLR language and the tool are developed further, to make it more powerful and easier to use (see next chapter).
- Remove dependency on ANTLR3.
- Replace the rather generic string template system by a type safe template engine, which provides inline code hints, to simplify writing target language mappers.

## Feature Ideas

### Grammars

- Rework the import feature. Allow paths for the imports and allow to override imported rules. Make diamond imports working properly.
- Allow specifying a config file for tool runs, instead only individual command line parameters.
- Allow generating files for multiple grammars in their own target folders (good for mass production like needed in the runtime tests).
- Allow specifying user defined prefixes/postfixes for generated methods (from parser/lexer rules) or allow a complete own pattern.

### Optimizations

- Save/load state to lower cold start time.
- Code optimizations (like converting recursions to iterations in the prediction code path).
- Remove token classes/interfaces (Token, CommonToken, WritableToken) and introduce a compact representation as a series of uin32 numbers, that save space and can be shared more easily (e.g. in web workers or WebAssembly). Put custom token text in a string pool. Introduce helper methods which create the expected string representation of a token.
- Convert all pure data holder classes to interfaces (e.g. SimState).
- Make classes that are often used in hash sets/maps immutable, so we can cache hash codes for them (examples: Interval(Set), ATNConfig, ATNConfigSet).

### Target Specific Ideas

This is a tricky field and not easy to re-design. The original decision to allow target (language) specific code in a grammar made (and makes) sharing/reusing grammars very difficult. Below are some ideas:

- Find a better solution for target specific code, e.g. by extending the ANTLR language with target specific named action blocks.
- Even better: disallow any target specific code:
    - Simple (unnamed) actions can be implemented in a base class as alt enter and exit listener methods (requires to label alts).
    - For predicates introduce a small and simple expression syntax, which uses mappings defined in the language template. This is not as flexible as the current solution, but sometimes less is more.
    - No longer support rule parameters, init values and return values. They are rarely used and create a too tight connection to the generated code. Additionally, they prevent further development of the code generator (maybe at some point it is no longer meaningful to generate plain methods?).
- Allow target authors to define new named actions, to avoid situations like for the current C++ target, with its ugly action names.
    - Even better: avoid named actions altogether, but they are very useful for including copyrights, headers and class specific code. This is probably the most difficult feature to re-design. Possible solutions are:
        - Support a very simple macro syntax in the grammar to allow replacing text blocks which are read from an external file (which then can contain target specific code etc.). This would also lower duplication (like the same copyright in different generated files).

Maybe we can take all this a step further by defining "language packs", a single file or a collection of files for a specific target language, which is automatically picked up by the ANTLRng tool to generate target specific code.

### New Stuff

- Provide a language server framework, which allows creating a language server for any ANTLR grammar. This could specifically provide required highlighter information for VS Code (syntactic and semantic highlighers).

### Learn From Others

What can we learn from other parser generators? For example [tree-sitter](https://tree-sitter.github.io/tree-sitter/) has a concept of editing a parse tree, which internally will re-parse only the changed part (which is as close to incremental parsing as you can get). It also uses WebAssembly packages as loadable modules that fully handle a language. There's nothing like the ANTLR runtime in this concept. Debugging the parser could be tricky with that approach, however.
