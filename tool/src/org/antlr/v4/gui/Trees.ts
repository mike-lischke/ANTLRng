/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */


/* eslint-disable jsdoc/require-returns, jsdoc/require-param */


import { TreeViewer } from "./TreeViewer.js";
import { TreeTextProvider } from "./TreeTextProvider.js";
import { TreePostScriptGenerator } from "./TreePostScriptGenerator.js";
import { Parser, Utils } from "antlr4ng";



export  class Trees {

	private  constructor() {
	}
	/** Call this method to view a parse tree in a dialog box visually. */
	public static  inspect(t: TreeViewer.paint.#block#.Tree, ruleNames: Array<string>):  Future<JFrame>;

	/** Call this method to view a parse tree in a dialog box visually. */
	public static  inspect(t: TreeViewer.paint.#block#.Tree, parser: Parser):  Future<JFrame>;
public static inspect(...args: unknown[]):  Future<JFrame> {
		switch (args.length) {
			case 2: {
				const [t, ruleNames] = args as [TreeViewer.paint.#block#.Tree, Array<string>];


		let  viewer = new  TreeViewer(ruleNames, t);
		return viewer.open();
	

				break;
			}

			case 2: {
				const [t, parser] = args as [TreeViewer.paint.#block#.Tree, Parser];


		let  ruleNames = parser !== null ? Arrays.asList(parser.getRuleNames()) : null;
		return Trees.inspect(t, ruleNames);
	

				break;
			}

			default: {
				throw new java.lang.IllegalArgumentException(S`Invalid number of arguments`);
			}
		}
	}


	/** Save this tree in a postscript file */
	public static  save(t: TreeViewer.paint.#block#.Tree, parser: Parser, fileName: string):  void;

	/** Save this tree in a postscript file */
	public static  save(t: TreeViewer.paint.#block#.Tree, ruleNames: Array<string>, fileName: string):  void;

	/** Save this tree in a postscript file using a particular font name and size */
	public static  save(t: TreeViewer.paint.#block#.Tree, parser: Parser, fileName: string,
					 fontName: string, fontSize: number):  void;

	/** Save this tree in a postscript file using a particular font name and size */
	public static  save(t: TreeViewer.paint.#block#.Tree,
	                        ruleNames: Array<string>, fileName: string,
	                        fontName: string, fontSize: number):  void;
public static save(...args: unknown[]):  void {
		switch (args.length) {
			case 3: {
				const [t, parser, fileName] = args as [TreeViewer.paint.#block#.Tree, Parser, string];


		let  ruleNames = parser !== null ? Arrays.asList(parser.getRuleNames()) : null;
		Trees.save(t, ruleNames, fileName);
	

				break;
			}

			case 3: {
				const [t, ruleNames, fileName] = args as [TreeViewer.paint.#block#.Tree, Array<string>, string];


		Trees.writePS(t, ruleNames, fileName);
	

				break;
			}

			case 5: {
				const [t, parser, fileName, fontName, fontSize] = args as [TreeViewer.paint.#block#.Tree, Parser, string, string, number];


		let  ruleNames = parser !== null ? Arrays.asList(parser.getRuleNames()) : null;
		Trees.save(t, ruleNames, fileName, fontName, fontSize);
	

				break;
			}

			case 5: {
				const [t, ruleNames, fileName, fontName, fontSize] = args as [TreeViewer.paint.#block#.Tree, Array<string>, string, string, number];


		Trees.writePS(t, ruleNames, fileName, fontName, fontSize);
	

				break;
			}

			default: {
				throw new java.lang.IllegalArgumentException(S`Invalid number of arguments`);
			}
		}
	}


	public static  getPS(t: TreeViewer.paint.#block#.Tree, ruleNames: Array<string>):  string;

	public static  getPS(t: TreeViewer.paint.#block#.Tree, ruleNames: Array<string>,
							   fontName: string, fontSize: number):  string;
public static getPS(...args: unknown[]):  string {
		switch (args.length) {
			case 2: {
				const [t, ruleNames] = args as [TreeViewer.paint.#block#.Tree, Array<string>];


		return Trees.getPS(t, ruleNames, "Helvetica", 11);
	

				break;
			}

			case 4: {
				const [t, ruleNames, fontName, fontSize] = args as [TreeViewer.paint.#block#.Tree, Array<string>, string, number];


		let  psgen =
			new  TreePostScriptGenerator(ruleNames, t, fontName, fontSize);
		return psgen.getPS();
	

				break;
			}

			default: {
				throw new java.lang.IllegalArgumentException(S`Invalid number of arguments`);
			}
		}
	}


	public static  writePS(t: TreeViewer.paint.#block#.Tree, ruleNames: Array<string>, fileName: string):  void;

	public static  writePS(t: TreeViewer.paint.#block#.Tree, ruleNames: Array<string>,
							   fileName: string,
							   fontName: string, fontSize: number):  void;
public static writePS(...args: unknown[]):  void {
		switch (args.length) {
			case 3: {
				const [t, ruleNames, fileName] = args as [TreeViewer.paint.#block#.Tree, Array<string>, string];


		Trees.writePS(t, ruleNames, fileName, "Helvetica", 11);
	

				break;
			}

			case 5: {
				const [t, ruleNames, fileName, fontName, fontSize] = args as [TreeViewer.paint.#block#.Tree, Array<string>, string, string, number];


		let  ps = Trees.getPS(t, ruleNames, fontName, fontSize);
		let  f = new  FileWriter(fileName);
		let  bw = new  BufferedWriter(f);
		try {
			bw.write(ps);
		}
		finally {
			bw.close();
		}
	

				break;
			}

			default: {
				throw new java.lang.IllegalArgumentException(S`Invalid number of arguments`);
			}
		}
	}


	/** Print out a whole tree in LISP form. Arg nodeTextProvider is used on the
	 *  node payloads to get the text for the nodes.
	 *
	 *  @since 4.5.1
	 */
	public static  toStringTree(t: TreeViewer.paint.#block#.Tree, nodeTextProvider: TreeTextProvider):  string {
		if ( t===null ) {
 return "null";
}

		let  s = Utils.escapeWhitespace(nodeTextProvider.getText(t), false);
		if ( t.getChildCount()===0 ) {
 return s;
}

		let  buf = new  StringBuilder();
		buf.append("(");
		s = Utils.escapeWhitespace(nodeTextProvider.getText(t), false);
		buf.append(s);
		buf.append(' ');
		for (let  i = 0; i<t.getChildCount(); i++) {
			if ( i>0 ) {
 buf.append(' ');
}

			buf.append(Trees.toStringTree(t.getChild(i), nodeTextProvider));
		}
		buf.append(")");
		return buf.toString();
	}
}
