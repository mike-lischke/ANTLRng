/* java2ts: keep */

/*
 * Copyright (c) 2012-2022 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { java, S } from "jree";

export class Stage extends java.lang.Enum<Stage> {
    public static readonly Generate: Stage = new class extends Stage {
    }(S`Generate`, 0);
    public static readonly Compile: Stage = new class extends Stage {
    }(S`Compile`, 1);
    public static readonly Execute: Stage = new class extends Stage {
    }(S`Execute`, 2);
}
