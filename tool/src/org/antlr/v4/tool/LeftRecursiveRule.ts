/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */


/* eslint-disable jsdoc/require-returns, jsdoc/require-param */


import { Rule } from "./Rule.js";
import { Grammar } from "./Grammar.js";
import { Alternative } from "./Alternative.js";
import { LeftRecursiveRuleAltInfo } from "../analysis/LeftRecursiveRuleAltInfo.js";
import { AltAST } from "./ast/AltAST.js";
import { GrammarAST } from "./ast/GrammarAST.js";
import { RuleAST } from "./ast/RuleAST.js";
import { OrderedHashMap, HashMap } from "antlr4ng";



export  class LeftRecursiveRule extends Rule {
	public  recPrimaryAlts:  Array<LeftRecursiveRuleAltInfo>;
	public  recOpAlts:  OrderedHashMap<number, LeftRecursiveRuleAltInfo>;
	public  originalAST:  RuleAST;

	/** Did we delete any labels on direct left-recur refs? Points at ID of ^(= ID el) */
	public  leftRecursiveRuleRefLabels =
		new  Array<<GrammarAST,string>>();

	public  constructor(g: Grammar, name: string, ast: RuleAST) {
		super(g, name, ast, 1);
		this.originalAST = ast;
		this.alt = new  Array<Alternative>(this.numberOfAlts+1); // always just one
		for (let  i=1; i<=this.numberOfAlts; i++) {
 this.alt[i] = new  Alternative(this, i);
}

	}

	@Override
public override  hasAltSpecificContexts():  boolean {
		return super.hasAltSpecificContexts() || this.getAltLabels()!==null;
	}

	@Override
public override  getOriginalNumberOfAlts():  number {
		let  n = 0;
		if ( this.recPrimaryAlts!==null ) {
 n += this.recPrimaryAlts.size();
}

		if ( this.recOpAlts!==null ) {
 n += this.recOpAlts.size();
}

		return n;
	}

	public  getOriginalAST():  RuleAST {
		return this.originalAST;
	}

	@Override
public override  getUnlabeledAltASTs():  Array<AltAST> {
		let  alts = new  Array<AltAST>();
		for (let altInfo of this.recPrimaryAlts) {
			if (altInfo.altLabel === null) {
 alts.add(altInfo.originalAltAST);
}

		}
		for (let  i = 0; i < this.recOpAlts.size(); i++) {
			let  altInfo = this.recOpAlts.getElement(i);
			if ( altInfo.altLabel===null ) {
 alts.add(altInfo.originalAltAST);
}

		}
		if ( alts.isEmpty() ) {
 return null;
}

		return alts;
	}

	/** Return an array that maps predicted alt from primary decision
	 *  to original alt of rule. For following rule, return [0, 2, 4]
	 *
		e : e '*' e
		  | INT
		  | e '+' e
		  | ID
		  ;

	 *  That maps predicted alt 1 to original alt 2 and predicted 2 to alt 4.
	 *
	 *  @since 4.5.1
	 */
	public  getPrimaryAlts():  Int32Array {
		if ( this.recPrimaryAlts.size()===0 ) {
 return null;
}

		let  alts = new  Int32Array(this.recPrimaryAlts.size()+1);
		for (let  i = 0; i < this.recPrimaryAlts.size(); i++) { // recPrimaryAlts is a List not Map like recOpAlts
			let  altInfo = this.recPrimaryAlts.get(i);
			alts[i+1] = altInfo.altNum;
		}
		return alts;
	}

	/** Return an array that maps predicted alt from recursive op decision
	 *  to original alt of rule. For following rule, return [0, 1, 3]
	 *
		e : e '*' e
		  | INT
		  | e '+' e
		  | ID
		  ;

	 *  That maps predicted alt 1 to original alt 1 and predicted 2 to alt 3.
	 *
	 *  @since 4.5.1
	 */
	public  getRecursiveOpAlts():  Int32Array {
		if ( this.recOpAlts.size()===0 ) {
 return null;
}

		let  alts = new  Int32Array(this.recOpAlts.size()+1);
		let  alt = 1;
		for (let altInfo of this.recOpAlts.values()) {
			alts[alt] = altInfo.altNum;
			alt++; // recOpAlts has alts possibly with gaps
		}
		return alts;
	}

	/** Get -&gt; labels from those alts we deleted for left-recursive rules. */
	@Override
public override  getAltLabels():  Map<string, Array<<number, AltAST>>> {
		let  labels = new  HashMap<string, Array<<number, AltAST>>>();
		let  normalAltLabels = super.getAltLabels();
		if ( normalAltLabels!==null ) {
 labels.putAll(normalAltLabels);
}

		if ( this.recPrimaryAlts!==null ) {
			for (let altInfo of this.recPrimaryAlts) {
				if (altInfo.altLabel !== null) {
					let  pairs = labels.get(altInfo.altLabel);
					if (pairs === null) {
						pairs = new  Array<<number, AltAST>>();
						labels.put(altInfo.altLabel, pairs);
					}

					pairs.add(new  <number, AltAST>(altInfo.altNum, altInfo.originalAltAST));
				}
			}
		}
		if ( this.recOpAlts!==null ) {
			for (let  i = 0; i < this.recOpAlts.size(); i++) {
				let  altInfo = this.recOpAlts.getElement(i);
				if ( altInfo.altLabel!==null ) {
					let  pairs = labels.get(altInfo.altLabel);
					if (pairs === null) {
						pairs = new  Array<<number, AltAST>>();
						labels.put(altInfo.altLabel, pairs);
					}

					pairs.add(new  <number, AltAST>(altInfo.altNum, altInfo.originalAltAST));
				}
			}
		}
		if ( labels.isEmpty() ) {
 return null;
}

		return labels;
	}
}
