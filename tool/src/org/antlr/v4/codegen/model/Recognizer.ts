/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { SerializedJavaATN } from "./SerializedJavaATN.js";
import { SerializedATN } from "./SerializedATN.js";
import { RuleSempredFunction } from "./RuleSempredFunction.js";
import { OutputModelObject } from "./OutputModelObject.js";
import { ModelElement } from "./ModelElement.js";
import { CodeGenerator } from "../CodeGenerator.js";
import { OutputModelFactory } from "../OutputModelFactory.js";
import { ActionChunk } from "./chunk/ActionChunk.js";
import { ActionText } from "./chunk/ActionText.js";
import { JavaTarget } from "../target/JavaTarget.js";
import { Grammar } from "../../tool/Grammar.js";
import { Rule } from "../../tool/Rule.js";
import { LinkedHashMap as HashMap } from "antlr4ng";

export abstract class Recognizer extends OutputModelObject {
    public name: string;
    public grammarName: string;
    public grammarFileName: string;
    public accessLevel: string;
    public tokens: Map<string, number>;

    /**
     * @deprecated This field is provided only for compatibility with code
     * generation targets which have not yet been updated to use
     * {@link #literalNames} and {@link #symbolicNames}.
     */
    @Deprecated
    public tokenNames: string[];

    public literalNames: string[];
    public symbolicNames: string[];
    public ruleNames: Set<string>;
    public rules: Rule[];

    public superClass: ActionChunk;

    public atn: SerializedATN;

    public sempredFuncs =
        new LinkedHashMap<Rule, RuleSempredFunction>();

    public constructor(factory: OutputModelFactory) {
        super(factory);

        const g = factory.getGrammar();
        const gen = factory.getGenerator();
        this.grammarFileName = new File(g.fileName).getName();
        this.grammarName = g.name;
        this.name = g.getRecognizerName();
        this.accessLevel = g.getOptionString("accessLevel");
        this.tokens = new LinkedHashMap<string, number>();
        for (const entry of g.tokenNameToTypeMap.entrySet()) {
            const ttype = entry.getValue();
            if (ttype > 0) {
                this.tokens.put(gen.getTarget().escapeIfNeeded(entry.getKey()), ttype);
            }
        }

        this.ruleNames = g.rules.keySet();
        this.rules = g.rules.values();
        if (gen.getTarget() instanceof JavaTarget) {
            this.atn = new SerializedJavaATN(factory, g.atn);
        }
        else {
            this.atn = new SerializedATN(factory, g.atn);
        }
        if (g.getOptionString("superClass") !== null) {
            this.superClass = new ActionText(null, g.getOptionString("superClass"));
        }
        else {
            this.superClass = null;
        }

        this.tokenNames = Recognizer.translateTokenStringsToTarget(g.getTokenDisplayNames(), gen);
        this.literalNames = Recognizer.translateTokenStringsToTarget(g.getTokenLiteralNames(), gen);
        this.symbolicNames = Recognizer.translateTokenStringsToTarget(g.getTokenSymbolicNames(), gen);
    }

    protected static translateTokenStringsToTarget(tokenStrings: string[], gen: CodeGenerator): string[] {
        let result = tokenStrings.clone();
        for (let i = 0; i < tokenStrings.length; i++) {
            result[i] = Recognizer.translateTokenStringToTarget(tokenStrings[i], gen);
        }

        let lastTrueEntry = result.length - 1;
        while (lastTrueEntry >= 0 && result[lastTrueEntry] === null) {
            lastTrueEntry--;
        }

        if (lastTrueEntry < result.length - 1) {
            result = Arrays.copyOf(result, lastTrueEntry + 1);
        }

        return Arrays.asList(result);
    }

    protected static translateTokenStringToTarget(tokenName: string, gen: CodeGenerator): string {
        if (tokenName === null) {
            return null;
        }

        if (tokenName.startsWith("'")) {
            const targetString =
                gen.getTarget().getTargetStringLiteralFromANTLRStringLiteral(gen, tokenName, false, true);

            return "\"'" + targetString + "'\"";
        }
        else {
            return gen.getTarget().getTargetStringLiteralFromString(tokenName, true);
        }
    }

}
