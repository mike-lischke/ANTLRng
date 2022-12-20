/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */


/*
 eslint-disable @typescript-eslint/no-namespace, @typescript-eslint/naming-convention, no-redeclare,
 max-classes-per-file, jsdoc/check-tag-names, @typescript-eslint/no-empty-function,
 @typescript-eslint/restrict-plus-operands, @typescript-eslint/unified-signatures, @typescript-eslint/member-ordering,
 no-underscore-dangle, max-len
*/

/* cspell: disable */




import { java } from "../../../../../../lib/java/java";




/** A HashMap that remembers the order that the elements were added.
 *  You can alter the ith element with set(i,value) too :)  Unique list.
 *  I need the replace/set-element-i functionality so I'm subclassing
 *  LinkedHashSet.
 */
export  class OrderedHashSet<T> extends LinkedHashSet<T> {
    /** Track the elements as they are added to the set */
    protected elements:  java.util.ArrayList<T> | null = new  java.util.ArrayList<T>();

    public get = (i: number):  T | null => {
        return this.elements.get(i);
    }

    /** Replace an existing value with a new value; updates the element
     *  list and the hash table, but not the key as that has not changed.
     */
    public set = (i: number, value: T| null):  T | null => {
        let  oldElement: T = this.elements.get(i);
        this.elements.set(i,value); // update list
        super.remove(oldElement); // now update the set: remove/add
        super.add(value);
        return oldElement;
    }

	public remove(i: number):  boolean;

	public remove(o: java.lang.Object| null):  boolean;


	public remove(iOrO: number | java.lang.Object | null):  boolean {
if (typeof iOrO === "number") {
const i = iOrO as number;
		let  o: T = this.elements.remove(i);
        return super.remove(o);
	}
 else  {
let o = iOrO as java.lang.Object;
		throw new  java.lang.UnsupportedOperationException();
    }

}


    /** Add a value to list; keep in hashtable for consistency also;
     *  Key is object itself.  Good for say asking if a certain string is in
     *  a list of strings.
     */
    public add = (value: T| null):  boolean => {
        let  result: boolean = super.add(value);
		if ( result ) {  // only track if new element not in set
			this.elements.add(value);
		}
		return result;
    }

	public clear = ():  void => {
        this.elements.clear();
        super.clear();
    }

	public hashCode = ():  number => {
		return this.elements.hashCode();
	}

	public equals = (o: java.lang.Object| null):  boolean => {
		if (!(o instanceof OrderedHashSet<unknown>)) {
			return false;
		}

//		System.out.print("equals " + this + ", " + o+" = ");
		let  same: boolean = this.elements!==null && this.elements.equals((o as OrderedHashSet<unknown>).elements);
//		System.out.println(same);
		return same;
	}

	public iterator = ():  Iterator<T> | null => {
		return this.elements.iterator();
	}

	/** Return the List holding list of table elements.  Note that you are
     *  NOT getting a copy so don't write to the list.
     */
    public elements = ():  java.util.List<T> | null => {
        return this.elements;
    }

    public clone = ():  java.lang.Object | null => {
        /* @SuppressWarnings("unchecked") */  // safe (result of clone)
        let  dup: OrderedHashSet<T> = super.clone() as OrderedHashSet<T>;
        dup.elements = new  java.util.ArrayList<T>(this.elements);
        return dup;
    }

    public toArray = ():  java.lang.Object[] | null => {
		return this.elements.toArray();
	}

	public toString = ():  java.lang.String | null => {
        return this.elements.toString();
    }
}
