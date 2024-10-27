# Copyright (c) Mike Lischke. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

printf "\x1b[1m\x1b[34mGenerating tool parsers...\x1b[0m\n\n"

antlr4ng -Dlanguage=TypeScript -no-visitor -no-listener -Xexact-output-dir -o ./src/generated ./src/grammars/ActionSplitter.g4
antlr4ng -Dlanguage=TypeScript -no-visitor -no-listener -Xexact-output-dir -o ./src/generated ./src/grammars/LexBasic.g4
antlr4ng -Dlanguage=TypeScript -no-visitor -no-listener -Xexact-output-dir -o ./src/generated ./src/grammars/ANTLRv4Lexer.g4
antlr4ng -Dlanguage=TypeScript -visitor -no-listener -Xexact-output-dir -o ./src/generated ./src/grammars/ANTLRv4Parser.g4

printf "done\n\n"
