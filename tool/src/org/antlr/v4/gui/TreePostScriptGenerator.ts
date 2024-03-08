/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */


/* eslint-disable jsdoc/require-returns, jsdoc/require-param */


import { TreeViewer } from "./TreeViewer.js";
import { TreeTextProvider } from "./TreeTextProvider.js";
import { TreeLayoutAdaptor } from "./TreeLayoutAdaptor.js";
import { PostScriptDocument } from "./PostScriptDocument.js";
import { Utils, ErrorNode } from "antlr4ng";



export  class TreePostScriptGenerator {
	public VariableExtentProvide = (($outer) => {
return  class VariableExtentProvide implements NodeExtentProvider<TreeViewer.paint.#block#.Tree> {
		@Override
public  getWidth(tree: TreeViewer.paint.#block#.Tree):  number {
			let  s = $outer.getText(tree);
			return $outer.doc.getWidth(s) + $outer.nodeWidthPadding*2;
		}

		@Override
public  getHeight(tree: TreeViewer.paint.#block#.Tree):  number {
			let  s = $outer.getText(tree);
			let  h =
				$outer.doc.getLineHeight() + $outer.nodeHeightPaddingAbove + $outer.nodeHeightPaddingBelow;
			let  lines = s.split("\n");
			return h * lines.length;
		}
	}
})(this);


	protected  gapBetweenLevels = 17;
	protected  gapBetweenNodes = 7;
	protected  nodeWidthPadding = 1;  // added to left/right
	protected  nodeHeightPaddingAbove = 0;
	protected  nodeHeightPaddingBelow = 5;

	protected  root:  TreeViewer.paint.#block#.Tree;
	protected  treeTextProvider:  TreeTextProvider;
	protected  treeLayout:  TreeLayout<TreeViewer.paint.#block#.Tree>;

	protected  doc:  PostScriptDocument;

	public  constructor(ruleNames: Array<string>, root: TreeViewer.paint.#block#.Tree);

	public  constructor(ruleNames: Array<string>, root: TreeViewer.paint.#block#.Tree,
								   fontName: string, fontSize: number);
    public constructor(...args: unknown[]) {
		switch (args.length) {
			case 2: {
				const [ruleNames, root] = args as [Array<string>, TreeViewer.paint.#block#.Tree];


		this(ruleNames, root, PostScriptDocument.DEFAULT_FONT, 11);
	

				break;
			}

			case 4: {
				const [ruleNames, root, fontName, fontSize] = args as [Array<string>, TreeViewer.paint.#block#.Tree, string, number];


		this.root = root;
		this.setTreeTextProvider(new  TreeViewer.DefaultTreeTextProvider(ruleNames));
		this.doc = new  PostScriptDocument(fontName, fontSize);
		let  compareNodeIdentities = true;
		this.treeLayout =
			new  TreeLayout<TreeViewer.paint.#block#.Tree>(this.getTreeLayoutAdaptor(root),
								 new  TreeViewer.VariableExtentProvide(),
								 new  DefaultConfiguration<TreeViewer.paint.#block#.Tree>(this.gapBetweenLevels,
																this.gapBetweenNodes,
																java.lang.module.Configuration.Location.Bottom),
                                 compareNodeIdentities);
	

				break;
			}

			default: {
				throw new java.lang.IllegalArgumentException(S`Invalid number of arguments`);
			}
		}
	}


	/** Get an adaptor for root that indicates how to walk ANTLR trees.
	 *  Override to change the adapter from the default of {@link TreeLayoutAdaptor}  */
	public  getTreeLayoutAdaptor(root: TreeViewer.paint.#block#.Tree):  TreeForTreeLayout<TreeViewer.paint.#block#.Tree> {
		return new  TreeLayoutAdaptor(root);
	}

	public  getPS():  string {
		// generate the edges and boxes (with text)
		this.generateEdges(this.getTree().getRoot());
		for (let node of this.treeLayout.getNodeBounds().keySet()) {
			this.generateNode(node);
		}

		let  size = this.treeLayout.getBounds().getBounds().getSize();
		this.doc.boundingBox(size.width, size.height);
		this.doc.close();
		return this.doc.getPS();
	}

	public  getTreeTextProvider():  TreeTextProvider {
		return this.treeTextProvider;
	}

	public  setTreeTextProvider(treeTextProvider: TreeTextProvider):  void {
		this.treeTextProvider = treeTextProvider;
	}

	protected  generateEdges(parent: TreeViewer.paint.#block#.Tree):  void {
		if (!this.getTree().isLeaf(parent)) {
			let  parentBounds = this.getBoundsOfNode(parent);
//			System.out.println("%% parent("+getText(parent)+")="+parentBounds);
			let  x1 = parentBounds.getCenterX();
			let  y1 = parentBounds.y;
			for (let child of this.getChildren(parent)) {
				let  childBounds = this.getBoundsOfNode(child);
//				System.out.println("%% child("+getText(child)+")="+childBounds);
				let  x2 = childBounds.getCenterX();
				let  y2 = childBounds.getMaxY();
				this.doc.line(x1, y1, x2, y2);
				this.generateEdges(child);
			}
		}
	}

	protected  generateNode(t: TreeViewer.paint.#block#.Tree):  void {
		// draw the text on top of the box (possibly multiple lines)
		let  lines = this.getText(t).split("\n");
		let  box = this.getBoundsOfNode(t);
		// for debugging, turn this on to see boundingbox of nodes
		//doc.rect(box.x, box.y, box.width, box.height);
		// make error nodes from parse tree red by default
		if ( t instanceof ErrorNode ) {
			this.doc.highlight(box.x, box.y, box.width, box.height);
		}
		let  x = box.x+this.nodeWidthPadding;
		let  y = box.y+this.nodeHeightPaddingBelow;
		for (let  i = 0; i < lines.length; i++) {
			this.doc.text(lines[i], x, y);
			y += this.doc.getLineHeight();
		}
	}

	protected  getTree():  TreeForTreeLayout<TreeViewer.paint.#block#.Tree> {
		return this.treeLayout.getTree();
	}

	protected  getChildren(parent: TreeViewer.paint.#block#.Tree):  Iterable<TreeViewer.paint.#block#.Tree> {
		return this.getTree().getChildren(parent);
	}

	protected  getBoundsOfNode(node: TreeViewer.paint.#block#.Tree):  Rectangle2D.Double {
		return this.treeLayout.getNodeBounds().get(node);
	}

	protected  getText(tree: TreeViewer.paint.#block#.Tree):  string {
		let  s = this.treeTextProvider.getText(tree);
		s = Utils.escapeWhitespace(s, false);
		return s;
	}

}

// eslint-disable-next-line @typescript-eslint/no-namespace, no-redeclare
export namespace TreePostScriptGenerator {
	export type VariableExtentProvide = InstanceType<TreePostScriptGenerator["VariableExtentProvide"]>;
}


