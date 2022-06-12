/*
 * This file is released under the MIT license.
 * Copyright (c) 2021, Mike Lischke
 *
 * See LICENSE file for more info.
 */

// A partial implementation of Java's Class type.
export class Class<T> extends Object {

    public constructor(private ctor: abstract new (...args: unknown[]) => T) {
        super();
    }

    public getName(): string {
        return this.ctor.name;
    }

    public isInstance(o: unknown): boolean {
        if (!(o instanceof Object)) {
            return false;
        }

        return o instanceof this.ctor;
    }

    public cast(o: unknown): T {
        return o as T;
    }
}
