/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { CharStream, type Token } from "antlr4ng";

import { ActionSplitter } from "../../../../../../src/generated/ActionSplitter.js";
import { ActionSplitterListener } from "../parse/ActionSplitterListener.js";

import { ErrorType } from "../tool/ErrorType.js";
import { ActionAST } from "../tool/ast/ActionAST.js";
import { CodeGenerator } from "./CodeGenerator.js";
import { OutputModelFactory } from "./OutputModelFactory.js";
import { Target } from "./Target.js";
import { RuleFunction } from "./model/RuleFunction.js";
import { ActionChunk } from "./model/chunk/ActionChunk.js";
import { ActionText } from "./model/chunk/ActionText.js";
import { ArgRef } from "./model/chunk/ArgRef.js";
import { LabelRef } from "./model/chunk/LabelRef.js";
import { ListLabelRef } from "./model/chunk/ListLabelRef.js";
import { LocalRef } from "./model/chunk/LocalRef.js";
import { NonLocalAttrRef } from "./model/chunk/NonLocalAttrRef.js";
import { QRetValueRef } from "./model/chunk/QRetValueRef.js";
import { RetValueRef } from "./model/chunk/RetValueRef.js";
import { RulePropertyRef } from "./model/chunk/RulePropertyRef.js";
import { RulePropertyRef_ctx } from "./model/chunk/RulePropertyRef_ctx.js";
import { RulePropertyRef_parser } from "./model/chunk/RulePropertyRef_parser.js";
import { RulePropertyRef_start } from "./model/chunk/RulePropertyRef_start.js";
import { RulePropertyRef_stop } from "./model/chunk/RulePropertyRef_stop.js";
import { RulePropertyRef_text } from "./model/chunk/RulePropertyRef_text.js";
import { SetAttr } from "./model/chunk/SetAttr.js";
import { SetNonLocalAttr } from "./model/chunk/SetNonLocalAttr.js";
import { ThisRulePropertyRef_ctx } from "./model/chunk/ThisRulePropertyRef_ctx.js";
import { ThisRulePropertyRef_parser } from "./model/chunk/ThisRulePropertyRef_parser.js";
import { ThisRulePropertyRef_start } from "./model/chunk/ThisRulePropertyRef_start.js";
import { ThisRulePropertyRef_stop } from "./model/chunk/ThisRulePropertyRef_stop.js";
import { ThisRulePropertyRef_text } from "./model/chunk/ThisRulePropertyRef_text.js";
import { TokenPropertyRef } from "./model/chunk/TokenPropertyRef.js";
import { TokenPropertyRef_channel } from "./model/chunk/TokenPropertyRef_channel.js";
import { TokenPropertyRef_index } from "./model/chunk/TokenPropertyRef_index.js";
import { TokenPropertyRef_int } from "./model/chunk/TokenPropertyRef_int.js";
import { TokenPropertyRef_line } from "./model/chunk/TokenPropertyRef_line.js";
import { TokenPropertyRef_pos } from "./model/chunk/TokenPropertyRef_pos.js";
import { TokenPropertyRef_text } from "./model/chunk/TokenPropertyRef_text.js";
import { TokenPropertyRef_type } from "./model/chunk/TokenPropertyRef_type.js";
import { TokenRef } from "./model/chunk/TokenRef.js";
import { StructDecl } from "./model/decl/StructDecl.js";
import { DictType } from "../tool/DictType.js";

export class ActionTranslator implements ActionSplitterListener {
    public static readonly thisRulePropToModelMap = new Map<string, typeof RulePropertyRef>([
        ["start", ThisRulePropertyRef_start],
        ["stop", ThisRulePropertyRef_stop],
        ["text", ThisRulePropertyRef_text],
        ["ctx", ThisRulePropertyRef_ctx],
        ["parser", ThisRulePropertyRef_parser],
    ]);

    public static readonly rulePropToModelMap = new Map<string, typeof RulePropertyRef>([
        ["start", RulePropertyRef_start],
        ["stop", RulePropertyRef_stop],
        ["text", RulePropertyRef_text],
        ["ctx", RulePropertyRef_ctx],
        ["parser", RulePropertyRef_parser],
    ]);

    public static readonly tokenPropToModelMap = new Map<string, typeof TokenPropertyRef>([
        ["text", TokenPropertyRef_text],
        ["type", TokenPropertyRef_type],
        ["line", TokenPropertyRef_line],
        ["index", TokenPropertyRef_index],
        ["pos", TokenPropertyRef_pos],
        ["channel", TokenPropertyRef_channel],
        ["int", TokenPropertyRef_int],
    ]);

    protected readonly gen: CodeGenerator;
    protected readonly target: Target;
    protected readonly node: ActionAST;
    protected rf?: RuleFunction;
    protected readonly chunks = new Array<ActionChunk>();
    protected readonly factory: OutputModelFactory;
    protected nodeContext: StructDecl;

    public constructor(factory: OutputModelFactory, node: ActionAST) {
        this.factory = factory;
        this.node = node;
        this.gen = factory.getGenerator()!;
        this.target = this.gen.getTarget();
    }

    public static toString(chunks: ActionChunk[]): string {
        let result = "";
        for (const c of chunks) {
            // eslint-disable-next-line @typescript-eslint/no-base-to-string
            result += c.toString();
        }

        return result.toString();
    }

    public static translateAction(factory: OutputModelFactory, rf: RuleFunction | null, tokenWithinAction: Token | null,
        node: ActionAST): ActionChunk[] {
        let action = tokenWithinAction!.text!;
        if (action.startsWith("{")) {
            const firstCurly = action.indexOf("{");
            const lastCurly = action.lastIndexOf("}");
            if (firstCurly >= 0 && lastCurly >= 0) {
                action = action.substring(firstCurly + 1, lastCurly); // trim {...}
            }
        }

        return ActionTranslator.translateActionChunk(factory, rf, action, node);
    }

    public static translateActionChunk(factory: OutputModelFactory, rf: RuleFunction | null, action: string,
        node: ActionAST): ActionChunk[] {
        //const tokenWithinAction = node.token;
        const translator = new ActionTranslator(factory, node);
        translator.rf = rf ?? undefined;

        factory.getGrammar()!.tool.logInfo({ component: "action-translator", msg: "translate " + action });
        const altLabel = node.getAltLabel();
        if (rf) {
            translator.nodeContext = rf.ruleCtx;
            if (altLabel !== null) {
                translator.nodeContext = rf.altLabelCtxs!.get(altLabel)!;
            }
        }

        const input = CharStream.fromString(action);
        //input.setLine(tokenWithinAction.getLine());
        //input.setCharPositionInLine(tokenWithinAction.getCharPositionInLine());
        const trigger = new ActionSplitter(input);

        // forces eval, triggers listener methods
        trigger.getActionTokens(translator);

        return translator.chunks;
    }

    public attr(expr: string, x: string): void {
        this.gen.g?.tool.logInfo({ component: "action-translator", msg: "attr " + x });
        const a = this.node.resolver.resolveToAttribute(x, this.node);
        const name = x;
        const escapedName = this.target.escapeIfNeeded(name);
        if (a !== null) {
            switch (a.dict.type) {
                case DictType.ARG: {
                    this.chunks.push(new ArgRef(this.nodeContext, name, escapedName));
                    break;
                }

                case DictType.RET: {
                    this.chunks.push(new RetValueRef(this.rf!.ruleCtx, name, escapedName));
                    break;
                }

                case DictType.LOCAL: {
                    this.chunks.push(new LocalRef(this.nodeContext, name, escapedName));
                    break;
                }

                case DictType.PREDEFINED_RULE: {
                    this.chunks.push(this.getRulePropertyRef(undefined, x));
                    break;
                }

                default: {
                    break;
                }

            }
        }

        if (this.node.resolver.resolvesToToken(name, this.node)) {
            const tokenLabel = this.getTokenLabel(name);

            // $label
            this.chunks.push(new TokenRef(this.nodeContext, tokenLabel, this.target.escapeIfNeeded(tokenLabel)));

            return;
        }
        if (this.node.resolver.resolvesToLabel(name, this.node)) {
            const tokenLabel = this.getTokenLabel(name);

            // $x for x=ID etc...
            this.chunks.push(new LabelRef(this.nodeContext, tokenLabel, this.target.escapeIfNeeded(tokenLabel)));

            return;
        }

        if (this.node.resolver.resolvesToListLabel(name, this.node)) {
            // $ids for ids+=ID etc...
            this.chunks.push(new ListLabelRef(this.nodeContext, name, escapedName));

            return;
        }

        const r = this.factory.getGrammar()!.getRule(name);
        if (r !== null) {
            const ruleLabel = this.getRuleLabel(name);

            // $r for r rule ref
            this.chunks.push(new LabelRef(this.nodeContext, ruleLabel, this.target.escapeIfNeeded(ruleLabel)));
        }
    }

    public qualifiedAttr(expr: string, x: string, y: string): void {
        this.gen.g?.tool.logInfo({ component: "action-translator", msg: "q-attr " + x + "." + y });
        if (this.node.resolver.resolveToAttribute(x, this.node) !== null) {
            // must be a member access to a predefined attribute like $ctx.foo
            this.attr(expr, x);
            this.chunks.push(new ActionText(this.nodeContext, "." + y));

            return;
        }

        const a = this.node.resolver.resolveToAttribute(x, y, this.node);
        if (a === null) {
            // Added in response to https://github.com/antlr/antlr4/issues/1211
            this.gen.g?.tool.errMgr.grammarError(ErrorType.UNKNOWN_SIMPLE_ATTRIBUTE, this.gen.g.fileName, null,
                x, "rule");

            return;
        }

        switch (a.dict.type) {
            case DictType.ARG: {
                this.chunks.push(new ArgRef(this.nodeContext, y, this.target.escapeIfNeeded(y)));
                break;
            }

            // has to be current rule
            case DictType.RET: {
                this.chunks.push(new QRetValueRef(this.nodeContext, this.getRuleLabel(x), y,
                    this.target.escapeIfNeeded(y)));
                break;
            }

            case DictType.PREDEFINED_RULE: {
                this.chunks.push(this.getRulePropertyRef(x, y));
                break;
            }

            case DictType.TOKEN: {
                this.chunks.push(this.getTokenPropertyRef(x, y));
                break;
            }

            default: {
                break;
            }
        }
    }

    public setAttr(expr: string, x: string, rhs: string): void {
        this.gen.g?.tool.logInfo({ component: "action-translator", msg: "setAttr " + x + " " + rhs });
        const rhsChunks = ActionTranslator.translateActionChunk(this.factory, this.rf!, rhs, this.node);
        const s = new SetAttr(this.nodeContext, x, this.target.escapeIfNeeded(x), rhsChunks);
        this.chunks.push(s);
    }

    public nonLocalAttr(expr: string, x: string, y: string): void {
        this.gen.g?.tool.logInfo({ component: "action-translator", msg: "nonLocalAttr " + x + "::" + y });
        const r = this.factory.getGrammar()!.getRule(x);
        this.chunks.push(new NonLocalAttrRef(this.nodeContext, x, y, this.target.escapeIfNeeded(y), r!.index));
    }

    public setNonLocalAttr(expr: string, x: string, y: string, rhs: string): void {
        this.gen.g?.tool.logInfo(
            { component: "action-translator", msg: "setNonLocalAttr " + x + "::" + y + "=" + rhs });
        const r = this.factory.getGrammar()!.getRule(x);
        const rhsChunks = ActionTranslator.translateActionChunk(this.factory, this.rf!, rhs, this.node);
        const s = new SetNonLocalAttr(this.nodeContext, x, y, this.target.escapeIfNeeded(y), r!.index, rhsChunks);
        this.chunks.push(s);
    }

    public text(text: string): void {
        this.chunks.push(new ActionText(this.nodeContext, text));
    }

    public getTokenLabel(x: string): string {
        if (this.node.resolver.resolvesToLabel(x, this.node)) {
            return x;
        }

        return this.target.getImplicitTokenLabel(x);
    }

    public getRuleLabel(x: string): string {
        if (this.node.resolver.resolvesToLabel(x, this.node)) {
            return x;
        }

        return this.target.getImplicitRuleLabel(x);
    }

    protected getTokenPropertyRef(x: string, y: string): TokenPropertyRef {
        const c = ActionTranslator.tokenPropToModelMap.get(y)!;

        return new c(this.nodeContext, this.getTokenLabel(x));
    }

    protected getRulePropertyRef(x: string | undefined, prop: string): RulePropertyRef {
        const c = (x !== undefined
            ? ActionTranslator.rulePropToModelMap
            : ActionTranslator.thisRulePropToModelMap
        ).get(prop)!;

        return new c(this.nodeContext, this.getRuleLabel((x ?? prop)));
    }

}
