/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */



import { BlankActionSplitterListener } from "./BlankActionSplitterListener.js";
import { ActionSniffer } from "./ActionSniffer.js";
import { ActionSplitterListener } from "../parse/ActionSplitterListener.js";
import { Alternative } from "../tool/Alternative.js";
import { Grammar } from "../tool/Grammar.js";
import { LexerGrammar } from "../tool/LexerGrammar.js";
import { Rule } from "../tool/Rule.js";
import { ActionAST } from "../tool/ast/ActionAST.js";
import { GrammarAST } from "../tool/ast/GrammarAST.js";
import { HashMap, HashSet } from "antlr4ng";



/** Look for errors and deadcode stuff */
export class UseDefAnalyzer {
    // side-effect: updates Alternative with refs in actions
    public static trackTokenRuleRefsInActions(g: Grammar): void {
        for (let r of g.rules.values()) {
            for (let i = 1; i <= r.numberOfAlts; i++) {
                let alt = r.alt[i];
                for (let a of alt.actions) {
                    let sniffer = new ActionSniffer(g, r, alt, a, a.token);
                    sniffer.examineAction();
                }
            }
        }
    }

    public static actionIsContextDependent(actionAST: ActionAST): boolean {
        let in = new ANTLRStringStream(actionAST.token.getText());
		in.setLine(actionAST.token.getLine());
		in.setCharPositionInLine(actionAST.token.getCharPositionInLine());
        let dependent = [false]; // can't be simple bool with anon class
        let listener = new class extends BlankActionSplitterListener {
            @Override
            public nonLocalAttr(expr: string, x: Token, y: Token): void { dependent[0] = true; }
            @Override
            public qualifiedAttr(expr: string, x: Token, y: Token): void { dependent[0] = true; }
            @Override
            public setAttr(expr: string, x: Token, rhs: Token): void { dependent[0] = true; }
            @Override
            public setExprAttribute(expr: string): void { dependent[0] = true; }
            @Override
            public setNonLocalAttr(expr: string, x: Token, y: Token, rhs: Token): void { dependent[0] = true; }
            @Override
            public attr(expr: string, x: Token): void { dependent[0] = true; }
        }();
        let splitter = new ActionSplitter(in, listener);
        // forces eval, triggers listener methods
        splitter.getActionTokens();
        return dependent[0];
    }

    /** Find all rules reachable from r directly or indirectly for all r in g */
    public static getRuleDependencies(g: Grammar): Map<Rule, Set<Rule>>;

    public static getRuleDependencies(g: LexerGrammar, modeName: string): Map<Rule, Set<Rule>>;

    public static getRuleDependencies(g: Grammar, rules: Collection<Rule>): Map<Rule, Set<Rule>>;
    public static getRuleDependencies(...args: unknown[]): Map<Rule, Set<Rule>> {
        switch (args.length) {
            case 1: {
                const [g] = args as [Grammar];


                return UseDefAnalyzer.getRuleDependencies(g, g.rules.values());


                break;
            }

            case 2: {
                const [g, modeName] = args as [LexerGrammar, string];


                return UseDefAnalyzer.getRuleDependencies(g, g.modes.get(modeName));


                break;
            }

            case 2: {
                const [g, rules] = args as [Grammar, Collection<Rule>];


                let dependencies = new HashMap<Rule, Set<Rule>>();

                for (let r of rules) {
                    let tokenRefs = r.ast.getNodesWithType(ANTLRParser.TOKEN_REF);
                    for (let tref of tokenRefs) {
                        let calls = dependencies.get(r);
                        if (calls === null) {
                            calls = new HashSet<Rule>();
                            dependencies.put(r, calls);
                        }
                        calls.add(g.getRule(tref.getText()));
                    }
                }

                return dependencies;


                break;
            }

            default: {
                throw new java.lang.IllegalArgumentException(S`Invalid number of arguments`);
            }
        }
    }


}
