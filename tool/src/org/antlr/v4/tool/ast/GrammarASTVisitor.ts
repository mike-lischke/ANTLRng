/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */


/* eslint-disable jsdoc/require-returns, jsdoc/require-param */
import { TerminalAST } from "./TerminalAST.js";
import { StarBlockAST } from "./StarBlockAST.js";
import { SetAST } from "./SetAST.js";
import { RuleRefAST } from "./RuleRefAST.js";
import { RuleAST } from "./RuleAST.js";
import { RangeAST } from "./RangeAST.js";
import { PredAST } from "./PredAST.js";
import { PlusBlockAST } from "./PlusBlockAST.js";
import { OptionalBlockAST } from "./OptionalBlockAST.js";
import { NotAST } from "./NotAST.js";
import { GrammarRootAST } from "./GrammarRootAST.js";
import { GrammarAST } from "./GrammarAST.js";
import { BlockAST } from "./BlockAST.js";
import { AltAST } from "./AltAST.js";



/** A simple visitor, based upon the classic double dispatch method,
 *  for walking GrammarAST trees resulting from parsing ANTLR grammars.
 *  There is also the GrammarTreeVisitor.g tree grammar that looks for
 *  subtree patterns and fires off high-level events as opposed to
 *  "found node" events like this visitor does. Also, like all
 *  visitors, the users of this interface are required to implement
 *  the node visitation of the children. The GrammarTreeVisitor mechanism
 *  fires events and the user is not required to do any walking code.
 *
 *  GrammarAST t = ...;
 *  GrammarASTVisitor v = new ...;
 *  t.visit(v);
 */
 interface GrammarASTVisitor {
	/** This is the generic visitor method that will be invoked
	 *  for any other kind of AST node not covered by the other visit methods.
	 */
	  visit(node: GrammarAST): Object;

	  visit(node: GrammarRootAST): Object;
	  visit(node: RuleAST): Object;

	  visit(node: BlockAST): Object;
	  visit(node: OptionalBlockAST): Object;
	  visit(node: PlusBlockAST): Object;
	  visit(node: StarBlockAST): Object;

	  visit(node: AltAST): Object;

	  visit(node: NotAST): Object;
	  visit(node: PredAST): Object;
	  visit(node: RangeAST): Object;
	  visit(node: SetAST): Object;
	  visit(node: RuleRefAST): Object;
	  visit(node: TerminalAST): Object;
}
