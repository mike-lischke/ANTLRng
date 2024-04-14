<img src="https://raw.githubusercontent.com/mike-lischke/mike-lischke/master/images/ANTLRng2.svg" title="ANTLR Next Generation" alt="ANTLRng" width="96" height="96"/><label style="font-size: 70%">Part of the Next Generation ANTLR Project</label>


# ANTLRng

This project is (actually: will be) a TypeScript port of the ANTLR tool, which is written in Java. And it will not only be a simple port, but a real next-generation tool. Currently this repository is rather a placeholder until important conditions are met, one of them being to have a full TypeScript runtime for the latest ANTLR4 version.

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

- Find a better solution for target specific code, e.g. by extending the ANTLR language with target specific named action blocks.
- Allow target authors to define new named actions, to avoid situations like for the current C++ target, with it's ugly action names.

### New Stuff

- Provide a language server framework, which allows creating a language server for any ANTLR grammar. This could specifically provide required highlighter information for VS Code (syntactic and semantic highlighers).

### Learn From Others

What can we learn from other parser generators? For example [tree-sitter](https://tree-sitter.github.io/tree-sitter/) has a concept of editing a parse tree, which internally will re-parse only the changed part (which is as close to incremental parsing as you can get). It also uses WebAssembly packages as loadable modules that fully handle a language. There's nothing like the ANTLR runtime in this concept. Debugging the parser could be tricky with that approach, however.
