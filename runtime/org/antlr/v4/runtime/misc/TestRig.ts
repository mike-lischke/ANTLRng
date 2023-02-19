/* java2ts: keep */

/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { java, JavaObject, S } from "jree";

/**
 * A proxy for the real org.antlr.v4.gui.TestRig that we moved to tool
 *  artifact from runtime.
 *
 *  @deprecated
 *  @since 4.5.1
 */
export class TestRig extends JavaObject {
    public static main = (args: java.lang.String[] | null): void => {
        java.lang.System.err.println(S`Error: TestRig moved to org.antlr.v4.gui.TestRig;`);
    };
}
