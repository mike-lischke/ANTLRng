/* java2ts: keep */

/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { ATNState } from "./ATNState";
import { Transition } from "./Transition";

/**
 *
 * @author Sam Harwell
 */
export abstract class AbstractPredicateTransition extends Transition {

    public constructor(target: ATNState) {
        super(target);
    }
}
