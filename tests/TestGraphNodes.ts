/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */


/* eslint-disable jsdoc/require-returns, jsdoc/require-param */


import { ArrayPredictionContext, EmptyPredictionContext, PredictionContext, SingletonPredictionContext } from "antlr4ng";



export  class TestGraphNodes {

	private static  toDOTString(context: PredictionContext, rootIsWildcard: boolean):  string {
		let  nodes = new  StringBuilder();
		let  edges = new  StringBuilder();
		let  visited = new  IdentityHashMap<PredictionContext, PredictionContext>();
		let  contextIds = new  IdentityHashMap<PredictionContext, number>();
		let  workList = new  ArrayDeque<PredictionContext>();
		visited.put(context, context);
		contextIds.put(context, contextIds.size());
		workList.add(context);
		while (!workList.isEmpty()) {
			let  current = workList.pop();
			nodes.append("  s").append(contextIds.get(current)).append('[');

			if (current.size() > 1) {
				nodes.append("shape=record, ");
			}

			nodes.append("label=\"");

			if (current.isEmpty()) {
				nodes.append(rootIsWildcard ? '*' : '$');
			} else {
 if (current.size() > 1) {
				for (let  i = 0; i < current.size(); i++) {
					if (i > 0) {
						nodes.append('|');
					}

					nodes.append("<p").append(i).append('>');
					if (current.getReturnState(i) === PredictionContext.EMPTY_RETURN_STATE) {
						nodes.append(rootIsWildcard ? '*' : '$');
					}
				}
			} else {
				nodes.append(contextIds.get(current));
			}
}


			nodes.append("\"];\n");

			if (current.isEmpty()) {
				continue;
			}

			for (let  i = 0; i < current.size(); i++) {
				if (current.getReturnState(i) === PredictionContext.EMPTY_RETURN_STATE) {
					continue;
				}

				if (visited.put(current.getParent(i), current.getParent(i)) === null) {
					contextIds.put(current.getParent(i), contextIds.size());
					workList.push(current.getParent(i));
				}

				edges.append("  s").append(contextIds.get(current));
				if (current.size() > 1) {
					edges.append(":p").append(i);
				}

				edges.append("->");
				edges.append('s').append(contextIds.get(current.getParent(i)));
				edges.append("[label=\"").append(current.getReturnState(i)).append("\"]");
				edges.append(";\n");
			}
		}

		let  builder = new  StringBuilder();
		builder.append("digraph G {\n");
		builder.append("rankdir=LR;\n");
		builder.append(nodes);
		builder.append(edges);
		builder.append("}\n");
		return builder.toString();
	}
	public  rootIsWildcard():  boolean { return true; }
	public  fullCtx():  boolean { return false; }

	@Test
public  test_$_$():  void {
		let  r = PredictionContext.merge(
				EmptyPredictionContext.Instance, EmptyPredictionContext.Instance, this.rootIsWildcard(), null);
//		System.out.println(toDOTString(r, rootIsWildcard()));
		let  expecting =
			"digraph G {\n" +
			"rankdir=LR;\n" +
			"  s0[label=\"*\"];\n" +
			"}\n";
		assertEquals(expecting, TestGraphNodes.toDOTString(r, this.rootIsWildcard()));
	}

	@Test
public  test_$_$_fullctx():  void {
		let  r = PredictionContext.merge(
				EmptyPredictionContext.Instance, EmptyPredictionContext.Instance, this.fullCtx(), null);
//		System.out.println(toDOTString(r, fullCtx()));
		let  expecting =
			"digraph G {\n" +
			"rankdir=LR;\n" +
			"  s0[label=\"$\"];\n" +
			"}\n";
		assertEquals(expecting, TestGraphNodes.toDOTString(r, this.fullCtx()));
	}

	@Test
public  test_x_$():  void {
		let  r = PredictionContext.merge(this.x(), EmptyPredictionContext.Instance, this.rootIsWildcard(), null);
//		System.out.println(toDOTString(r, rootIsWildcard()));
		let  expecting =
			"digraph G {\n" +
			"rankdir=LR;\n" +
			"  s0[label=\"*\"];\n" +
			"}\n";
		assertEquals(expecting, TestGraphNodes.toDOTString(r, this.rootIsWildcard()));
	}

	@Test
public  test_x_$_fullctx():  void {
		let  r = PredictionContext.merge(this.x(), EmptyPredictionContext.Instance, this.fullCtx(), null);
//		System.out.println(toDOTString(r, fullCtx()));
		let  expecting =
			"digraph G {\n" +
			"rankdir=LR;\n" +
			"  s0[shape=record, label=\"<p0>|<p1>$\"];\n" +
			"  s1[label=\"$\"];\n" +
			"  s0:p0->s1[label=\"9\"];\n" +
			"}\n";
		assertEquals(expecting, TestGraphNodes.toDOTString(r, this.fullCtx()));
	}

	@Test
public  test_$_x():  void {
		let  r = PredictionContext.merge(EmptyPredictionContext.Instance, this.x(), this.rootIsWildcard(), null);
//		System.out.println(toDOTString(r, rootIsWildcard()));
		let  expecting =
			"digraph G {\n" +
			"rankdir=LR;\n" +
			"  s0[label=\"*\"];\n" +
			"}\n";
		assertEquals(expecting, TestGraphNodes.toDOTString(r, this.rootIsWildcard()));
	}

	@Test
public  test_$_x_fullctx():  void {
		let  r = PredictionContext.merge(EmptyPredictionContext.Instance, this.x(), this.fullCtx(), null);
//		System.out.println(toDOTString(r, fullCtx()));
		let  expecting =
			"digraph G {\n" +
			"rankdir=LR;\n" +
			"  s0[shape=record, label=\"<p0>|<p1>$\"];\n" +
			"  s1[label=\"$\"];\n" +
			"  s0:p0->s1[label=\"9\"];\n" +
			"}\n";
		assertEquals(expecting, TestGraphNodes.toDOTString(r, this.fullCtx()));
	}

	@Test
public  test_a_a():  void {
		let  r = PredictionContext.merge(this.a(), this.a(), this.rootIsWildcard(), null);
//		System.out.println(toDOTString(r, rootIsWildcard()));
		let  expecting =
			"digraph G {\n" +
			"rankdir=LR;\n" +
			"  s0[label=\"0\"];\n" +
			"  s1[label=\"*\"];\n" +
			"  s0->s1[label=\"1\"];\n" +
			"}\n";
		assertEquals(expecting, TestGraphNodes.toDOTString(r, this.rootIsWildcard()));
	}

	@Test
public  test_a$_ax():  void {
		let  a1 = this.a();
		let  x = x();
		let  a2 = this.createSingleton(x, 1);
		let  r = PredictionContext.merge(a1, a2, this.rootIsWildcard(), null);
//		System.out.println(toDOTString(r, rootIsWildcard()));
		let  expecting =
			"digraph G {\n" +
			"rankdir=LR;\n" +
			"  s0[label=\"0\"];\n" +
			"  s1[label=\"*\"];\n" +
			"  s0->s1[label=\"1\"];\n" +
			"}\n";
		assertEquals(expecting, TestGraphNodes.toDOTString(r, this.rootIsWildcard()));
	}

	@Test
public  test_a$_ax_fullctx():  void {
		let  a1 = this.a();
		let  x = x();
		let  a2 = this.createSingleton(x, 1);
		let  r = PredictionContext.merge(a1, a2, this.fullCtx(), null);
//		System.out.println(toDOTString(r, fullCtx()));
		let  expecting =
			"digraph G {\n" +
			"rankdir=LR;\n" +
			"  s0[label=\"0\"];\n" +
			"  s1[shape=record, label=\"<p0>|<p1>$\"];\n" +
			"  s2[label=\"$\"];\n" +
			"  s0->s1[label=\"1\"];\n" +
			"  s1:p0->s2[label=\"9\"];\n" +
			"}\n";
		assertEquals(expecting, TestGraphNodes.toDOTString(r, this.fullCtx()));
	}

	@Test
public  test_ax$_a$():  void {
		let  x = x();
		let  a1 = this.createSingleton(x, 1);
		let  a2 = this.a();
		let  r = PredictionContext.merge(a1, a2, this.rootIsWildcard(), null);
//		System.out.println(toDOTString(r, rootIsWildcard()));
		let  expecting =
			"digraph G {\n" +
			"rankdir=LR;\n" +
			"  s0[label=\"0\"];\n" +
			"  s1[label=\"*\"];\n" +
			"  s0->s1[label=\"1\"];\n" +
			"}\n";
		assertEquals(expecting, TestGraphNodes.toDOTString(r, this.rootIsWildcard()));
	}

	@Test
public  test_aa$_a$_$_fullCtx():  void {
		let  empty = EmptyPredictionContext.Instance;
		let  child1 = this.createSingleton(empty, 8);
		let  right = PredictionContext.merge(empty, child1, false, null);
		let  left = this.createSingleton(right, 8);
		let  merged = PredictionContext.merge(left, right, false, null);
		let  actual = TestGraphNodes.toDOTString(merged, false);
//		System.out.println(actual);
		let  expecting =
			"digraph G {\n" +
			"rankdir=LR;\n" +
			"  s0[shape=record, label=\"<p0>|<p1>$\"];\n" +
			"  s1[shape=record, label=\"<p0>|<p1>$\"];\n" +
			"  s2[label=\"$\"];\n" +
			"  s0:p0->s1[label=\"8\"];\n" +
			"  s1:p0->s2[label=\"8\"];\n" +
			"}\n";
		assertEquals(expecting, actual);
	}

	@Test
public  test_ax$_a$_fullctx():  void {
		let  x = x();
		let  a1 = this.createSingleton(x, 1);
		let  a2 = this.a();
		let  r = PredictionContext.merge(a1, a2, this.fullCtx(), null);
//		System.out.println(toDOTString(r, fullCtx()));
		let  expecting =
			"digraph G {\n" +
			"rankdir=LR;\n" +
			"  s0[label=\"0\"];\n" +
			"  s1[shape=record, label=\"<p0>|<p1>$\"];\n" +
			"  s2[label=\"$\"];\n" +
			"  s0->s1[label=\"1\"];\n" +
			"  s1:p0->s2[label=\"9\"];\n" +
			"}\n";
		assertEquals(expecting, TestGraphNodes.toDOTString(r, this.fullCtx()));
	}

	@Test
public  test_a_b():  void {
		let  r = PredictionContext.merge(this.a(), this.b(), this.rootIsWildcard(), null);
//		System.out.println(toDOTString(r, rootIsWildcard()));
		let  expecting =
			"digraph G {\n" +
			"rankdir=LR;\n" +
			"  s0[shape=record, label=\"<p0>|<p1>\"];\n" +
			"  s1[label=\"*\"];\n" +
			"  s0:p0->s1[label=\"1\"];\n" +
			"  s0:p1->s1[label=\"2\"];\n" +
			"}\n";
		assertEquals(expecting, TestGraphNodes.toDOTString(r, this.rootIsWildcard()));
	}

	@Test
public  test_ax_ax_same():  void {
		let  x = x();
		let  a1 = this.createSingleton(x, 1);
		let  a2 = this.createSingleton(x, 1);
		let  r = PredictionContext.merge(a1, a2, this.rootIsWildcard(), null);
//		System.out.println(toDOTString(r, rootIsWildcard()));
		let  expecting =
			"digraph G {\n" +
			"rankdir=LR;\n" +
			"  s0[label=\"0\"];\n" +
			"  s1[label=\"1\"];\n" +
			"  s2[label=\"*\"];\n" +
			"  s0->s1[label=\"1\"];\n" +
			"  s1->s2[label=\"9\"];\n" +
			"}\n";
		assertEquals(expecting, TestGraphNodes.toDOTString(r, this.rootIsWildcard()));
	}

	@Test
public  test_ax_ax():  void {
		let  x1 = this.x();
		let  x2 = this.x();
		let  a1 = this.createSingleton(x1, 1);
		let  a2 = this.createSingleton(x2, 1);
		let  r = PredictionContext.merge(a1, a2, this.rootIsWildcard(), null);
//		System.out.println(toDOTString(r, rootIsWildcard()));
		let  expecting =
			"digraph G {\n" +
			"rankdir=LR;\n" +
			"  s0[label=\"0\"];\n" +
			"  s1[label=\"1\"];\n" +
			"  s2[label=\"*\"];\n" +
			"  s0->s1[label=\"1\"];\n" +
			"  s1->s2[label=\"9\"];\n" +
			"}\n";
		assertEquals(expecting, TestGraphNodes.toDOTString(r, this.rootIsWildcard()));
	}

	@Test
public  test_abx_abx():  void {
		let  x1 = this.x();
		let  x2 = this.x();
		let  b1 = this.createSingleton(x1, 2);
		let  b2 = this.createSingleton(x2, 2);
		let  a1 = this.createSingleton(b1, 1);
		let  a2 = this.createSingleton(b2, 1);
		let  r = PredictionContext.merge(a1, a2, this.rootIsWildcard(), null);
//		System.out.println(toDOTString(r, rootIsWildcard()));
		let  expecting =
			"digraph G {\n" +
			"rankdir=LR;\n" +
			"  s0[label=\"0\"];\n" +
			"  s1[label=\"1\"];\n" +
			"  s2[label=\"2\"];\n" +
			"  s3[label=\"*\"];\n" +
			"  s0->s1[label=\"1\"];\n" +
			"  s1->s2[label=\"2\"];\n" +
			"  s2->s3[label=\"9\"];\n" +
			"}\n";
		assertEquals(expecting, TestGraphNodes.toDOTString(r, this.rootIsWildcard()));
	}

	@Test
public  test_abx_acx():  void {
		let  x1 = this.x();
		let  x2 = this.x();
		let  b = this.createSingleton(x1, 2);
		let  c = this.createSingleton(x2, 3);
		let  a1 = this.createSingleton(b, 1);
		let  a2 = this.createSingleton(c, 1);
		let  r = PredictionContext.merge(a1, a2, this.rootIsWildcard(), null);
//		System.out.println(toDOTString(r, rootIsWildcard()));
		let  expecting =
			"digraph G {\n" +
			"rankdir=LR;\n" +
			"  s0[label=\"0\"];\n" +
			"  s1[shape=record, label=\"<p0>|<p1>\"];\n" +
			"  s2[label=\"2\"];\n" +
			"  s3[label=\"*\"];\n" +
			"  s0->s1[label=\"1\"];\n" +
			"  s1:p0->s2[label=\"2\"];\n" +
			"  s1:p1->s2[label=\"3\"];\n" +
			"  s2->s3[label=\"9\"];\n" +
			"}\n";
		assertEquals(expecting, TestGraphNodes.toDOTString(r, this.rootIsWildcard()));
	}

	@Test
public  test_ax_bx_same():  void {
		let  x = x();
		let  a = this.createSingleton(x, 1);
		let  b = this.createSingleton(x, 2);
		let  r = PredictionContext.merge(a, b, this.rootIsWildcard(), null);
//		System.out.println(toDOTString(r, rootIsWildcard()));
		let  expecting =
			"digraph G {\n" +
			"rankdir=LR;\n" +
			"  s0[shape=record, label=\"<p0>|<p1>\"];\n" +
			"  s1[label=\"1\"];\n" +
			"  s2[label=\"*\"];\n" +
			"  s0:p0->s1[label=\"1\"];\n" +
			"  s0:p1->s1[label=\"2\"];\n" +
			"  s1->s2[label=\"9\"];\n" +
			"}\n";
		assertEquals(expecting, TestGraphNodes.toDOTString(r, this.rootIsWildcard()));
	}

	@Test
public  test_ax_bx():  void {
		let  x1 = this.x();
		let  x2 = this.x();
		let  a = this.createSingleton(x1, 1);
		let  b = this.createSingleton(x2, 2);
		let  r = PredictionContext.merge(a, b, this.rootIsWildcard(), null);
//		System.out.println(toDOTString(r, rootIsWildcard()));
		let  expecting =
			"digraph G {\n" +
			"rankdir=LR;\n" +
			"  s0[shape=record, label=\"<p0>|<p1>\"];\n" +
			"  s1[label=\"1\"];\n" +
			"  s2[label=\"*\"];\n" +
			"  s0:p0->s1[label=\"1\"];\n" +
			"  s0:p1->s1[label=\"2\"];\n" +
			"  s1->s2[label=\"9\"];\n" +
			"}\n";
		assertEquals(expecting, TestGraphNodes.toDOTString(r, this.rootIsWildcard()));
	}

	@Test
public  test_ax_by():  void {
		let  a = this.createSingleton(this.x(), 1);
		let  b = this.createSingleton(this.y(), 2);
		let  r = PredictionContext.merge(a, b, this.rootIsWildcard(), null);
//		System.out.println(toDOTString(r, rootIsWildcard()));
		let  expecting =
			"digraph G {\n" +
			"rankdir=LR;\n" +
			"  s0[shape=record, label=\"<p0>|<p1>\"];\n" +
			"  s2[label=\"2\"];\n" +
			"  s3[label=\"*\"];\n" +
			"  s1[label=\"1\"];\n" +
			"  s0:p0->s1[label=\"1\"];\n" +
			"  s0:p1->s2[label=\"2\"];\n" +
			"  s2->s3[label=\"10\"];\n" +
			"  s1->s3[label=\"9\"];\n" +
			"}\n";
		assertEquals(expecting, TestGraphNodes.toDOTString(r, this.rootIsWildcard()));
	}

	@Test
public  test_a$_bx():  void {
		let  x2 = this.x();
		let  a = a();
		let  b = this.createSingleton(x2, 2);
		let  r = PredictionContext.merge(a, b, this.rootIsWildcard(), null);
//		System.out.println(toDOTString(r, rootIsWildcard()));
		let  expecting =
			"digraph G {\n" +
			"rankdir=LR;\n" +
			"  s0[shape=record, label=\"<p0>|<p1>\"];\n" +
			"  s2[label=\"2\"];\n" +
			"  s1[label=\"*\"];\n" +
			"  s0:p0->s1[label=\"1\"];\n" +
			"  s0:p1->s2[label=\"2\"];\n" +
			"  s2->s1[label=\"9\"];\n" +
			"}\n";
		assertEquals(expecting, TestGraphNodes.toDOTString(r, this.rootIsWildcard()));
	}

	@Test
public  test_a$_bx_fullctx():  void {
		let  x2 = this.x();
		let  a = a();
		let  b = this.createSingleton(x2, 2);
		let  r = PredictionContext.merge(a, b, this.fullCtx(), null);
//		System.out.println(toDOTString(r, fullCtx()));
		let  expecting =
			"digraph G {\n" +
			"rankdir=LR;\n" +
			"  s0[shape=record, label=\"<p0>|<p1>\"];\n" +
			"  s2[label=\"2\"];\n" +
			"  s1[label=\"$\"];\n" +
			"  s0:p0->s1[label=\"1\"];\n" +
			"  s0:p1->s2[label=\"2\"];\n" +
			"  s2->s1[label=\"9\"];\n" +
			"}\n";
		assertEquals(expecting, TestGraphNodes.toDOTString(r, this.fullCtx()));
	}

	@Disabled("Known inefficiency but deferring resolving the issue for now")
@Disabled("Known inefficiency but deferring resolving the issue for now")

	@Test
public  test_aex_bfx():  void {
		// TJP: this is inefficient as it leaves the top x nodes unmerged.
		let  x1 = this.x();
		let  x2 = this.x();
		let  e = this.createSingleton(x1, 5);
		let  f = this.createSingleton(x2, 6);
		let  a = this.createSingleton(e, 1);
		let  b = this.createSingleton(f, 2);
		let  r = PredictionContext.merge(a, b, this.rootIsWildcard(), null);
//		System.out.println(toDOTString(r, rootIsWildcard()));
		let  expecting =
			"digraph G {\n" +
			"rankdir=LR;\n" +
			"  s0[shape=record, label=\"<p0>|<p1>\"];\n" +
			"  s2[label=\"2\"];\n" +
			"  s3[label=\"3\"];\n" +
			"  s4[label=\"*\"];\n" +
			"  s1[label=\"1\"];\n" +
			"  s0:p0->s1[label=\"1\"];\n" +
			"  s0:p1->s2[label=\"2\"];\n" +
			"  s2->s3[label=\"6\"];\n" +
			"  s3->s4[label=\"9\"];\n" +
			"  s1->s3[label=\"5\"];\n" +
			"}\n";
		assertEquals(expecting, TestGraphNodes.toDOTString(r, this.rootIsWildcard()));
	}

	// Array merges

	@Test
public  test_A$_A$_fullctx():  void {
		let  A1 = this.array(EmptyPredictionContext.Instance);
		let  A2 = this.array(EmptyPredictionContext.Instance);
		let  r = PredictionContext.merge(A1, A2, this.fullCtx(), null);
//		System.out.println(toDOTString(r, fullCtx()));
		let  expecting =
			"digraph G {\n" +
			"rankdir=LR;\n" +
			"  s0[label=\"$\"];\n" +
			"}\n";
		assertEquals(expecting, TestGraphNodes.toDOTString(r, this.fullCtx()));
	}

	@Test
public  test_Aab_Ac():  void { // a,b + c
		let  a = a();
		let  b = b();
		let  c = c();
		let  A1 = this.array(a, b);
		let  A2 = this.array(c);
		let  r = PredictionContext.merge(A1, A2, this.rootIsWildcard(), null);
//		System.out.println(toDOTString(r, rootIsWildcard()));
		let  expecting =
			"digraph G {\n" +
			"rankdir=LR;\n" +
			"  s0[shape=record, label=\"<p0>|<p1>|<p2>\"];\n" +
			"  s1[label=\"*\"];\n" +
			"  s0:p0->s1[label=\"1\"];\n" +
			"  s0:p1->s1[label=\"2\"];\n" +
			"  s0:p2->s1[label=\"3\"];\n" +
			"}\n";
		assertEquals(expecting, TestGraphNodes.toDOTString(r, this.rootIsWildcard()));
	}

	@Test
public  test_Aa_Aa():  void {
		let  a1 = this.a();
		let  a2 = this.a();
		let  A1 = this.array(a1);
		let  A2 = this.array(a2);
		let  r = PredictionContext.merge(A1, A2, this.rootIsWildcard(), null);
//		System.out.println(toDOTString(r, rootIsWildcard()));
		let  expecting =
			"digraph G {\n" +
			"rankdir=LR;\n" +
			"  s0[label=\"0\"];\n" +
			"  s1[label=\"*\"];\n" +
			"  s0->s1[label=\"1\"];\n" +
			"}\n";
		assertEquals(expecting, TestGraphNodes.toDOTString(r, this.rootIsWildcard()));
	}

	@Test
public  test_Aa_Abc():  void { // a + b,c
		let  a = a();
		let  b = b();
		let  c = c();
		let  A1 = this.array(a);
		let  A2 = this.array(b, c);
		let  r = PredictionContext.merge(A1, A2, this.rootIsWildcard(), null);
//		System.out.println(toDOTString(r, rootIsWildcard()));
		let  expecting =
			"digraph G {\n" +
			"rankdir=LR;\n" +
			"  s0[shape=record, label=\"<p0>|<p1>|<p2>\"];\n" +
			"  s1[label=\"*\"];\n" +
			"  s0:p0->s1[label=\"1\"];\n" +
			"  s0:p1->s1[label=\"2\"];\n" +
			"  s0:p2->s1[label=\"3\"];\n" +
			"}\n";
		assertEquals(expecting, TestGraphNodes.toDOTString(r, this.rootIsWildcard()));
	}

	@Test
public  test_Aac_Ab():  void { // a,c + b
		let  a = a();
		let  b = b();
		let  c = c();
		let  A1 = this.array(a, c);
		let  A2 = this.array(b);
		let  r = PredictionContext.merge(A1, A2, this.rootIsWildcard(), null);
//		System.out.println(toDOTString(r, rootIsWildcard()));
		let  expecting =
			"digraph G {\n" +
			"rankdir=LR;\n" +
			"  s0[shape=record, label=\"<p0>|<p1>|<p2>\"];\n" +
			"  s1[label=\"*\"];\n" +
			"  s0:p0->s1[label=\"1\"];\n" +
			"  s0:p1->s1[label=\"2\"];\n" +
			"  s0:p2->s1[label=\"3\"];\n" +
			"}\n";
		assertEquals(expecting, TestGraphNodes.toDOTString(r, this.rootIsWildcard()));
	}

	@Test
public  test_Aab_Aa():  void { // a,b + a
		let  A1 = this.array(this.a(), this.b());
		let  A2 = this.array(this.a());
		let  r = PredictionContext.merge(A1, A2, this.rootIsWildcard(), null);
//		System.out.println(toDOTString(r, rootIsWildcard()));
		let  expecting =
			"digraph G {\n" +
			"rankdir=LR;\n" +
			"  s0[shape=record, label=\"<p0>|<p1>\"];\n" +
			"  s1[label=\"*\"];\n" +
			"  s0:p0->s1[label=\"1\"];\n" +
			"  s0:p1->s1[label=\"2\"];\n" +
			"}\n";
		assertEquals(expecting, TestGraphNodes.toDOTString(r, this.rootIsWildcard()));
	}

	@Test
public  test_Aab_Ab():  void { // a,b + b
		let  A1 = this.array(this.a(), this.b());
		let  A2 = this.array(this.b());
		let  r = PredictionContext.merge(A1, A2, this.rootIsWildcard(), null);
//		System.out.println(toDOTString(r, rootIsWildcard()));
		let  expecting =
			"digraph G {\n" +
			"rankdir=LR;\n" +
			"  s0[shape=record, label=\"<p0>|<p1>\"];\n" +
			"  s1[label=\"*\"];\n" +
			"  s0:p0->s1[label=\"1\"];\n" +
			"  s0:p1->s1[label=\"2\"];\n" +
			"}\n";
		assertEquals(expecting, TestGraphNodes.toDOTString(r, this.rootIsWildcard()));
	}

	@Test
public  test_Aax_Aby():  void { // ax + by but in arrays
		let  a = this.createSingleton(this.x(), 1);
		let  b = this.createSingleton(this.y(), 2);
		let  A1 = this.array(a);
		let  A2 = this.array(b);
		let  r = PredictionContext.merge(A1, A2, this.rootIsWildcard(), null);
//		System.out.println(toDOTString(r, rootIsWildcard()));
		let  expecting =
			"digraph G {\n" +
			"rankdir=LR;\n" +
			"  s0[shape=record, label=\"<p0>|<p1>\"];\n" +
			"  s2[label=\"2\"];\n" +
			"  s3[label=\"*\"];\n" +
			"  s1[label=\"1\"];\n" +
			"  s0:p0->s1[label=\"1\"];\n" +
			"  s0:p1->s2[label=\"2\"];\n" +
			"  s2->s3[label=\"10\"];\n" +
			"  s1->s3[label=\"9\"];\n" +
			"}\n";
		assertEquals(expecting, TestGraphNodes.toDOTString(r, this.rootIsWildcard()));
	}

	@Test
public  test_Aax_Aay():  void { // ax + ay -> merged singleton a, array parent
		let  a1 = this.createSingleton(this.x(), 1);
		let  a2 = this.createSingleton(this.y(), 1);
		let  A1 = this.array(a1);
		let  A2 = this.array(a2);
		let  r = PredictionContext.merge(A1, A2, this.rootIsWildcard(), null);
//		System.out.println(toDOTString(r, rootIsWildcard()));
		let  expecting =
			"digraph G {\n" +
			"rankdir=LR;\n" +
			"  s0[label=\"0\"];\n" +
			"  s1[shape=record, label=\"<p0>|<p1>\"];\n" +
			"  s2[label=\"*\"];\n" +
			"  s0->s1[label=\"1\"];\n" +
			"  s1:p0->s2[label=\"9\"];\n" +
			"  s1:p1->s2[label=\"10\"];\n" +
			"}\n";
		assertEquals(expecting, TestGraphNodes.toDOTString(r, this.rootIsWildcard()));
	}

	@Test
public  test_Aaxc_Aayd():  void { // ax,c + ay,d -> merged a, array parent
		let  a1 = this.createSingleton(this.x(), 1);
		let  a2 = this.createSingleton(this.y(), 1);
		let  A1 = this.array(a1, this.c());
		let  A2 = this.array(a2, this.d());
		let  r = PredictionContext.merge(A1, A2, this.rootIsWildcard(), null);
//		System.out.println(toDOTString(r, rootIsWildcard()));
		let  expecting =
			"digraph G {\n" +
			"rankdir=LR;\n" +
			"  s0[shape=record, label=\"<p0>|<p1>|<p2>\"];\n" +
			"  s2[label=\"*\"];\n" +
			"  s1[shape=record, label=\"<p0>|<p1>\"];\n" +
			"  s0:p0->s1[label=\"1\"];\n" +
			"  s0:p1->s2[label=\"3\"];\n" +
			"  s0:p2->s2[label=\"4\"];\n" +
			"  s1:p0->s2[label=\"9\"];\n" +
			"  s1:p1->s2[label=\"10\"];\n" +
			"}\n";
		assertEquals(expecting, TestGraphNodes.toDOTString(r, this.rootIsWildcard()));
	}

	@Test
public  test_Aaubv_Acwdx():  void { // au,bv + cw,dx -> [a,b,c,d]->[u,v,w,x]
		let  a = this.createSingleton(this.u(), 1);
		let  b = this.createSingleton(this.v(), 2);
		let  c = this.createSingleton(this.w(), 3);
		let  d = this.createSingleton(this.x(), 4);
		let  A1 = this.array(a, b);
		let  A2 = this.array(c, d);
		let  r = PredictionContext.merge(A1, A2, this.rootIsWildcard(), null);
//		System.out.println(toDOTString(r, rootIsWildcard()));
		let  expecting =
			"digraph G {\n" +
			"rankdir=LR;\n" +
			"  s0[shape=record, label=\"<p0>|<p1>|<p2>|<p3>\"];\n" +
			"  s4[label=\"4\"];\n" +
			"  s5[label=\"*\"];\n" +
			"  s3[label=\"3\"];\n" +
			"  s2[label=\"2\"];\n" +
			"  s1[label=\"1\"];\n" +
			"  s0:p0->s1[label=\"1\"];\n" +
			"  s0:p1->s2[label=\"2\"];\n" +
			"  s0:p2->s3[label=\"3\"];\n" +
			"  s0:p3->s4[label=\"4\"];\n" +
			"  s4->s5[label=\"9\"];\n" +
			"  s3->s5[label=\"8\"];\n" +
			"  s2->s5[label=\"7\"];\n" +
			"  s1->s5[label=\"6\"];\n" +
			"}\n";
		assertEquals(expecting, TestGraphNodes.toDOTString(r, this.rootIsWildcard()));
	}

	@Test
public  test_Aaubv_Abvdx():  void { // au,bv + bv,dx -> [a,b,d]->[u,v,x]
		let  a = this.createSingleton(this.u(), 1);
		let  b1 = this.createSingleton(this.v(), 2);
		let  b2 = this.createSingleton(this.v(), 2);
		let  d = this.createSingleton(this.x(), 4);
		let  A1 = this.array(a, b1);
		let  A2 = this.array(b2, d);
		let  r = PredictionContext.merge(A1, A2, this.rootIsWildcard(), null);
//		System.out.println(toDOTString(r, rootIsWildcard()));
		let  expecting =
			"digraph G {\n" +
			"rankdir=LR;\n" +
			"  s0[shape=record, label=\"<p0>|<p1>|<p2>\"];\n" +
			"  s3[label=\"3\"];\n" +
			"  s4[label=\"*\"];\n" +
			"  s2[label=\"2\"];\n" +
			"  s1[label=\"1\"];\n" +
			"  s0:p0->s1[label=\"1\"];\n" +
			"  s0:p1->s2[label=\"2\"];\n" +
			"  s0:p2->s3[label=\"4\"];\n" +
			"  s3->s4[label=\"9\"];\n" +
			"  s2->s4[label=\"7\"];\n" +
			"  s1->s4[label=\"6\"];\n" +
			"}\n";
		assertEquals(expecting, TestGraphNodes.toDOTString(r, this.rootIsWildcard()));
	}

	@Test
public  test_Aaubv_Abwdx():  void { // au,bv + bw,dx -> [a,b,d]->[u,[v,w],x]
		let  a = this.createSingleton(this.u(), 1);
		let  b1 = this.createSingleton(this.v(), 2);
		let  b2 = this.createSingleton(this.w(), 2);
		let  d = this.createSingleton(this.x(), 4);
		let  A1 = this.array(a, b1);
		let  A2 = this.array(b2, d);
		let  r = PredictionContext.merge(A1, A2, this.rootIsWildcard(), null);
//		System.out.println(toDOTString(r, rootIsWildcard()));
		let  expecting =
			"digraph G {\n" +
			"rankdir=LR;\n" +
			"  s0[shape=record, label=\"<p0>|<p1>|<p2>\"];\n" +
			"  s3[label=\"3\"];\n" +
			"  s4[label=\"*\"];\n" +
			"  s2[shape=record, label=\"<p0>|<p1>\"];\n" +
			"  s1[label=\"1\"];\n" +
			"  s0:p0->s1[label=\"1\"];\n" +
			"  s0:p1->s2[label=\"2\"];\n" +
			"  s0:p2->s3[label=\"4\"];\n" +
			"  s3->s4[label=\"9\"];\n" +
			"  s2:p0->s4[label=\"7\"];\n" +
			"  s2:p1->s4[label=\"8\"];\n" +
			"  s1->s4[label=\"6\"];\n" +
			"}\n";
		assertEquals(expecting, TestGraphNodes.toDOTString(r, this.rootIsWildcard()));
	}

	@Test
public  test_Aaubv_Abvdu():  void { // au,bv + bv,du -> [a,b,d]->[u,v,u]; u,v shared
		let  a = this.createSingleton(this.u(), 1);
		let  b1 = this.createSingleton(this.v(), 2);
		let  b2 = this.createSingleton(this.v(), 2);
		let  d = this.createSingleton(this.u(), 4);
		let  A1 = this.array(a, b1);
		let  A2 = this.array(b2, d);
		let  r = PredictionContext.merge(A1, A2, this.rootIsWildcard(), null);
//		System.out.println(toDOTString(r, rootIsWildcard()));
		let  expecting =
			"digraph G {\n" +
			"rankdir=LR;\n" +
			"  s0[shape=record, label=\"<p0>|<p1>|<p2>\"];\n" +
			"  s2[label=\"2\"];\n" +
			"  s3[label=\"*\"];\n" +
			"  s1[label=\"1\"];\n" +
			"  s0:p0->s1[label=\"1\"];\n" +
			"  s0:p1->s2[label=\"2\"];\n" +
			"  s0:p2->s1[label=\"4\"];\n" +
			"  s2->s3[label=\"7\"];\n" +
			"  s1->s3[label=\"6\"];\n" +
			"}\n";
		assertEquals(expecting, TestGraphNodes.toDOTString(r, this.rootIsWildcard()));
	}

	@Test
public  test_Aaubu_Acudu():  void { // au,bu + cu,du -> [a,b,c,d]->[u,u,u,u]
		let  a = this.createSingleton(this.u(), 1);
		let  b = this.createSingleton(this.u(), 2);
		let  c = this.createSingleton(this.u(), 3);
		let  d = this.createSingleton(this.u(), 4);
		let  A1 = this.array(a, b);
		let  A2 = this.array(c, d);
		let  r = PredictionContext.merge(A1, A2, this.rootIsWildcard(), null);
//		System.out.println(toDOTString(r, rootIsWildcard()));
		let  expecting =
			"digraph G {\n" +
			"rankdir=LR;\n" +
			"  s0[shape=record, label=\"<p0>|<p1>|<p2>|<p3>\"];\n" +
			"  s1[label=\"1\"];\n" +
			"  s2[label=\"*\"];\n" +
			"  s0:p0->s1[label=\"1\"];\n" +
			"  s0:p1->s1[label=\"2\"];\n" +
			"  s0:p2->s1[label=\"3\"];\n" +
			"  s0:p3->s1[label=\"4\"];\n" +
			"  s1->s2[label=\"6\"];\n" +
			"}\n";
		assertEquals(expecting, TestGraphNodes.toDOTString(r, this.rootIsWildcard()));
	}

	public  createSingleton(parent: PredictionContext, payload: number):  SingletonPredictionContext {
		let  a = SingletonPredictionContext.create(parent, payload);
		return a;
	}

	public  array(...nodes: SingletonPredictionContext[]):  ArrayPredictionContext {
		let  parents = new  Array<PredictionContext>(PredictionContext.toDOTString.#block#.nodes.length);
		let  invokingStates = new  Int32Array(PredictionContext.toDOTString.#block#.nodes.length);
		for (let  i=0; i<PredictionContext.toDOTString.#block#.nodes.length; i++) {
			parents[i] = PredictionContext.toDOTString.#block#.nodes[i].parent;
			invokingStates[i] = PredictionContext.toDOTString.#block#.nodes[i].returnState;
		}
		return new  ArrayPredictionContext(parents, invokingStates);
	}


	// ------------ SUPPORT -------------------------

	protected  a():  SingletonPredictionContext {
		return this.createSingleton(EmptyPredictionContext.Instance, 1);
	}

	private  b():  SingletonPredictionContext {
		return this.createSingleton(EmptyPredictionContext.Instance, 2);
	}

	private  c():  SingletonPredictionContext {
		return this.createSingleton(EmptyPredictionContext.Instance, 3);
	}

	private  d():  SingletonPredictionContext {
		return this.createSingleton(EmptyPredictionContext.Instance, 4);
	}

	private  u():  SingletonPredictionContext {
		return this.createSingleton(EmptyPredictionContext.Instance, 6);
	}

	private  v():  SingletonPredictionContext {
		return this.createSingleton(EmptyPredictionContext.Instance, 7);
	}

	private  w():  SingletonPredictionContext {
		return this.createSingleton(EmptyPredictionContext.Instance, 8);
	}

	private  x():  SingletonPredictionContext {
		return this.createSingleton(EmptyPredictionContext.Instance, 9);
	}

	private  y():  SingletonPredictionContext {
		return this.createSingleton(EmptyPredictionContext.Instance, 10);
	}
}
