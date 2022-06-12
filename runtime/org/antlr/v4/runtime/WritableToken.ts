/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */


/*
 eslint-disable @typescript-eslint/no-namespace, @typescript-eslint/naming-convention,
 max-classes-per-file, jsdoc/check-tag-names, @typescript-eslint/no-empty-function,
 @typescript-eslint/restrict-plus-operands, @typescript-eslint/unified-signatures, @typescript-eslint/member-ordering,
 no-underscore-dangle
*/

/* cspell: disable */

import { Token } from "./Token";




export abstract class WritableToken extends Token {
	public abstract setText: (text: string) =>  void;

	public abstract setType: (ttype: number) =>  void;

	public abstract setLine: (line: number) =>  void;

	public abstract setCharPositionInLine: (pos: number) =>  void;

	public abstract setChannel: (channel: number) =>  void;

	public abstract setTokenIndex: (index: number) =>  void;
}
