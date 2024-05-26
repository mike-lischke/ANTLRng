/* java2ts: keep */

/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

/* eslint-disable jsdoc/require-returns, jsdoc/require-param */

import { LeftRecursiveRuleAltInfo } from "../analysis/LeftRecursiveRuleAltInfo.js";
import { Alternative } from "./Alternative.js";
import { Grammar } from "./Grammar.js";
import { Rule } from "./Rule.js";
import { AltAST } from "./ast/AltAST.js";
import type { GrammarAST } from "./ast/GrammarAST.js";
import { RuleAST } from "./ast/RuleAST.js";

export class LeftRecursiveRule extends Rule {
    public recPrimaryAlts: LeftRecursiveRuleAltInfo[];
    public recOpAlts: Map<number, LeftRecursiveRuleAltInfo>;
    public originalAST: RuleAST;

    /** Did we delete any labels on direct left-recur refs? Points at ID of ^(= ID el) */
    public leftRecursiveRuleRefLabels = new Array<[GrammarAST, string]>();

    public constructor(g: Grammar, name: string, ast: RuleAST) {
        super(g, name, ast, 1);
        this.originalAST = ast;
        this.alt = new Array<Alternative>(this.numberOfAlts + 1); // always just one
        for (let i = 1; i <= this.numberOfAlts; i++) {
            this.alt[i] = new Alternative(this, i);
        }
    }

    public override  hasAltSpecificContexts(): boolean {
        return super.hasAltSpecificContexts() || this.getAltLabels() !== null;
    }

    public override  getOriginalNumberOfAlts(): number {
        let n = 0;
        if (this.recPrimaryAlts !== null) {
            n += this.recPrimaryAlts.length;
        }

        if (this.recOpAlts !== null) {
            n += this.recOpAlts.size;
        }

        return n;
    }

    public getOriginalAST(): RuleAST {
        return this.originalAST;
    }

    public override  getUnlabeledAltASTs(): AltAST[] | null {
        const alts = new Array<AltAST>();
        for (const altInfo of this.recPrimaryAlts) {
            if (altInfo.altLabel === null) {
                alts.push(altInfo.originalAltAST);
            }

        }
        for (let i = 0; i < this.recOpAlts.size; i++) {
            const altInfo = this.recOpAlts.get(i)!;
            if (altInfo.altLabel === null) {
                alts.push(altInfo.originalAltAST);
            }

        }
        if (alts.length === 0) {
            return null;
        }

        return alts;
    }

    /**
     * Return an array that maps predicted alt from primary decision
     *  to original alt of rule. For following rule, return [0, 2, 4]
     *
     * ```antlr
     * e : e '*' e
     *   | INT
     *   | e '+' e
     *   | ID
     *   ;
     * ```
     *
     *  That maps predicted alt 1 to original alt 2 and predicted 2 to alt 4.
     */
    public getPrimaryAlts(): number[] {
        const alts: number[] = [];
        for (let i = 0; i < this.recPrimaryAlts.length; i++) { // recPrimaryAlts is a List not Map like recOpAlts
            const altInfo = this.recPrimaryAlts[i];
            alts[i + 1] = altInfo.altNum;
        }

        return alts;
    }

    /**
     * Return an array that maps predicted alt from recursive op decision
     *  to original alt of rule. For following rule, return [0, 1, 3]
     *
     * ```antlr
     * e : e '*' e
     *   | INT
     *   | e '+' e
     *   | ID
     *   ;
     * ```
     *  That maps predicted alt 1 to original alt 1 and predicted 2 to alt 3.
     */
    public getRecursiveOpAlts(): number[] {
        const alts: number[] = [];
        let alt = 1;
        for (const altInfo of this.recOpAlts.values()) {
            alts[alt] = altInfo.altNum;
            alt++; // recOpAlts has alts possibly with gaps
        }

        return alts;
    }

    /** Get -&gt; labels from those alts we deleted for left-recursive rules. */

    public override  getAltLabels(): Map<string, Array<[number, AltAST]>> | null {
        const labels = new Map<string, Array<[number, AltAST]>>();
        const normalAltLabels = super.getAltLabels();
        if (normalAltLabels !== null) {
            normalAltLabels.forEach((value, key) => {
                labels.set(key, value);
            });
        }

        if (this.recPrimaryAlts !== null) {
            for (const altInfo of this.recPrimaryAlts) {
                if (altInfo.altLabel !== null) {
                    let pairs = labels.get(altInfo.altLabel);
                    if (!pairs) {
                        pairs = [];
                        labels.set(altInfo.altLabel, pairs);
                    }

                    pairs.push([altInfo.altNum, altInfo.originalAltAST]);
                }
            }
        }

        if (this.recOpAlts !== null) {
            for (let i = 0; i < this.recOpAlts.size; i++) {
                const altInfo = this.recOpAlts.get(i)!;
                if (altInfo.altLabel !== null) {
                    let pairs = labels.get(altInfo.altLabel);
                    if (!pairs) {
                        pairs = [];
                        labels.set(altInfo.altLabel, pairs);
                    }

                    pairs.push([altInfo.altNum, altInfo.originalAltAST]);
                }
            }
        }

        if (labels.size === 0) {
            return null;
        }

        return labels;
    }
}
