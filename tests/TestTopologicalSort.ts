/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

/* eslint-disable jsdoc/require-returns, jsdoc/require-param */





/** Test topo sort in GraphNode. */
export  class TestTopologicalSort {
    @Test
public  testFairlyLargeGraph():  void {
        let  g = new  Graph<string>();
        g.addEdge("C", "F");
        g.addEdge("C", "G");
        g.addEdge("C", "A");
        g.addEdge("C", "B");
        g.addEdge("A", "D");
        g.addEdge("A", "E");
        g.addEdge("B", "E");
        g.addEdge("D", "E");
        g.addEdge("D", "F");
        g.addEdge("F", "H");
        g.addEdge("E", "F");

        let  expecting = "[H, F, G, E, D, A, B, C]";
        let  nodes = g.sort();
        let  result = nodes.toString();
        assertEquals(expecting, result);
    }

    @Test
public  testCyclicGraph():  void {
        let  g = new  Graph<string>();
        g.addEdge("A", "B");
        g.addEdge("B", "C");
        g.addEdge("C", "A");
        g.addEdge("C", "D");

        let  expecting = "[D, C, B, A]";
        let  nodes = g.sort();
        let  result = nodes.toString();
        assertEquals(expecting, result);
    }

    @Test
public  testRepeatedEdges():  void {
        let  g = new  Graph<string>();
        g.addEdge("A", "B");
        g.addEdge("B", "C");
        g.addEdge("A", "B"); // dup
        g.addEdge("C", "D");

        let  expecting = "[D, C, B, A]";
        let  nodes = g.sort();
        let  result = nodes.toString();
        assertEquals(expecting, result);
    }

    @Test
public  testSimpleTokenDependence():  void {
        let  g = new  Graph<string>();
        g.addEdge("Java.g4", "MyJava.tokens"); // Java feeds off manual token file
        g.addEdge("Java.tokens", "Java.g4");
        g.addEdge("Def.g4", "Java.tokens");    // walkers feed off generated tokens
        g.addEdge("Ref.g4", "Java.tokens");

        let  expecting = "[MyJava.tokens, Java.g4, Java.tokens, Def.g4, Ref.g4]";
        let  nodes = g.sort();
        let  result = nodes.toString();
        assertEquals(expecting, result);
    }

    @Test
public  testParserLexerCombo():  void {
        let  g = new  Graph<string>();
        g.addEdge("JavaLexer.tokens", "JavaLexer.g4");
        g.addEdge("JavaParser.g4", "JavaLexer.tokens");
        g.addEdge("Def.g4", "JavaLexer.tokens");
        g.addEdge("Ref.g4", "JavaLexer.tokens");

        let  expecting = "[JavaLexer.g4, JavaLexer.tokens, JavaParser.g4, Def.g4, Ref.g4]";
        let  nodes = g.sort();
        let  result = nodes.toString();
        assertEquals(expecting, result);
    }
}
