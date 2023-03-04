/* java2ts: keep */

/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { TerminalNode } from "./TerminalNode";

export interface ErrorNode extends TerminalNode {
    // Not part of the original interface, but we need it to distinguish
    // ErrorNode from TerminalNode.
    isErrorNode: true;
}

export const isErrorNode = (candidate: unknown): candidate is ErrorNode => {
    return (candidate as ErrorNode).isErrorNode === true;
};
