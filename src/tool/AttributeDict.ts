/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

/* eslint-disable jsdoc/require-param */

import { IAttribute } from "./IAttribute.js";
import { DictType } from "./DictType.js";
import type { GrammarAST } from "./ast/GrammarAST.js";

/**
 * Track the attributes within retval, arg lists etc...
 * <p>
 * Each rule has potentially 3 scopes: return values,
 * parameters, and an implicitly-named scope (i.e., a scope defined in a rule).
 * Implicitly-defined scopes are named after the rule; rules and scopes then
 * must live in the same name space--no collisions allowed.
 */
export class AttributeDict {

    public name: string;
    public ast: GrammarAST;
    public type?: DictType;

    /** The list of {@link IAttribute} objects. */

    public readonly attributes = new Map<string, IAttribute>();

    public constructor(type?: DictType) {
        this.type = type;
    }

    public add(a: IAttribute): IAttribute {
        a.dict = this;

        this.attributes.set(a.name, a);

        return a;
    }

    public get(name: string): IAttribute | null {
        return this.attributes.get(name) ?? null;
    }

    public getName(): string {
        return this.name;
    }

    public size(): number {
        return this.attributes.size;
    }

    /**
     * @returns the set of keys that collide from {@code this} and {@code other}.
     */
    public intersection(other: AttributeDict | null): Set<string> {
        const result = new Set<string>();
        if (other === null || other.size() === 0 || this.size() === 0) {
            return result;
        }

        // Return only the attribute keys which are present in both sets.
        this.attributes.forEach((value, key) => {
            if (other.attributes.has(key)) {
                result.add(key);
            }
        });

        return result;
    }

    public toString(): string {
        return this.getName() + ":" + String(this.attributes);
    }
}
