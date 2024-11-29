/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

// cspell: ignore RULEMODIFIERS

import { type TokenStream } from "antlr4ng";

import { ANTLRv4Parser } from "../generated/ANTLRv4Parser.js";
import { Tool } from "../Tool.js";
import { ToolParseErrorListener } from "./ToolParseErrorListener.js";

/**
 * Override error handling for use with ANTLR tool itself; leaves
 *  nothing in grammar associated with Tool so others can use in IDEs, ...
 */
export class ToolANTLRParser extends ANTLRv4Parser {
    public tool: Tool;

    public constructor(input: TokenStream, tool: Tool) {
        super(input);
        this.tool = tool;

        this.removeErrorListeners();
        this.addErrorListener(new ToolParseErrorListener(tool));
    }
}
