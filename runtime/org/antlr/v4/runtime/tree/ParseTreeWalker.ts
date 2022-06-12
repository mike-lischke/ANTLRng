/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */


/*
 eslint-disable @typescript-eslint/no-namespace, @typescript-eslint/naming-convention,
 max-classes-per-file, jsdoc/check-tag-names, @typescript-eslint/no-empty-function,
 @typescript-eslint/restrict-plus-operands, @typescript-eslint/unified-signatures, @typescript-eslint/member-ordering,
 no-underscore-dangle
*/

/* cspell: disable */



import { ErrorNode } from "./ErrorNode";
import { ParseTree } from "./ParseTree";
import { ParseTreeListener } from "./ParseTreeListener";
import { RuleNode } from "./RuleNode";
import { TerminalNode } from "./TerminalNode";
import { ParserRuleContext } from "../ParserRuleContext";




export  class ParseTreeWalker {
    public static readonly  DEFAULT?:  ParseTreeWalker = new  ParseTreeWalker();


	/**
	 * Performs a walk on the given parse tree starting at the root and going down recursively
	 * with depth-first search. On each node, {@link ParseTreeWalker#enterRule} is called before
	 * recursively walking down into child nodes, then
	 * {@link ParseTreeWalker#exitRule} is called after the recursive call to wind up.
	 * @param listener The listener used by the walker to process grammar rules
	 * @param t The parse tree to be walked on
	 */
	public walk = (listener: ParseTreeListener, t: ParseTree): void => {
		if ( t instanceof ErrorNode) {
			listener.visitErrorNode(t as ErrorNode);
			return;
		}
		else { if ( t instanceof TerminalNode) {
			listener.visitTerminal(t as TerminalNode);
			return;
		}
}

		let  r: RuleNode = t as RuleNode;
        this.enterRule(listener, r);
        let  n: number = r.getChildCount();
        for (let  i: number = 0; i<n; i++) {
            this.walk(listener, r.getChild(i));
        }
		this.exitRule(listener, r);
    }

	/**
	 * Enters a grammar rule by first triggering the generic event {@link ParseTreeListener#enterEveryRule}
	 * then by triggering the event specific to the given parse tree node
	 * @param listener The listener responding to the trigger events
	 * @param r The grammar rule containing the rule context
	 */
    protected enterRule = (listener: ParseTreeListener, r: RuleNode): void => {
		let  ctx: ParserRuleContext = r.getRuleContext() as ParserRuleContext;
		listener.enterEveryRule(ctx);
		ctx.enterRule(listener);
    }


	/**
	 * Exits a grammar rule by first triggering the event specific to the given parse tree node
	 * then by triggering the generic event {@link ParseTreeListener#exitEveryRule}
	 * @param listener The listener responding to the trigger events
	 * @param r The grammar rule containing the rule context
	 */
	protected exitRule = (listener: ParseTreeListener, r: RuleNode): void => {
		let  ctx: ParserRuleContext = r.getRuleContext() as ParserRuleContext;
		ctx.exitRule(listener);
		listener.exitEveryRule(ctx);
    }
}
