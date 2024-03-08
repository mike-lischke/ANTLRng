/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */


/* eslint-disable jsdoc/require-returns, jsdoc/require-param */


import { ATNVisitor } from "./ATNVisitor.js";
import { ATN, ATNState, BlockEndState, EpsilonTransition, PlusLoopbackState, RuleTransition, StarLoopbackState, Transition } from "antlr4ng";



/**
 *
 * @author Terence Parr
 */
export  class TailEpsilonRemover extends ATNVisitor {

	private readonly  _atn:  ATN;

	public  constructor(atn: ATN) {
		this._atn = atn;
	}

	@Override
public override  visitState(p: ATNState):  void {
		if (p.getStateType() === ATNState.BASIC && p.getNumberOfTransitions() === 1) {
			let  q = p.transition(0).target;
			if (p.transition(0) instanceof RuleTransition) {
				q = ( p.transition(0) as RuleTransition).followState;
			}
			if (q.getStateType() === ATNState.BASIC) {
				// we have p-x->q for x in {rule, action, pred, token, ...}
				// if edge out of q is single epsilon to block end
				// we can strip epsilon p-x->q-eps->r
				let  trans = q.transition(0);
				if (q.getNumberOfTransitions() === 1 && trans instanceof EpsilonTransition) {
					let  r = trans.target;
					if (r instanceof BlockEndState || r instanceof PlusLoopbackState || r instanceof StarLoopbackState) {
						// skip over q
						if (p.transition(0) instanceof RuleTransition) {
							( p.transition(0) as RuleTransition).followState = r;
						}
						else {
							p.transition(0).target = r;
						}
						this._atn.removeState(q);
					}
				}
			}
		}
	}
}
