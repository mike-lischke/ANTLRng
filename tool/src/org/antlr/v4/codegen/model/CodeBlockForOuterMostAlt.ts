/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { Alternative } from "../../tool/Alternative.js";
import { OutputModelFactory } from "../OutputModelFactory.js";
import { CodeBlockForAlt } from "./CodeBlockForAlt.js";

/**
 * The code associated with the outermost alternative of a rule.
 *  Sometimes we might want to treat them differently in the
 *  code generation.
 */
export class CodeBlockForOuterMostAlt extends CodeBlockForAlt {

    /**
     * The label for the alternative; or null if the alternative is not labeled.
     */
    public altLabel?: string;

    /**
     * The alternative.
     */
    public alt: Alternative;

    public constructor(factory: OutputModelFactory, alt: Alternative) {
        super(factory);
        this.alt = alt;
        this.altLabel = alt.ast.altLabel?.getText() ?? undefined;
    }
}
