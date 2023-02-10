/* java2ts: keep */

/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { IntegerList } from "./IntegerList";

/**
 * @author Sam Harwell
 */
export class IntegerStack extends IntegerList {
    public constructor(capacity?: number);
    public constructor(list: IntegerStack);
    public constructor(capacityOrList?: number | IntegerStack) {
        super(capacityOrList);
    }

    public readonly push = (value: number): void => {
        this.add(value);
    };

    public readonly pop = (): number => {
        return this.removeAt(this.size() - 1);
    };

    public readonly peek = (): number => {
        return this.get(this.size() - 1);
    };

}
