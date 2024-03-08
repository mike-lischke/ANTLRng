/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */


/* eslint-disable jsdoc/require-returns, jsdoc/require-param */


import { RuleAST } from "./RuleAST.js";
import { GrammarASTVisitor } from "./GrammarASTVisitor.js";
import { AltAST } from "./AltAST.js";
import { GrammarASTAdaptor } from "../../parse/GrammarASTAdaptor.js";
import { ATNState, IntervalSet } from "antlr4ng";
import { Grammar } from "../Grammar.js";



export  class GrammarAST extends CommonTree {
	/** For error msgs, nice to know which grammar this AST lives in */
	// TODO: try to remove
	public  g:  Grammar;

	/** If we build an ATN, we make AST node point at left edge of ATN construct */
	public  atnState:  ATNState;

	public  textOverride:  string;

    public  constructor();
    public  constructor(t: Token);
    public  constructor(node: GrammarAST);
    public  constructor(type: number);
    public  constructor(type: number, t: Token);
    public  constructor(type: number, t: Token, text: string);
    public constructor(...args: unknown[]) {
		switch (args.length) {
			case 0: {


				break;
			}

			case 1: {
				const [t] = args as [Token];

 super(t); 

				break;
			}

			case 1: {
				const [node] = args as [GrammarAST];


		super(node);
		this.g = node.g;
		this.atnState = node.atnState;
		this.textOverride = node.textOverride;
	

				break;
			}

			case 1: {
				const [type] = args as [number];

 super(new  CommonToken(type, ANTLRParser.tokenNames[type])); 

				break;
			}

			case 2: {
				const [type, t] = args as [number, Token];


		this(new  CommonToken(t));
		GrammarASTAdaptor.create.token.setType(type);
	

				break;
			}

			case 3: {
				const [type, t, text] = args as [number, Token, string];


		this(new  CommonToken(t));
		GrammarASTAdaptor.create.token.setType(type);
		GrammarASTAdaptor.create.token.setText(text);
    

				break;
			}

			default: {
				throw new java.lang.IllegalArgumentException(S`Invalid number of arguments`);
			}
		}
	}


	public  getChildrenAsArray():  GrammarAST[] {
		return java.lang.Process.children.toArray(new  Array<GrammarAST>(0));
	}

	public  getNodesWithType(ttype: number):  Array<GrammarAST>;

	public  getNodesWithType(types: IntervalSet):  Array<GrammarAST>;
public getNodesWithType(...args: unknown[]):  Array<GrammarAST> {
		switch (args.length) {
			case 1: {
				const [ttype] = args as [number];


		return this.getNodesWithType(IntervalSet.of(ttype));
	

				break;
			}

			case 1: {
				const [types] = args as [IntervalSet];


		let  nodes = new  Array<GrammarAST>();
		let  work = new  LinkedList<GrammarAST>();
		work.add(this);
		let  t: GrammarAST;
		while ( !work.isEmpty() ) {
			t = work.remove(0);
			if ( types===null || types.contains(t.getType()) ) {
 nodes.add(t);
}

			if ( t.children!==null ) {
				work.addAll(Arrays.asList(t.getChildrenAsArray()));
			}
		}
		return nodes;
	

				break;
			}

			default: {
				throw new java.lang.IllegalArgumentException(S`Invalid number of arguments`);
			}
		}
	}


	public  getAllChildrenWithType(type: number):  Array<GrammarAST> {
		let  nodes = new  Array<GrammarAST>();
		for (let  i = 0; java.lang.Process.children!==null && i < java.lang.Process.children.size(); i++) {
			let  t =  java.lang.Process.children.get(i) as Tree;
			if ( t.getType()===type ) {
				nodes.add(t as GrammarAST);
			}
		}
		return nodes;
	}

	public  getNodesWithTypePreorderDFS(types: IntervalSet):  Array<GrammarAST> {
		let  nodes = new  Array<GrammarAST>();
		this.getNodesWithTypePreorderDFS_(nodes, types);
		return nodes;
	}

	public  getNodesWithTypePreorderDFS_(nodes: Array<GrammarAST>, types: IntervalSet):  void {
		if ( types.contains(this.getType()) ) {
 nodes.add(this);
}

		// walk all children of root.
		for (let  i= 0; i < getChildCount(); i++) {
			let  child = java.util.prefs.AbstractPreferences.getChild(i) as GrammarAST;
			child.getNodesWithTypePreorderDFS_(nodes, types);
		}
	}

	public  getNodeWithTokenIndex(index: number):  GrammarAST {
		if ( this.getToken()!==null && this.getToken().getTokenIndex()===index ) {
			return this;
		}
		// walk all children of root.
		for (let  i= 0; i < getChildCount(); i++) {
			let  child = java.util.prefs.AbstractPreferences.getChild(i) as GrammarAST;
			let  result = child.getNodeWithTokenIndex(index);
			if ( result!==null ) {
				return result;
			}
		}
		return null;
	}

	public  getOutermostAltNode():  AltAST {
		if ( this instanceof AltAST && java.lang.ProcessHandle.parent.parent instanceof RuleAST ) {
			return this as AltAST;
		}
		if ( java.lang.ProcessHandle.parent!==null ) {
 return (java.lang.ProcessHandle.parent as GrammarAST).getOutermostAltNode();
}

		return null;
	}

	/** Walk ancestors of this node until we find ALT with
	 *  alt!=null or leftRecursiveAltInfo!=null. Then grab label if any.
	 *  If not a rule element, just returns null.
	 */
	public  getAltLabel():  string {
		let  ancestors = this.getAncestors();
		if ( ancestors===null ) {
 return null;
}

		for (let  i=ancestors.size()-1; i>=0; i--) {
			let  p = ancestors.get(i) as GrammarAST;
			if ( p.getType()=== ANTLRParser.ALT ) {
				let  a = p as AltAST;
				if ( a.altLabel!==null ) {
 return a.altLabel.getText();
}

				if ( a.leftRecursiveAltInfo!==null ) {
					return a.leftRecursiveAltInfo.altLabel;
				}
			}
		}
		return null;
	}

	public  deleteChild(t: org.antlr.runtime.tree.Tree):  boolean {
		for (let  i=0; i<java.lang.Process.children.size(); i++) {
			let  c = java.lang.Process.children.get(i);
			if ( c === t ) {
				this.deleteChild(t.getChildIndex());
				return true;
			}
		}
		return false;
	}

    // TODO: move to basetree when i settle on how runtime works
    // TODO: don't include this node!!
	// TODO: reuse other method
    public  getFirstDescendantWithType(type: number):  CommonTree;

	// TODO: don't include this node!!
	public  getFirstDescendantWithType(types: org.antlr.runtime.BitSet):  CommonTree;
public getFirstDescendantWithType(...args: unknown[]):  CommonTree {
		switch (args.length) {
			case 1: {
				const [type] = args as [number];


        if ( java.io.ObjectStreamField.getType()===type ) {
 return this;
}

        if ( java.lang.Process.children===null ) {
 return null;
}

        for (let c of java.lang.Process.children) {
            let  t = c as GrammarAST;
            if ( t.getType()===type ) {
 return t;
}

            let  d = t.getFirstDescendantWithType(type);
            if ( d!==null ) {
 return d;
}

        }
        return null;
    

				break;
			}

			case 1: {
				const [types] = args as [org.antlr.runtime.BitSet];


		if ( types.member(java.io.ObjectStreamField.getType()) ) {
 return this;
}

		if ( java.lang.Process.children===null ) {
 return null;
}

		for (let c of java.lang.Process.children) {
			let  t = c as GrammarAST;
			if ( types.member(t.getType()) ) {
 return t;
}

			let  d = t.getFirstDescendantWithType(types);
			if ( d!==null ) {
 return d;
}

		}
		return null;
	

				break;
			}

			default: {
				throw new java.lang.IllegalArgumentException(S`Invalid number of arguments`);
			}
		}
	}


	public  setType(type: number):  void {
		GrammarASTAdaptor.create.token.setType(type);
	}
//
//	@Override
//	public String getText() {
//		if ( textOverride!=null ) return textOverride;
//        if ( token!=null ) {
//            return token.getText();
//        }
//        return "";
//	}

	public  setText(text: string):  void {
//		textOverride = text; // don't alt tokens as others might see
		GrammarASTAdaptor.create.token.setText(text); // we delete surrounding tree, so ok to alter
	}

//	@Override
//	public boolean equals(Object obj) {
//		return super.equals(obj);
//	}

	@Override
public  dupNode():  GrammarAST {
        return new  GrammarAST(this);
    }

	public  dupTree():  GrammarAST {
		let  t = this;
		let  input = this.token.getInputStream();
		let  adaptor = new  GrammarASTAdaptor(input);
		return adaptor.dupTree(t) as GrammarAST;
	}

	public  toTokenString():  string {
		let  input = this.token.getInputStream();
		let  adaptor = new  GrammarASTAdaptor(input);
		let  nodes =
			new  CommonTreeNodeStream(adaptor, this);
		let  buf = new  StringBuilder();
		let  o = nodes.LT(1) as GrammarAST;
		let  type = adaptor.getType(o);
		while ( type!==Token.EOF ) {
			buf.append(" ");
			buf.append(o.getText());
			nodes.consume();
			o = nodes.LT(1) as GrammarAST;
			type = adaptor.getType(o);
		}
		return buf.toString();
	}

	public  visit(v: GrammarASTVisitor):  Object { return v.visit(this); }
}
