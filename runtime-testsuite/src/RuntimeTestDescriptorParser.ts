/* java2ts: keep */

/*
 * Copyright (c) 2012-2022 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { IRuntimeTestDescriptor, GrammarType } from "./types.js";

export class RuntimeTestDescriptorParser {
    private static readonly sections = new Set([
        "notes", "type", "grammar", "slaveGrammar", "start", "input", "output", "errors", "flags", "skip",
    ]);

    /**
     * Read stuff like:
     * [grammar]
     * grammar T;
     * s @after {<DumpDFA()>}
     * : ID | ID {} ;
     * ID : 'a'..'z'+;
     * WS : (' '|'\t'|'\n')+ -> skip ;
     *
     * [grammarName]
     * T
     *
     * [start]
     * s
     *
     * [input]
     * abc
     *
     * [output]
     * Decision 0:
     * s0-ID->:s1^=>1
     *
     * [errors]
     * """line 1:0 reportAttemptingFullContext d=0 (s), input='abc'
     * """
     *
     * Some can be missing like [errors].
     *
     * Get gr names automatically "lexer grammar Unicode;" "grammar T;" "parser grammar S;"
     *
     * Also handle slave grammars:
     *
     * [grammar]
     * grammar M;
     * import S,T;
     * s : a ;
     * B : 'b' ; // defines B from inherited token space
     * WS : (' '|'\n') -> skip ;
     *
     * [slaveGrammar]
     * parser grammar T;
     * a : B {<writeln("\"T.a\"")>};<! hidden by S.a !>
     *
     * [slaveGrammar]
     * parser grammar S;
     * a : b {<writeln("\"S.a\"")>};
     * b : B;
     *
     * @param name tbd
     * @param text tbd
     * @param path tbd
     *
     * @returns The new RuntimeTestDescriptor.
     */
    public static parse(name: string, text: string, path: string): IRuntimeTestDescriptor {
        let currentField = null;
        let currentValue = "";

        const pairs: Array<[string, string | null]> = [];
        const lines = text.split(/\r?\n/);

        for (const line of lines) {
            let newSection = false;
            let sectionName = null;
            if (line.startsWith("[") && line.length > 2) {
                sectionName = line.substring(1, line.length - 1);
                newSection = RuntimeTestDescriptorParser.sections.has(sectionName);
            }

            if (newSection) {
                if (currentField !== null) {
                    pairs.push([currentField, currentValue]);
                }
                currentField = sectionName;
                currentValue = "";
            } else {
                currentValue += line + "\n";
            }
        }
        pairs.push([currentField ?? "", currentValue]);

        let notes = "";
        let testType = GrammarType.Lexer;
        let grammar = "";
        let grammarName = "";
        const slaveGrammars: Array<[string, string]> = [];
        let startRule = "";
        let input = "";
        let output = "";
        let errors = "";
        let showDFA = false;
        let showDiagnosticErrors = false;
        let traceATN = false;
        let predictionMode = "LL";
        let buildParseTree = true;
        let skipTargets: Set<string> | undefined;
        for (const p of pairs) {
            const section = p[0];
            let value = "";
            if (p[1] !== null) {
                value = p[1].trim();
            }
            if (value.startsWith("\"\"\"")) {
                value = value.replace(/"""/g, "");
            } else {
                if (value.indexOf("\n") >= 0) {
                    value = value + "\n"; // if multi line and not quoted, leave \n on end.
                }
            }

            switch (section) {
                case "notes": {
                    notes = value;
                    break;
                }

                case "type": {
                    testType = GrammarType[value as keyof typeof GrammarType];
                    break;
                }

                case "grammar": {
                    grammarName = RuntimeTestDescriptorParser.getGrammarName(value.split("\n")[0]);
                    grammar = value;
                    break;
                }

                case "slaveGrammar": {
                    const grammarName = RuntimeTestDescriptorParser.getGrammarName(value.split("\n")[0]);
                    slaveGrammars.push([grammarName, value]);
                    break; // In the Java code there's no break here, but I think there should be.
                }

                case "start": {
                    startRule = value;
                    break;
                }

                case "input": {
                    input = value;
                    break;
                }

                case "output": {
                    output = value;
                    break;
                }

                case "errors": {
                    errors = value;
                    break;
                }

                case "flags": {
                    const flags = value.split("\n");
                    for (const f of flags) {
                        const parts = f.split("=", 2);
                        switch (parts[0]) {
                            case "showDFA": {
                                showDFA = true;
                                break;
                            }

                            case "showDiagnosticErrors": {
                                showDiagnosticErrors = true;
                                break;
                            }

                            case "traceATN": {
                                traceATN = true;
                                break;
                            }

                            case "predictionMode": {
                                predictionMode = parts[1];
                                break;
                            }

                            case "notBuildParseTree": {
                                buildParseTree = false;
                                break;
                            }

                            default:

                        }
                    }
                    break;
                }

                case "skip": {
                    skipTargets = new Set(value.split("\n"));
                    break;
                }

                default: {
                    throw new Error("Unknown descriptor section ignored: " + section);
                }

            }
        }

        return {
            testType, name, notes, input, output, errors, startRule, grammarName, grammar,
            slaveGrammars, showDiagnosticErrors, traceATN, showDFA, predictionMode, buildParseTree, skipTargets, path,
        };
    }

    /**
     * Get A, B, or C from:
     * "lexer grammar A;" "grammar B;" "parser grammar C;"
     * @param grammarDeclLine tbd
     * @returns tbd
     */
    private static getGrammarName(grammarDeclLine: string): string {
        let gi = grammarDeclLine.indexOf("grammar ");
        if (gi < 0) {
            return "<unknown grammar name>";
        }
        gi += "grammar ".length;
        const index = grammarDeclLine.indexOf(";");

        return grammarDeclLine.substring(gi, index);
    }
}
