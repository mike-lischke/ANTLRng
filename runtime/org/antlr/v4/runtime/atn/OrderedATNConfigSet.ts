/* java2ts: keep */

/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

/* eslint-disable max-classes-per-file */

import { ATNConfigSet } from "./ATNConfigSet";
import { ObjectEqualityComparator } from "../misc/ObjectEqualityComparator";

/**
 * @author Sam Harwell
 */
export class OrderedATNConfigSet extends ATNConfigSet {
    public constructor() {
        super();
        this.configLookup = new OrderedATNConfigSet.LexerConfigHashSet();
    }
}

// eslint-disable-next-line @typescript-eslint/no-namespace, no-redeclare
export namespace OrderedATNConfigSet {
    export class LexerConfigHashSet extends ATNConfigSet.AbstractConfigHashSet {
        public constructor() {
            super(ObjectEqualityComparator.INSTANCE);
        }
    }

}
