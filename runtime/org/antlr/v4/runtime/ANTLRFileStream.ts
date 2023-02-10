/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */



import { java } from "jree";
import { ANTLRInputStream } from "./ANTLRInputStream";
import { CharStream } from "./CharStream";
import { Utils } from "./misc/Utils";




/**
 * This is an {@link ANTLRInputStream} that is loaded from a file all at once
 * when you construct the object.
 *
 * @deprecated as of 4.7 Please use {@link CharStreams} interface.
 */
export class ANTLRFileStream extends ANTLRInputStream {
	protected fileName:  java.lang.String | null;

	/* eslint-disable constructor-super, @typescript-eslint/no-unsafe-call */
public constructor(fileName: java.lang.String| null);

	public constructor(fileName: java.lang.String| null, encoding: java.lang.String| null);
/* @ts-expect-error, because of the super() call in the closure. */
public constructor(fileName: java.lang.String | null, encoding?: java.lang.String | null) {
const $this = (fileName: java.lang.String | null, encoding?: java.lang.String | null): void => {
if (encoding === undefined) {
		$this(fileName, null);
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

	public load = (fileName: java.lang.String| null, encoding: java.lang.String| null):  void =>
	{
		this.data = Utils.readFile(fileName, encoding);
		this.n = this.data.length;
	}

	public getSourceName = ():  java.lang.String | null => {
		return this.fileName;
	}
}
