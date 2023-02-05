/* java2ts: keep */

/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { java, JavaObject, S } from "jree";
import { ParseTree } from "../ParseTree";

export abstract class XPathElement extends JavaObject {
    protected nodeName: java.lang.String | null;
    protected invert = false;

    /**
     * Construct element like {@code /ID} or {@code ID} or {@code /*} etc...
     *  op is null if just node
     *
     * @param nodeName tbd
     */
    public constructor(nodeName: java.lang.String | null) {
        super();
        this.nodeName = nodeName;
    }

    public toString = (): java.lang.String => {
        const inv = this.invert ? S`!` : S``;

        return S`${this.getClass().getSimpleName()}[${inv}${this.nodeName}]`;
    };

    /**
     * Given tree rooted at {@code t} return all nodes matched by this path
     * element.
     */
    public abstract evaluate(t: ParseTree | null): java.util.Collection<ParseTree> | null;

}
