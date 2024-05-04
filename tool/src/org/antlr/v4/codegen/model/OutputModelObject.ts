/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

/* eslint-disable jsdoc/require-returns, jsdoc/require-param */

import { OutputModelFactory } from "../OutputModelFactory.js";
import { GrammarAST } from "../../tool/ast/GrammarAST.js";

/** */
export abstract  class OutputModelObject {
    public  factory:  OutputModelFactory;
    public  ast:  GrammarAST;

    public  constructor();

    public  constructor(factory: OutputModelFactory);

    public  constructor(factory: OutputModelFactory, ast: GrammarAST);
    public constructor(...args: unknown[]) {
        switch (args.length) {
            case 0: {

                break;
            }

            case 1: {
                const [factory] = args as [OutputModelFactory];

                this(factory, null);

                break;
            }

            case 2: {
                const [factory, ast] = args as [OutputModelFactory, GrammarAST];

                this.factory = factory;
                this.ast = ast;

                break;
            }

            default: {
                throw new java.lang.IllegalArgumentException(S`Invalid number of arguments`);
            }
        }
    }

}
