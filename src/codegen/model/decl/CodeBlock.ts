/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

/* eslint-disable jsdoc/require-param */

import { OutputModelFactory } from "../../OutputModelFactory.js";
import { SrcOp } from "../SrcOp.js";
import { Decl } from "./Decl.js";

export class CodeBlock extends SrcOp {
    public codeBlockLevel: number;
    public treeLevel: number;

    public locals = new Set<Decl>();

    public preamble: SrcOp[] = [];

    public ops: SrcOp[] = [];

    public constructor(factory: OutputModelFactory);
    public constructor(factory: OutputModelFactory, treeLevel: number, codeBlockLevel: number);
    public constructor(...args: unknown[]) {
        const factory = args[0] as OutputModelFactory;
        super(factory);
        if (args.length === 3) {
            this.treeLevel = args[1] as number;
            this.codeBlockLevel = args[2] as number;
        }
    }

    /** Add local var decl */
    public addLocalDecl(d: Decl): void {
        this.locals.add(d);
        d.isLocal = true;
    }

    public addPreambleOp(op: SrcOp): void {
        this.preamble.push(op);
    }

    public addOp(op: SrcOp): void {
        this.ops.push(op);
    }

    public insertOp(i: number, op: SrcOp): void {
        this.ops.splice(i, 0, op);
    }

    public addOps(ops: SrcOp[]): void {
        this.ops.push(...ops);
    }
}