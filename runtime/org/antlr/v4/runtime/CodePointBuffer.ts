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


import { JavaObject } from "../../../../../lib/java/lang/Object";


/**
 * Wrapper for {@link ByteBuffer} / {@link CharBuffer} / {@link IntBuffer}.
 *
 * Because Java lacks generics on primitive types, these three types
 * do not share an interface, so we have to write one manually.
 */
export  class CodePointBuffer extends JavaObject {
	private readonly  type:  this.Type | null;
	private readonly  byteBuffer:  java.nio.ByteBuffer | null;
	private readonly  charBuffer:  java.nio.CharBuffer | null;
	private readonly  intBuffer:  IntBuffer | null;

	private constructor(type: this.Type| null, byteBuffer: java.nio.ByteBuffer| null, charBuffer: java.nio.CharBuffer| null, intBuffer: IntBuffer| null) {
		super();
this.type = type;
		this.byteBuffer = byteBuffer;
		this.charBuffer = charBuffer;
		this.intBuffer = intBuffer;
	}

	public static withBytes = (byteBuffer: java.nio.ByteBuffer| null):  CodePointBuffer | null => {
		return new  CodePointBuffer(this.Type.BYTE, byteBuffer, null, null);
	}

	public static withChars = (charBuffer: java.nio.CharBuffer| null):  CodePointBuffer | null => {
		return new  CodePointBuffer(this.Type.CHAR, null, charBuffer, null);
	}

	public static withInts = (intBuffer: IntBuffer| null):  CodePointBuffer | null => {
		return new  CodePointBuffer(this.Type.INT, null, null, intBuffer);
	}

	public position():  number;

	public position(newPosition: number):  void;


	public position(newPosition?: number):  number |  void {
if (newPosition === undefined) {
		switch (this.type) {
			case BYTE:{
				return this.byteBuffer.position();
}

			case CHAR:{
				return this.charBuffer.position();
}

			case INT:{
				return this.intBuffer.position();
}


default:

		}
		throw new  java.lang.UnsupportedOperationException("Not reached");
	}
 else  {
		switch (this.type) {
			case BYTE:{
				this.byteBuffer.position(newPosition);
				break;
}

			case CHAR:{
				this.charBuffer.position(newPosition);
				break;
}

			case INT:{
				this.intBuffer.position(newPosition);
				break;
}


default:

		}
	}

}


	public remaining = ():  number => {
		switch (this.type) {
			case BYTE:{
				return this.byteBuffer.remaining();
}

			case CHAR:{
				return this.charBuffer.remaining();
}

			case INT:{
				return this.intBuffer.remaining();
}


default:

		}
		throw new  java.lang.UnsupportedOperationException("Not reached");
	}

	public get = (offset: number):  number => {
		switch (this.type) {
			case BYTE:{
				return this.byteBuffer.get(offset);
}

			case CHAR:{
				return this.charBuffer.get(offset);
}

			case INT:{
				return this.intBuffer.get(offset);
}


default:

		}
		throw new  java.lang.UnsupportedOperationException("Not reached");
	}

	public  getType = (): this.Type | null => {
		return this.type;
	}

	public  arrayOffset = (): number => {
		switch (this.type) {
			case BYTE:{
				return this.byteBuffer.arrayOffset();
}

			case CHAR:{
				return this.charBuffer.arrayOffset();
}

			case INT:{
				return this.intBuffer.arrayOffset();
}


default:

		}
		throw new  java.lang.UnsupportedOperationException("Not reached");
	}

	public  byteArray = (): Int8Array => {
		/* assert type == Type.BYTE; */ 
		return this.byteBuffer.array();
	}

	public  charArray = (): Uint16Array => {
		/* assert type == Type.CHAR; */ 
		return this.charBuffer.array();
	}

	public  intArray = (): Int32Array => {
		/* assert type == Type.INT; */ 
		return this.intBuffer.array();
	}

	public static builder = (initialBufferSize: number):  CodePointBuffer.Builder | null => {
		return new  CodePointBuffer.Builder(initialBufferSize);
	}

	public static Builder =  class Builder extends JavaObject {
		private type:  $outer.Type | null;
		private byteBuffer:  java.nio.ByteBuffer | null;
		private charBuffer:  java.nio.CharBuffer | null;
		private intBuffer:  IntBuffer | null;
		private prevHighSurrogate:  number;

		private constructor(initialBufferSize: number) {
			super();
$outer.type = $outer.Type.BYTE;
			$outer.byteBuffer = java.nio.ByteBuffer.allocate(initialBufferSize);
			$outer.charBuffer = null;
			$outer.intBuffer = null;
			$outer.prevHighSurrogate = -1;
		}

		public  getType = (): $outer.Type | null => {
			return $outer.type;
		}

		public  getByteBuffer = (): java.nio.ByteBuffer | null => {
			return $outer.byteBuffer;
		}

		public  getCharBuffer = (): java.nio.CharBuffer | null => {
			return $outer.charBuffer;
		}

		public  getIntBuffer = (): IntBuffer | null => {
			return $outer.intBuffer;
		}

		public build = ():  CodePointBuffer | null => {
			switch ($outer.type) {
				case BYTE:{
					$outer.byteBuffer.flip();
					break;
}

				case CHAR:{
					$outer.charBuffer.flip();
					break;
}

				case INT:{
					$outer.intBuffer.flip();
					break;
}


default:

			}
			return new  CodePointBuffer($outer.type, $outer.byteBuffer, $outer.charBuffer, $outer.intBuffer);
		}

		private static roundUpToNextPowerOfTwo = (i: number):  number => {
			let  nextPowerOfTwo: number = 32 - java.lang.Integer.numberOfLeadingZeros(i - 1);
			return Number( Math.pow(2, nextPowerOfTwo));
		}

		public ensureRemaining = (remainingNeeded: number):  void => {
			switch ($outer.type) {
				case BYTE:{
					if ($outer.byteBuffer.remaining() < remainingNeeded) {
						let  newCapacity: number = Builder.roundUpToNextPowerOfTwo($outer.byteBuffer.capacity() + remainingNeeded);
						let  newBuffer: java.nio.ByteBuffer = java.nio.ByteBuffer.allocate(newCapacity);
						$outer.byteBuffer.flip();
						newBuffer.put($outer.byteBuffer);
						$outer.byteBuffer = newBuffer;
					}
					break;
}

				case CHAR:{
					if ($outer.charBuffer.remaining() < remainingNeeded) {
						let  newCapacity: number = Builder.roundUpToNextPowerOfTwo($outer.charBuffer.capacity() + remainingNeeded);
						let  newBuffer: java.nio.CharBuffer = java.nio.CharBuffer.allocate(newCapacity);
						$outer.charBuffer.flip();
						newBuffer.put($outer.charBuffer);
						$outer.charBuffer = newBuffer;
					}
					break;
}

				case INT:{
					if ($outer.intBuffer.remaining() < remainingNeeded) {
						let  newCapacity: number = Builder.roundUpToNextPowerOfTwo($outer.intBuffer.capacity() + remainingNeeded);
						let  newBuffer: IntBuffer = IntBuffer.allocate(newCapacity);
						$outer.intBuffer.flip();
						newBuffer.put($outer.intBuffer);
						$outer.intBuffer = newBuffer;
					}
					break;
}


default:

			}
		}

		public append = (utf16In: java.nio.CharBuffer| null):  void => {
			$outer.ensureRemaining(utf16In.remaining());
			if (utf16In.hasArray()) {
				$outer.appendArray(utf16In);
			} else {
				// TODO
				throw new  java.lang.UnsupportedOperationException("TODO");
			}
		}

		private appendArray = (utf16In: java.nio.CharBuffer| null):  void => {
			/* assert utf16In.hasArray(); */ 

			switch ($outer.type) {
				case BYTE:{
					$outer.appendArrayByte(utf16In);
					break;
}

				case CHAR:{
					$outer.appendArrayChar(utf16In);
					break;
}

				case INT:{
					$outer.appendArrayInt(utf16In);
					break;
}


default:

			}
		}

		private appendArrayByte = (utf16In: java.nio.CharBuffer| null):  void => {
			/* assert prevHighSurrogate == -1; */ 

			let  in: Uint16Array = utf16In.array();
			let  inOffset: number = utf16In.arrayOffset() + utf16In.position();
			let  inLimit: number = utf16In.arrayOffset() + utf16In.limit();

			let  outByte: Int8Array = $outer.byteBuffer.array();
			let  outOffset: number = $outer.byteBuffer.arrayOffset() + $outer.byteBuffer.position();

			while (inOffset < inLimit) {
				let  c: CodePoint = in[inOffset];
				if (c <= 0xFF) {
					outByte[outOffset] = Number((c & 0xFF));
				} else {
					utf16In.position(inOffset - utf16In.arrayOffset());
					$outer.byteBuffer.position(outOffset - $outer.byteBuffer.arrayOffset());
					if (!java.lang.Character.isHighSurrogate(c)) {
						$outer.byteToCharBuffer(utf16In.remaining());
						$outer.appendArrayChar(utf16In);
						return;
					} else {
						$outer.byteToIntBuffer(utf16In.remaining());
						$outer.appendArrayInt(utf16In);
						return;
					}
				}
				inOffset++;
				outOffset++;
			}

			utf16In.position(inOffset - utf16In.arrayOffset());
			$outer.byteBuffer.position(outOffset - $outer.byteBuffer.arrayOffset());
		}

		private appendArrayChar = (utf16In: java.nio.CharBuffer| null):  void => {
			/* assert prevHighSurrogate == -1; */ 

			let  in: Uint16Array = utf16In.array();
			let  inOffset: number = utf16In.arrayOffset() + utf16In.position();
			let  inLimit: number = utf16In.arrayOffset() + utf16In.limit();

			let  outChar: Uint16Array = $outer.charBuffer.array();
			let  outOffset: number = $outer.charBuffer.arrayOffset() + $outer.charBuffer.position();

			while (inOffset < inLimit) {
				let  c: CodePoint = in[inOffset];
				if (!java.lang.Character.isHighSurrogate(c)) {
					outChar[outOffset] = c;
				} else {
					utf16In.position(inOffset - utf16In.arrayOffset());
					$outer.charBuffer.position(outOffset - $outer.charBuffer.arrayOffset());
					$outer.charToIntBuffer(utf16In.remaining());
					$outer.appendArrayInt(utf16In);
					return;
				}
				inOffset++;
				outOffset++;
			}

			utf16In.position(inOffset - utf16In.arrayOffset());
			$outer.charBuffer.position(outOffset - $outer.charBuffer.arrayOffset());
		}

		private appendArrayInt = (utf16In: java.nio.CharBuffer| null):  void => {
			let  in: Uint16Array = utf16In.array();
			let  inOffset: number = utf16In.arrayOffset() + utf16In.position();
			let  inLimit: number = utf16In.arrayOffset() + utf16In.limit();

			let  outInt: Int32Array = $outer.intBuffer.array();
			let  outOffset: number = $outer.intBuffer.arrayOffset() + $outer.intBuffer.position();

			while (inOffset < inLimit) {
				let  c: CodePoint = in[inOffset];
				inOffset++;
				if ($outer.prevHighSurrogate !== -1) {
					if (java.lang.Character.isLowSurrogate(c)) {
						outInt[outOffset] = java.lang.Character.toCodePoint( $outer.prevHighSurrogate as CodePoint, c);
						outOffset++;
						$outer.prevHighSurrogate = -1;
					} else {
						// Dangling high surrogate
						outInt[outOffset] = $outer.prevHighSurrogate;
						outOffset++;
						if (java.lang.Character.isHighSurrogate(c)) {
							$outer.prevHighSurrogate = c & 0xFFFF;
						} else {
							outInt[outOffset] = c & 0xFFFF;
							outOffset++;
							$outer.prevHighSurrogate = -1;
						}
					}
				} else { if (java.lang.Character.isHighSurrogate(c)) {
					$outer.prevHighSurrogate = c & 0xFFFF;
				} else {
					outInt[outOffset] = c & 0xFFFF;
					outOffset++;
				}
}

			}

			if ($outer.prevHighSurrogate !== -1) {
				// Dangling high surrogate
				outInt[outOffset] = $outer.prevHighSurrogate & 0xFFFF;
				outOffset++;
			}

			utf16In.position(inOffset - utf16In.arrayOffset());
			$outer.intBuffer.position(outOffset - $outer.intBuffer.arrayOffset());
		}

		private byteToCharBuffer = (toAppend: number):  void => {
			$outer.byteBuffer.flip();
			// CharBuffers hold twice as much per unit as ByteBuffers, so start with half the capacity.
			let  newBuffer: java.nio.CharBuffer = java.nio.CharBuffer.allocate(Math.max($outer.byteBuffer.remaining() + toAppend, $outer.byteBuffer.capacity() / 2));
			while ($outer.byteBuffer.hasRemaining()) {
				newBuffer.put( ($outer.byteBuffer.get() & 0xFF) as CodePoint);
			}
			$outer.type = $outer.Type.CHAR;
			$outer.byteBuffer = null;
			$outer.charBuffer = newBuffer;
		}

		private byteToIntBuffer = (toAppend: number):  void => {
			$outer.byteBuffer.flip();
			// IntBuffers hold four times as much per unit as ByteBuffers, so start with one quarter the capacity.
			let  newBuffer: IntBuffer = IntBuffer.allocate(Math.max($outer.byteBuffer.remaining() + toAppend, $outer.byteBuffer.capacity() / 4));
			while ($outer.byteBuffer.hasRemaining()) {
				newBuffer.put($outer.byteBuffer.get() & 0xFF);
			}
			$outer.type = $outer.Type.INT;
			$outer.byteBuffer = null;
			$outer.intBuffer = newBuffer;
		}

		private charToIntBuffer = (toAppend: number):  void => {
			$outer.charBuffer.flip();
			// IntBuffers hold two times as much per unit as ByteBuffers, so start with one half the capacity.
			let  newBuffer: IntBuffer = IntBuffer.allocate(Math.max($outer.charBuffer.remaining() + toAppend, $outer.charBuffer.capacity() / 2));
			while ($outer.charBuffer.hasRemaining()) {
				newBuffer.put($outer.charBuffer.get() & 0xFFFF);
			}
			$outer.type = $outer.Type.INT;
			$outer.charBuffer = null;
			$outer.intBuffer = newBuffer;
		}
	};

}

export namespace CodePointBuffer {

	 enum Type {
			BYTE,
			CHAR,
			INT
	}	export type Builder = InstanceType<typeof CodePointBuffer.Builder>;
}


