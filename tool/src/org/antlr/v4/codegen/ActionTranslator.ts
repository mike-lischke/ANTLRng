/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */




import { Target } from "./Target.js";
import { OutputModelFactory } from "./OutputModelFactory.js";
import { CodeGenerator } from "./CodeGenerator.js";
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
import { ActionSplitterListener } from "../parse/ActionSplitterListener.js";
import { ErrorType } from "../tool/ErrorType.js";
import { Rule } from "../tool/Rule.js";
import { ActionAST } from "../tool/ast/ActionAST.js";
import { HashMap } from "antlr4ng";




export class ActionTranslator implements ActionSplitterListener {
    public static readonly thisRulePropToModelMap =
        new HashMap<string, Class<RulePropertyRef>>();

    public static readonly rulePropToModelMap =
        new HashMap<string, Class<RulePropertyRef>>();

    public static readonly tokenPropToModelMap =
        new HashMap<string, Class<TokenPropertyRef>>();

    protected readonly gen: CodeGenerator;
    protected readonly target: Target;
    protected readonly node: ActionAST;
    protected rf: RuleFunction;
    protected readonly chunks = new Array<ActionChunk>();
    protected readonly factory: OutputModelFactory;
    protected nodeContext: StructDecl;

    public constructor(factory: OutputModelFactory, node: ActionAST) {
        this.factory = factory;
        this.node = node;
        this.gen = factory.getGenerator();
        this.target = this.gen.getTarget();
    }

    public override static toString(chunks: Array<ActionChunk>): string {
        let buf = new StringBuilder();
        for (let c of chunks) {
            buf.append(c.toString());
        }

        return buf.toString();
    }

    public static translateAction(factory: OutputModelFactory,
        rf: RuleFunction,
        tokenWithinAction: Token,
        node: ActionAST): Array<ActionChunk> {
        let action = tokenWithinAction.getText();
        if (action !== null && action.length() > 0 && action.charAt(0) === '{') {
            let firstCurly = action.indexOf('{');
            let lastCurly = action.lastIndexOf('}');
            if (firstCurly >= 0 && lastCurly >= 0) {
                action = action.substring(firstCurly + 1, lastCurly); // trim {...}
            }
        }
        return ActionTranslator.translateActionChunk(factory, rf, action, node);
    }

    public static translateActionChunk(factory: OutputModelFactory,
        rf: RuleFunction,
        action: string,
        node: ActionAST): Array<ActionChunk> {
        let tokenWithinAction = node.token;
        let translator = new ActionTranslator(factory, node);
        translator.rf = rf;
        factory.getGrammar().tool.log("action-translator", "translate " + action);
        let altLabel = node.getAltLabel();
        if (rf !== null) {
            translator.nodeContext = rf.ruleCtx;
            if (altLabel !== null) {
                translator.nodeContext = rf.altLabelCtxs.get(altLabel);
            }

        }
        let in = new ANTLRStringStream(action);
		in.setLine(tokenWithinAction.getLine());
		in.setCharPositionInLine(tokenWithinAction.getCharPositionInLine());
        let trigger = new ActionSplitter(in, translator);
        // forces eval, triggers listener methods
        trigger.getActionTokens();
        return translator.chunks;
    }


    public attr(expr: string, x: Token): void {
        this.gen.g.tool.logInfo("action-translator", "attr " + x);
        let a = this.node.resolver.resolveToAttribute(x.getText(), this.node);
        let name = x.getText();
        let escapedName = this.target.escapeIfNeeded(name);
        if (a !== null) {
            switch (a.dict.type) {
                case ARG: {
                    this.chunks.add(new ArgRef(this.nodeContext, name, escapedName));
                    break;
                }

                case RET: {
                    this.chunks.add(new RetValueRef(this.rf.ruleCtx, name, escapedName));
                    break;
                }

                case LOCAL: {
                    this.chunks.add(new LocalRef(this.nodeContext, name, escapedName));
                    break;
                }

                case PREDEFINED_RULE: {
                    this.chunks.add(this.getRulePropertyRef(null, x));
                    break;
                }

                default: {
                    break;
                }

            }
        }
        if (this.node.resolver.resolvesToToken(name, this.node)) {
            let tokenLabel = this.getTokenLabel(name);
            this.chunks.add(new TokenRef(this.nodeContext, tokenLabel, this.target.escapeIfNeeded(tokenLabel))); // $label
            return;
        }
        if (this.node.resolver.resolvesToLabel(name, this.node)) {
            let tokenLabel = this.getTokenLabel(name);
            this.chunks.add(new LabelRef(this.nodeContext, tokenLabel, this.target.escapeIfNeeded(tokenLabel))); // $x for x=ID etc...
            return;
        }
        if (this.node.resolver.resolvesToListLabel(name, this.node)) {
            this.chunks.add(new ListLabelRef(this.nodeContext, name, escapedName)); // $ids for ids+=ID etc...
            return;
        }
        let r = this.factory.getGrammar().getRule(name);
        if (r !== null) {
            let ruleLabel = this.getRuleLabel(name);
            this.chunks.add(new LabelRef(this.nodeContext, ruleLabel, this.target.escapeIfNeeded(ruleLabel))); // $r for r rule ref
        }
    }


    public qualifiedAttr(expr: string, x: Token, y: Token): void {
        this.gen.g.tool.logInfo("action-translator", "qattr " + x + "." + y);
        if (this.node.resolver.resolveToAttribute(x.getText(), this.node) !== null) {
            // must be a member access to a predefined attribute like $ctx.foo
            this.attr(expr, x);
            this.chunks.add(new ActionText(this.nodeContext, "." + y.getText()));
            return;
        }
        let a = this.node.resolver.resolveToAttribute(x.getText(), y.getText(), this.node);
        if (a === null) {
            // Added in response to https://github.com/antlr/antlr4/issues/1211
            this.gen.g.tool.errMgr.grammarError(ErrorType.UNKNOWN_SIMPLE_ATTRIBUTE,
                this.gen.g.fileName, x,
                x.getText(),
                "rule");
            return;
        }
        switch (a.dict.type) {
            case ARG: {
                this.chunks.add(new ArgRef(this.nodeContext, y.getText(), this.target.escapeIfNeeded(y.getText()))); break;
            }
            // has to be current rule
            case RET: {
                this.chunks.add(new QRetValueRef(this.nodeContext, this.getRuleLabel(x.getText()), y.getText(), this.target.escapeIfNeeded(y.getText())));
                break;
            }

            case PREDEFINED_RULE: {
                this.chunks.add(this.getRulePropertyRef(x, y));
                break;
            }

            case TOKEN: {
                this.chunks.add(this.getTokenPropertyRef(x, y));
                break;
            }

            default: {
                break;
            }

        }
    }


    public setAttr(expr: string, x: Token, rhs: Token): void {
        this.gen.g.tool.logInfo("action-translator", "setAttr " + x + " " + rhs);
        let rhsChunks = ActionTranslator.translateActionChunk(this.factory, this.rf, rhs.getText(), this.node);
        let name = x.getText();
        let s = new SetAttr(this.nodeContext, name, this.target.escapeIfNeeded(name), rhsChunks);
        this.chunks.add(s);
    }


    public nonLocalAttr(expr: string, x: Token, y: Token): void {
        this.gen.g.tool.logInfo("action-translator", "nonLocalAttr " + x + "::" + y);
        let r = this.factory.getGrammar().getRule(x.getText());
        let name = y.getText();
        this.chunks.add(new NonLocalAttrRef(this.nodeContext, x.getText(), name, this.target.escapeIfNeeded(name), r.index));
    }


    public setNonLocalAttr(expr: string, x: Token, y: Token, rhs: Token): void {
        this.gen.g.tool.logInfo("action-translator", "setNonLocalAttr " + x + "::" + y + "=" + rhs);
        let r = this.factory.getGrammar().getRule(x.getText());
        let rhsChunks = ActionTranslator.translateActionChunk(this.factory, this.rf, rhs.getText(), this.node);
        let name = y.getText();
        let s = new SetNonLocalAttr(this.nodeContext, x.getText(), name, this.target.escapeIfNeeded(name), r.index, rhsChunks);
        this.chunks.add(s);
    }


    public text(text: string): void {
        this.chunks.add(new ActionText(this.nodeContext, text));
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

    protected getTokenPropertyRef(x: Token, y: Token): TokenPropertyRef {
        try {
            let c = ActionTranslator.tokenPropToModelMap.get(y.getText());
            let ctor = c.getConstructor(StructDecl.class, string.class);
            return ctor.newInstance(this.nodeContext, this.getTokenLabel(x.getText()));
        } catch (e) {
            if (e instanceof Exception) {
                this.factory.getGrammar().tool.errMgr.toolError(ErrorType.INTERNAL_ERROR, e);
            } else {
                throw e;
            }
        }
        return null;
    }

    protected getRulePropertyRef(x: Token, prop: Token): RulePropertyRef {
        try {
            let c = (x !== null ? ActionTranslator.rulePropToModelMap : ActionTranslator.thisRulePropToModelMap).get(prop.getText());
            let ctor = c.getConstructor(StructDecl.class, string.class);
            return ctor.newInstance(this.nodeContext, this.getRuleLabel((x !== null ? x : prop).getText()));
        } catch (e) {
            if (e instanceof Exception) {
                this.factory.getGrammar().tool.errMgr.toolError(ErrorType.INTERNAL_ERROR, e, prop.getText());
            } else {
                throw e;
            }
        }
        return null;
    }
    static {
        ActionTranslator.thisRulePropToModelMap.put("start", ThisRulePropertyRef_start.class);
        ActionTranslator.thisRulePropToModelMap.put("stop", ThisRulePropertyRef_stop.class);
        ActionTranslator.thisRulePropToModelMap.put("text", ThisRulePropertyRef_text.class);
        ActionTranslator.thisRulePropToModelMap.put("ctx", ThisRulePropertyRef_ctx.class);
        ActionTranslator.thisRulePropToModelMap.put("parser", ThisRulePropertyRef_parser.class);
    }
    static {
        ActionTranslator.rulePropToModelMap.put("start", RulePropertyRef_start.class);
        ActionTranslator.rulePropToModelMap.put("stop", RulePropertyRef_stop.class);
        ActionTranslator.rulePropToModelMap.put("text", RulePropertyRef_text.class);
        ActionTranslator.rulePropToModelMap.put("ctx", RulePropertyRef_ctx.class);
        ActionTranslator.rulePropToModelMap.put("parser", RulePropertyRef_parser.class);
    }
    static {
        ActionTranslator.tokenPropToModelMap.put("text", TokenPropertyRef_text.class);
        ActionTranslator.tokenPropToModelMap.put("type", TokenPropertyRef_type.class);
        ActionTranslator.tokenPropToModelMap.put("line", TokenPropertyRef_line.class);
        ActionTranslator.tokenPropToModelMap.put("index", TokenPropertyRef_index.class);
        ActionTranslator.tokenPropToModelMap.put("pos", TokenPropertyRef_pos.class);
        ActionTranslator.tokenPropToModelMap.put("channel", TokenPropertyRef_channel.class);
        ActionTranslator.tokenPropToModelMap.put("int", TokenPropertyRef_int.class);
    }
}
