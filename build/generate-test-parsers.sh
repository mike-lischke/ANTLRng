
  printf "\x1b[1m\x1b[34mGenerating test parsers...\x1b[0m\n\n"

  antlr4ng -Dlanguage=TypeScript -visitor -Xexact-output-dir -o ./runtime-testsuite/generated ./runtime-testsuite/resources/grammars/*.g4

  printf "done\n\n"
