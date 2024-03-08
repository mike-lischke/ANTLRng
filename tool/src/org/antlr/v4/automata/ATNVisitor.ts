/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */


/* eslint-disable jsdoc/require-returns, jsdoc/require-param */


import { ATNState, Transition, HashSet } from "antlr4ng";



/** A simple visitor that walks everywhere it can go starting from s,
 *  without going into an infinite cycle. Override and implement
 *  visitState() to provide functionality.
 */
export  class ATNVisitor {
	public  visit(s: ATNState):  void {
		this.visit_(s, new  HashSet<number>());
	}

	public  visit_(s: ATNState, visited: Set<number>):  void {
		if ( !visited.add(s.stateNumber) ) {
 return;
}

		visited.add(s.stateNumber);

		this.visitState(s);
		let  n = s.getNumberOfTransitions();
		for (let  i=0; i<n; i++) {
			let  t = s.transition(i);
			this.visit_(t.target, visited);
		}
	}

	public  visitState(s: ATNState):  void { }
}
