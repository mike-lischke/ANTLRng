


import { java, JavaObject, type int } from "jree";
import { ParserRuleContext, TerminalNode, RuleNode, ParseTreeListener, ParseTree, ErrorNode } from "antlr4ng";

type IllegalStateException = java.lang.IllegalStateException;
const IllegalStateException = java.lang.IllegalStateException;

import { Test, Override } from "../../../decorators.js";


export class TreeShapeListener extends JavaObject implements ParseTreeListener {
    public static readonly INSTANCE = new TreeShapeListener();

    @Override
    public visitTerminal(node: TerminalNode): void { }
    @Override
    public visitErrorNode(node: ErrorNode): void { }
    @Override
    public exitEveryRule(ctx: ParserRuleContext): void { }

    @Override
    public enterEveryRule(ctx: ParserRuleContext): void {
        for (let i = 0; i < ctx.getChildCount(); i++) {
            let parent = ctx.getChild(i).getParent();
            if (!(parent instanceof RuleNode) || (parent as RuleNode).getRuleContext() !== ctx) {
                throw new IllegalStateException("Invalid parse tree shape detected.");
            }
        }
    }
}
