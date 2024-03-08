/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */


/* eslint-disable jsdoc/require-returns, jsdoc/require-param */


import { TreeViewer } from "./TreeViewer.js";



/** Adaptor ANTLR trees to {@link TreeForTreeLayout}. */
export  class TreeLayoutAdaptor implements TreeForTreeLayout<TreeViewer.paint.#block#.Tree> {
	public static AntlrTreeChildrenIterable =  class AntlrTreeChildrenIterable implements Iterable<TreeViewer.paint.#block#.Tree> {
		private readonly  tree:  TreeViewer.paint.#block#.Tree;

		public  constructor(tree: TreeViewer.paint.#block#.Tree) {
			this.tree = tree;
		}

		@Override
public  iterator():  Iterator<TreeViewer.paint.#block#.Tree> {
			return new  class extends Iterator<TreeViewer.paint.#block#.Tree> {
				private  i = 0;

				@Override
public  hasNext():  boolean {
					return $outer.tree.getChildCount() > this.i;
				}

				@Override
public  next():  TreeViewer.paint.#block#.Tree {
					if (!this.hasNext()) {

						throw new  NoSuchElementException();
}


					return $outer.tree.getChild(this.i++);
				}

				@Override
public  remove():  void {
					throw new  UnsupportedOperationException();
				}
			}();
		}
	};


	public static AntlrTreeChildrenReverseIterable =  class AntlrTreeChildrenReverseIterable implements
		Iterable<TreeViewer.paint.#block#.Tree>
	{
		private readonly  tree:  TreeViewer.paint.#block#.Tree;

		public  constructor(tree: TreeViewer.paint.#block#.Tree) {
			this.tree = tree;
		}

		@Override
public  iterator():  Iterator<TreeViewer.paint.#block#.Tree> {
			return new  class extends Iterator<TreeViewer.paint.#block#.Tree> {
				private  i = $outer.tree.getChildCount();

				@Override
public  hasNext():  boolean {
					return this.i > 0;
				}

				@Override
public  next():  TreeViewer.paint.#block#.Tree {
					if (!this.hasNext()) {

						throw new  NoSuchElementException();
}


					return $outer.tree.getChild(--this.i);
				}

				@Override
public  remove():  void {
					throw new  UnsupportedOperationException();
				}
			}();
		}
	};


	private  root:  TreeViewer.paint.#block#.Tree;

	public  constructor(root: TreeViewer.paint.#block#.Tree) {
		this.root = root;
	}

	@Override
public  isLeaf(node: TreeViewer.paint.#block#.Tree):  boolean {
		return node.getChildCount() === 0;
	}

	@Override
public  isChildOfParent(node: TreeViewer.paint.#block#.Tree, parentNode: TreeViewer.paint.#block#.Tree):  boolean {
		return node.getParent() === parentNode;
	}

	@Override
public  getRoot():  TreeViewer.paint.#block#.Tree {
		return this.root;
	}

	@Override
public  getLastChild(parentNode: TreeViewer.paint.#block#.Tree):  TreeViewer.paint.#block#.Tree {
		return parentNode.getChild(parentNode.getChildCount() - 1);
	}

	@Override
public  getFirstChild(parentNode: TreeViewer.paint.#block#.Tree):  TreeViewer.paint.#block#.Tree {
		return parentNode.getChild(0);
	}

	@Override
public  getChildrenReverse(node: TreeViewer.paint.#block#.Tree):  Iterable<TreeViewer.paint.#block#.Tree> {
		return new  TreeLayoutAdaptor.AntlrTreeChildrenReverseIterable(node);
	}

	@Override
public  getChildren(node: TreeViewer.paint.#block#.Tree):  Iterable<TreeViewer.paint.#block#.Tree> {
		return new  TreeLayoutAdaptor.AntlrTreeChildrenIterable(node);
	}
}

// eslint-disable-next-line @typescript-eslint/no-namespace, no-redeclare
export namespace TreeLayoutAdaptor {
	export type AntlrTreeChildrenIterable = InstanceType<typeof TreeLayoutAdaptor.AntlrTreeChildrenIterable>;
	export type AntlrTreeChildrenReverseIterable = InstanceType<typeof TreeLayoutAdaptor.AntlrTreeChildrenReverseIterable>;
}


