/* java2ts: keep */

/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { EqualityComparator } from "./EqualityComparator";

/**
 * This abstract base class is provided so performance-critical applications can
 * use virtual- instead of interface-dispatch when calling comparator methods.
 *
 * @author Sam Harwell
 */
export abstract class AbstractEqualityComparator<T> extends EqualityComparator<T> {

}
