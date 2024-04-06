/* java2ts: keep */

/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

/* eslint-disable jsdoc/require-returns, jsdoc/require-param */

import { HashMap, OrderedHashSet } from "antlr4ng";

/**
 * A generic graph with edges; Each node as a single Object payload.
 *  This is only used to topologically sort a list of file dependencies
 *  at the moment.
 */
export class Graph<T> {
    public static Node = class Node<T> {
        public payload: T;

        public edges: Array<Node<T>> = []; // points at which nodes?

        public constructor(payload: T) {
            this.payload = payload;
        }

        public addEdge(n: Node<T>): void {
            if (!this.edges.includes(n)) {
                this.edges.push(n);
            }
        }

        public toString(): string {
            return String(this.payload);
        }
    };

    /** Map from node payload to node containing it */
    protected nodes = new HashMap<T, Graph.Node<T>>();

    public addEdge(a: T, b: T): void {
        const a_node = this.getNode(a);
        const b_node = this.getNode(b);
        a_node.addEdge(b_node);
    }

    public getNode(a: T): Graph.Node<T> {
        const existing = this.nodes.get(a);
        if (existing !== null) {
            return existing;
        }

        const n = new Graph.Node<T>(a);
        this.nodes.put(a, n);

        return n;
    }

    /**
     * DFS-based topological sort.  A valid sort is the reverse of
     *  the post-order DFA traversal.  Amazingly simple but true.
     *  For sorting, I'm not following convention here since ANTLR
     *  needs the opposite.  Here's what I assume for sorting:
     *
     *    If there exists an edge u -> v then u depends on v and v
     *    must happen before u.
     *
     *  So if this gives nonreversed postorder traversal, I get the order
     *  I want.
     */
    public sort(): T[] {
        const visited = new OrderedHashSet<Graph.Node<T>>();
        const sorted = new Array<T>();
        while (visited.size() < this.nodes.size()) {
            // pick any unvisited node, n
            let n = null;
            for (const tNode of this.nodes.values()) {
                n = tNode;
                if (!visited.contains(n)) {
                    break;
                }

            }
            if (n !== null) { // if at least one unvisited
                this.DFS(n, visited, sorted);
            }
        }

        return sorted;
    }

    public DFS(n: Graph.Node<T>, visited: Set<Graph.Node<T>>, sorted: T[]): void {
        if (visited.contains(n)) {
            return;
        }

        visited.add(n);
        if (n.edges !== null) {
            for (const target of n.edges) {
                this.DFS(target, visited, sorted);
            }
        }
        sorted.add(n.payload);
    }
}
