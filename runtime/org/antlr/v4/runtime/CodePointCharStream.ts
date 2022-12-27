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




import { java } from "../../../../../lib/java/java";
import { CharStream } from "./CharStream";
import { CodePointBuffer } from "./CodePointBuffer";
import { IntStream } from "./IntStream";
import { Interval } from "./misc/Interval";


import { JavaObject } from "../../../../../lib/java/lang/Object";
import { S } from "../../../../../lib/templates";


/**
 * Alternative to {@link ANTLRInputStream} which treats the input
 * as a series of Unicode code points, instead of a series of UTF-16
 * code units.
 *
 * Use this if you need to parse input which potentially contains
 * Unicode values > U+FFFF.
 */
export abstract  class CodePointCharStream extends JavaObject implements CharStream {
	protected readonly  size:  number;
	protected readonly  name:  java.lang.String | null;

	// To avoid lots of virtual method calls, we directly access
	// the state of the underlying code points in the
	// CodePointBuffer.
	protected position:  number;

	// Use the factory method {@link #fromBuffer(CodePointBuffer)} to
	// construct instances of this type.
	private constructor(position: number, remaining: number, name: java.lang.String| null) {
		// TODO
		super();
/* assert position == 0; */ 
		this.size = remaining;
		this.name = name;
		this.position = 0;
	}

	// Visible for testing.
	protected abstract getInternalStorage: () =>  java.lang.Object | null;

	/**
	 * Constructs a {@link CodePointCharStream} which provides access
	 * to the Unicode code points stored in {@code codePointBuffer}.
	 */
	public static fromBuffer(codePointBuffer: CodePointBuffer| null):  CodePointCharStream | null;

	/**
	 * Constructs a named {@link CodePointCharStream} which provides access
	 * to the Unicode code points stored in {@code codePointBuffer}.
	 */
	public static fromBuffer(codePointBuffer: CodePointBuffer| null, name: java.lang.String| null):  CodePointCharStream | null;


	/**
	 * Constructs a {@link CodePointCharStream} which provides access
	 * to the Unicode code points stored in {@code codePointBuffer}.
	 */
	public static fromBuffer(codePointBuffer: CodePointBuffer | null, name?: java.lang.String | null):  CodePointCharStream | null {
if (name === undefined) {
		return CodePointCharStream.fromBuffer(codePointBuffer, IntStream.UNKNOWN_SOURCE_NAME);
	}
 else  {
		// Java lacks generics on primitive types.
		//
		// To avoid lots of calls to virtual methods in the
		// very hot codepath of LA() below, we construct one
		// of three concrete subclasses.
		//
		// The concrete subclasses directly access the code
		// points stored in the underlying array (byte[],
		// char[], or int[]), so we can avoid lots of virtual
		// method calls to ByteBuffer.get(offset).
		switch (codePointBuffer.getType()) {
			case CodePointBuffer.Type.BYTE:{
				return new  CodePointCharStream.CodePoint8BitCharStream(
						codePointBuffer.position(),
						codePointBuffer.remaining(),
						name,
						codePointBuffer.byteArray(),
						codePointBuffer.arrayOffset());
}

			case CodePointBuffer.Type.CHAR:{
				return new  CodePointCharStream.CodePoint16BitCharStream(
						codePointBuffer.position(),
						codePointBuffer.remaining(),
						name,
						codePointBuffer.charArray(),
						codePointBuffer.arrayOffset());
}

			case CodePointBuffer.Type.INT:{
				return new  CodePointCharStream.CodePoint32BitCharStream(
						codePointBuffer.position(),
						codePointBuffer.remaining(),
						name,
						codePointBuffer.intArray(),
						codePointBuffer.arrayOffset());
}


default:

		}
		throw new  java.lang.UnsupportedOperationException(S`Not reached`);
	}

}


	public readonly  consume = ():  void => {
		if (this.size - this.position === 0) {
			/* assert LA(1) == IntStream.EOF; */ 
			throw new  java.lang.IllegalStateException(S`cannot consume EOF`);
		}
		this.position = this.position + 1;
	}

	public readonly  index = ():  number => {
		return this.position;
	}

	public readonly  size = ():  number => {
		return this.size;
	}

	/** mark/release do nothing; we have entire buffer */
	public readonly  mark = ():  number => {
		return -1;
	}

	public readonly  release = (marker: number):  void => {
	}

	public readonly  seek = (index: number):  void => {
		this.position = index;
	}

	public readonly  getSourceName = ():  java.lang.String | null => {
		if (this.name === null || this.name.isEmpty()) {
			return IntStream.UNKNOWN_SOURCE_NAME;
		}

		return this.name;
	}

	public readonly  toString = ():  java.lang.String | null => {
		return this.getText(Interval.of(0, this.size - 1));
	}

	// 8-bit storage for code points <= U+00FF.
	private static readonly  CodePoint8BitCharStream =  class CodePoint8BitCharStream extends CodePointCharStream {
		private readonly  byteArray:  Int8Array;

		private constructor(position: number, remaining: number, name: java.lang.String| null, byteArray: Int8Array, arrayOffset: number) {
			super(position, remaining, name);
			// TODO
			/* assert arrayOffset == 0; */ 
			this.byteArray = byteArray;
		}

		/** Return the UTF-16 encoded string for the given interval */
		public getText = (interval: Interval| null):  java.lang.String | null => {
			let  startIdx: number = Math.min(interval.a, this.size);
			let  len: number = Math.min(interval.b - interval.a + 1, this.size - startIdx);

			// We know the maximum code point in byteArray is U+00FF,
			// so we can treat this as if it were ISO-8859-1, aka Latin-1,
			// which shares the same code points up to 0xFF.
			return new  java.lang.String(this.byteArray, startIdx, len, java.nio.charset.StandardCharsets.ISO_8859_1);
		}

		public LA = (i: number):  number => {
			let  offset: number;
			switch (java.lang.Integer.signum(i)) {
				case -1:{
					offset = this.position + i;
					if (offset < 0) {
						return IntStream.EOF;
					}
					return this.byteArray[offset] & 0xFF;
}

				case 0:{
					// Undefined
					return 0;
}

				case 1:{
					offset = this.position + i - 1;
					if (offset >= this.size) {
						return IntStream.EOF;
					}
					return this.byteArray[offset] & 0xFF;
}


default:

			}
			throw new  java.lang.UnsupportedOperationException(S`Not reached`);
		}

		protected  getInternalStorage = (): 
		java.lang.Object | null => {
			return this.byteArray;
		}
	};


	// 16-bit internal storage for code points between U+0100 and U+FFFF.
	private static readonly  CodePoint16BitCharStream =  class CodePoint16BitCharStream extends CodePointCharStream {
		private readonly  charArray:  Uint16Array;

		private constructor(position: number, remaining: number, name: java.lang.String| null, charArray: Uint16Array, arrayOffset: number) {
			super(position, remaining, name);
			this.charArray = charArray;
			// TODO
			/* assert arrayOffset == 0; */ 
		}

		/** Return the UTF-16 encoded string for the given interval */
		public getText = (interval: Interval| null):  java.lang.String | null => {
			let  startIdx: number = Math.min(interval.a, this.size);
			let  len: number = Math.min(interval.b - interval.a + 1, this.size - startIdx);

			// We know there are no surrogates in this
			// array, since otherwise we would be given a
			// 32-bit int[] array.
			//
			// So, it's safe to treat this as if it were
			// UTF-16.
			return new  java.lang.String(this.charArray, startIdx, len);
		}

		public LA = (i: number):  number => {
			let  offset: number;
			switch (java.lang.Integer.signum(i)) {
				case -1:{
					offset = this.position + i;
					if (offset < 0) {
						return IntStream.EOF;
					}
					return this.charArray[offset] & 0xFFFF;
}

				case 0:{
					// Undefined
					return 0;
}

				case 1:{
					offset = this.position + i - 1;
					if (offset >= this.size) {
						return IntStream.EOF;
					}
					return this.charArray[offset] & 0xFFFF;
}


default:

			}
			throw new  java.lang.UnsupportedOperationException(S`Not reached`);
		}

		protected  getInternalStorage = (): 
		java.lang.Object | null => {
			return this.charArray;
		}
	};


	// 32-bit internal storage for code points between U+10000 and U+10FFFF.
	private static readonly  CodePoint32BitCharStream =  class CodePoint32BitCharStream extends CodePointCharStream {
		private readonly  intArray:  Int32Array;

		private constructor(position: number, remaining: number, name: java.lang.String| null, intArray: Int32Array, arrayOffset: number) {
			super(position, remaining, name);
			this.intArray = intArray;
			// TODO
			/* assert arrayOffset == 0; */ 
		}

		/** Return the UTF-16 encoded string for the given interval */
		public getText = (interval: Interval| null):  java.lang.String | null => {
			let  startIdx: number = Math.min(interval.a, this.size);
			let  len: number = Math.min(interval.b - interval.a + 1, this.size - startIdx);

			// Note that we pass the int[] code points to the String constructor --
			// this is supported, and the constructor will convert to UTF-16 internally.
			return new  java.lang.String(this.intArray, startIdx, len);
		}

		public LA = (i: number):  number => {
			let  offset: number;
			switch (java.lang.Integer.signum(i)) {
				case -1:{
					offset = this.position + i;
					if (offset < 0) {
						return IntStream.EOF;
					}
					return this.intArray[offset];
}

				case 0:{
					// Undefined
					return 0;
}

				case 1:{
					offset = this.position + i - 1;
					if (offset >= this.size) {
						return IntStream.EOF;
					}
					return this.intArray[offset];
}


default:

			}
			throw new  java.lang.UnsupportedOperationException(S`Not reached`);
		}

		protected  getInternalStorage = (): 
		java.lang.Object | null => {
			return this.intArray;
		}
	};

}

// eslint-disable-next-line @typescript-eslint/no-namespace, no-redeclare
export namespace CodePointCharStream {
	// @ts-expect-error, because of protected inner class.
	export type CodePoint8BitCharStream = InstanceType<typeof CodePointCharStream.CodePoint8BitCharStream>;
	// @ts-expect-error, because of protected inner class.
	export type CodePoint16BitCharStream = InstanceType<typeof CodePointCharStream.CodePoint16BitCharStream>;
	// @ts-expect-error, because of protected inner class.
	export type CodePoint32BitCharStream = InstanceType<typeof CodePointCharStream.CodePoint32BitCharStream>;
}


