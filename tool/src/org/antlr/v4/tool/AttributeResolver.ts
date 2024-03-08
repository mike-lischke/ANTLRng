/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */


/* eslint-disable jsdoc/require-returns, jsdoc/require-param */


import { ActionAST } from "./ast/ActionAST.js";



/** Grammars, rules, and alternatives all have symbols visible to
 *  actions.  To evaluate attr exprs, ask action for its resolver
 *  then ask resolver to look up various symbols. Depending on the context,
 *  some symbols are available at some aren't.
 *
 *  Alternative level:
 *
 *  $x		Attribute: rule arguments, return values, predefined rule prop.
 * 			AttributeDict: references to tokens and token labels in the
 * 			current alt (including any elements within subrules contained
 * 			in that outermost alt). x can be rule with scope or a global scope.
 * 			List label: x is a token/rule list label.
 *  $x.y	Attribute: x is surrounding rule, rule/token/label ref
 *  $s::y	Attribute: s is any rule with scope or global scope; y is prop within
 *
 *  Rule level:
 *
 *  $x		Attribute: rule arguments, return values, predefined rule prop.
 * 			AttributeDict: references to token labels in *any* alt. x can
 * 			be any rule with scope or global scope.
 * 			List label: x is a token/rule list label.
 *  $x.y	Attribute: x is surrounding rule, label ref (in any alts)
 *  $s::y	Attribute: s is any rule with scope or global scope; y is prop within
 *
 *  Grammar level:
 *
 *  $s		AttributeDict: s is a global scope
 *  $s::y	Attribute: s is a global scope; y is prop within
 */
 interface AttributeResolver {
	  resolvesToListLabel(x: string, node: ActionAST): boolean;
	  resolvesToLabel(x: string, node: ActionAST): boolean;
	  resolvesToAttributeDict(x: string, node: ActionAST): boolean;
	  resolvesToToken(x: string, node: ActionAST): boolean;
	  resolveToAttribute(x: string, node: ActionAST): java.security.KeyStore.Entry.Attribute;
	  resolveToAttribute(x: string, y: string, node: ActionAST): java.security.KeyStore.Entry.Attribute;
}
