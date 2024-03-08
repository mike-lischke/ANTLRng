/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */


/* eslint-disable jsdoc/require-returns, jsdoc/require-param */


import { GrammarAST } from "./ast/GrammarAST.js";
import { LinkedHashMap as HashMap, HashSet } from "antlr4ng";



/** Track the attributes within retval, arg lists etc...
 *  <p>
 *  Each rule has potentially 3 scopes: return values,
 *  parameters, and an implicitly-named scope (i.e., a scope defined in a rule).
 *  Implicitly-defined scopes are named after the rule; rules and scopes then
 *  must live in the same name space--no collisions allowed.
 */
export  class AttributeDict {

    /** All {@link Token} scopes (token labels) share the same fixed scope of
     *  of predefined attributes.  I keep this out of the {@link Token}
     *  interface to avoid a runtime type leakage.
     */
    public static readonly  predefinedTokenDict = new  AttributeDict(AttributeDict.DictType.TOKEN);
    public  name:  string;
    public  ast:  GrammarAST;
	public  type:  AttributeDict.DictType;

    /** The list of {@link Attribute} objects. */

    public readonly  attributes =
        new  LinkedHashMap<string, java.security.KeyStore.Entry.Attribute>();

	public  constructor();
	public  constructor(type: AttributeDict.DictType);
    public constructor(...args: unknown[]) {
		switch (args.length) {
			case 0: {


				break;
			}

			case 1: {
				const [type] = args as [AttributeDict.DictType];

 this.type = type; 

				break;
			}

			default: {
				throw new java.lang.IllegalArgumentException(S`Invalid number of arguments`);
			}
		}
	}


	public  add(a: java.security.KeyStore.Entry.Attribute):  java.security.KeyStore.Entry.Attribute { a.dict = this; return this.attributes.put(a.name, a); }
    public  get(name: string):  java.security.KeyStore.Entry.Attribute { return this.attributes.get(name); }

    public  getName():  string {
        return this.name;
    }

    public  size():  number { return this.attributes.size(); }

    /** Return the set of keys that collide from
     *  {@code this} and {@code other}.
     */

    public  intersection(other: AttributeDict):  Set<string> {
        if ( other===null || other.size()===0 || this.size()===0 ) {
            return Collections.emptySet();
        }

		let  result = new  HashSet<string>(this.attributes.keySet());
		result.retainAll(other.attributes.keySet());
		return result;
    }

    @Override
public override  toString():  string {
        return this.getName()+":"+this.attributes;
    }
     static {
        AttributeDict.predefinedTokenDict.add(new  java.security.KeyStore.Entry.Attribute("text"));
        AttributeDict.predefinedTokenDict.add(new  java.security.KeyStore.Entry.Attribute("type"));
        AttributeDict.predefinedTokenDict.add(new  java.security.KeyStore.Entry.Attribute("line"));
        AttributeDict.predefinedTokenDict.add(new  java.security.KeyStore.Entry.Attribute("index"));
        AttributeDict.predefinedTokenDict.add(new  java.security.KeyStore.Entry.Attribute("pos"));
        AttributeDict.predefinedTokenDict.add(new  java.security.KeyStore.Entry.Attribute("channel"));
        AttributeDict.predefinedTokenDict.add(new  java.security.KeyStore.Entry.Attribute("int"));
    }

    public static  DictType =  class DictType extends Enum<DictType> {
        public static readonly ARG: DictType = new class extends DictType {
}(S`ARG`, 0); public static readonly RET: DictType = new class extends DictType {
}(S`RET`, 1); public static readonly LOCAL: DictType = new class extends DictType {
}(S`LOCAL`, 2); public static readonly TOKEN: DictType = new class extends DictType {
}(S`TOKEN`, 3);
		public static readonly PREDEFINED_RULE: DictType = new class extends DictType {
}(S`PREDEFINED_RULE`, 4); public static readonly PREDEFINED_LEXER_RULE: DictType = new class extends DictType {
}(S`PREDEFINED_LEXER_RULE`, 5),
    };

}

// eslint-disable-next-line @typescript-eslint/no-namespace, no-redeclare
export namespace AttributeDict {
	export type DictType = InstanceType<typeof AttributeDict.DictType>;
}


