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



import { ANTLRInputStream } from "./ANTLRInputStream";
import { CharStream } from "./CharStream";
import { Utils } from "./misc/Utils";




/**
 * This is an {@link ANTLRInputStream} that is loaded from a file all at once
 * when you construct the object.
 *
 * @deprecated as of 4.7 Please use {@link CharStreams} interface.
 */
export  class ANTLRFileStream extends ANTLRInputStream {
	protected fileName?:  string;

	/* eslint-disable constructor-super, @typescript-eslint/no-unsafe-call */
public constructor(fileName: string);

	public constructor(fileName: string, encoding: string);
/* @ts-expect-error, because of the super() call in the closure. */
public constructor(fileName: string, encoding?: string) {
const $this = (fileName: string, encoding?: string): void => {
if (encoding === undefined) {
		$this(fileName, undefined);
	}
 else  {

/* @ts-expect-error, because of the super() call in the closure. */
		super();
this.fileName = fileName;
		this.load(fileName, encoding);
	}
};

$this(fileName, encoding);

}
/* eslint-enable constructor-super, @typescript-eslint/no-unsafe-call */

	public load = (fileName: string, encoding: string): void =>
	{
		this.data = Utils.readFile(fileName, encoding);
		this.n = this.data.length;
	}

	public getSourceName = (): string => {
		return this.fileName;
	}
}
