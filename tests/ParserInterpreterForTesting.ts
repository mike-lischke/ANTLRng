/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */


/* eslint-disable jsdoc/require-returns, jsdoc/require-param */


import { Parser, ParserRuleContext, TokenStream, ATN, ATNState, DecisionState, ParserATNSimulator, PredictionContextCache, DFA } from "antlr4ng";



export class ParserInterpreterForTesting {
    public static DummyParser = class DummyParser extends Parser {
        public readonly atn: ATN;
        public readonly decisionToDFA: DFA[]; // not shared for interp
        public readonly sharedContextCache =
            new PredictionContextCache();

        public g: Grammar;
        public constructor(g: Grammar, atn: ATN, input: TokenStream) {
            super(input);
            this.g = g;
            this.atn = atn;
            this.decisionToDFA = new Array<DFA>(atn.getNumberOfDecisions());
            for (let i = 0; i < this.decisionToDFA.length; i++) {
                this.decisionToDFA[i] = new DFA(atn.getDecisionState(i), i);
            }
        }


        public override  getGrammarFileName(): string {
            throw new UnsupportedOperationException("not implemented");
        }


        public override  getRuleNames(): string[] {
            return this.g.rules.keySet().toArray(new Array<string>(0));
        }




        @Deprecated
        public override  getTokenNames(): string[] {
            return this.g.getTokenNames();
        }


        public override  getATN(): ATN {
            return this.atn;
        }
    };

    public parser: ParserInterpreterForTesting.DummyParser;

    protected g: Grammar;
    protected atnSimulator: ParserATNSimulator;
    protected input: TokenStream;

    public constructor(g: Grammar);

    public constructor(g: Grammar, input: TokenStream);
    public constructor(...args: unknown[]) {
        switch (args.length) {
            case 1: {
                const [g] = args as [Grammar];


                this.g = g;


                break;
            }

            case 2: {
                const [g, input] = args as [Grammar, TokenStream];


                let antlr = new Tool();
                antlr.process(g, false);
                this.parser = new ParserInterpreterForTesting.DummyParser(g, g.atn, input);
                this.atnSimulator =
                    new ParserATNSimulator(this.parser, g.atn, this.parser.decisionToDFA,
                        this.parser.sharedContextCache);


                break;
            }

            default: {
                throw new java.lang.IllegalArgumentException(S`Invalid number of arguments`);
            }
        }
    }


    public adaptivePredict(input: TokenStream, decision: number,
        outerContext: ParserRuleContext): number {
        return this.atnSimulator.adaptivePredict(input, decision, outerContext);
    }

    public matchATN(input: TokenStream,
        startState: ATNState): number {
        if (startState.getNumberOfTransitions() === 1) {
            return 1;
        }
        else {
            if (startState instanceof DecisionState) {
                return this.atnSimulator.adaptivePredict(input, (startState as DecisionState).decision, null);
            }
            else {
                if (startState.getNumberOfTransitions() > 0) {
                    return 1;
                }
                else {
                    return -1;
                }
            }

        }

    }

    public getATNSimulator(): ParserATNSimulator {
        return this.atnSimulator;
    }

}

// eslint-disable-next-line @typescript-eslint/no-namespace, no-redeclare
export namespace ParserInterpreterForTesting {
    export type DummyParser = InstanceType<typeof ParserInterpreterForTesting.DummyParser>;
}
