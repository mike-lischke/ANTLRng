/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { Decl } from "./Decl.js";
import { OutputModelFactory } from "../../OutputModelFactory.js";
import { ModelElement } from "../ModelElement.js";
import { SrcOp } from "../SrcOp.js";
import { OrderedHashSet } from "antlr4ng";

export class CodeBlock extends SrcOp {
    public codeBlockLevel: number;
    public treeLevel: number;

    public locals: OrderedHashSet<Decl>;

    public preamble: SrcOp[];

    public ops: SrcOp[];

    public constructor(factory: OutputModelFactory);

    public constructor(factory: OutputModelFactory, treeLevel: number, codeBlockLevel: number);
    public constructor(...args: unknown[]) {
        switch (args.length) {
            case 1: {
                const [factory] = args as [OutputModelFactory];

                super(factory);

                break;
            }

            case 3: {
                const [factory, treeLevel, codeBlockLevel] = args as [OutputModelFactory, number, number];

                super(factory);
                this.treeLevel = treeLevel;
                this.codeBlockLevel = codeBlockLevel;

                break;
            }

            default: {
                throw new java.lang.IllegalArgumentException(S`Invalid number of arguments`);
            }
        }
    }

    /** Add local var decl */
    public addLocalDecl(d: Decl): void {
        if (this.locals === null) {
            this.locals = new OrderedHashSet<Decl>();
        }

        this.locals.add(d);
        d.isLocal = true;
    }

    public addPreambleOp(op: SrcOp): void {
        if (this.preamble === null) {
            this.preamble = new Array<SrcOp>();
        }

        this.preamble.add(op);
    }

    public addOp(op: SrcOp): void {
        if (this.ops === null) {
            this.ops = new Array<SrcOp>();
        }

        this.ops.add(op);
    }

    public insertOp(i: number, op: SrcOp): void {
        if (this.ops === null) {
            this.ops = new Array<SrcOp>();
        }

        this.ops.add(i, op);
    }

    public addOps(ops: SrcOp[]): void {
        if (this.ops === null) {
            this.ops = new Array<SrcOp>();
        }

        this.ops.addAll(ops);
    }
}
