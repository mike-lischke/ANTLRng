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




/**
 * Wrapper for {@link ByteBuffer} / {@link CharBuffer} / {@link IntBuffer}.
 *
 * Because Java lacks generics on primitive types, these three types
 * do not share an interface, so we have to write one manually.
 */
export  class CodePointBuffer {
	private readonly  type?:  this.Type;
	private readonly  byteBuffer?:  ByteBuffer;
	private readonly  charBuffer?:  java.nio.CharBuffer;
	private readonly  intBuffer?:  IntBuffer;

	private constructor(type: this.Type, byteBuffer: ByteBuffer, charBuffer: java.nio.CharBuffer, intBuffer: IntBuffer) {
		this.type = type;
		this.byteBuffer = byteBuffer;
		this.charBuffer = charBuffer;
		this.intBuffer = intBuffer;
	}

	public static withBytes = (byteBuffer: ByteBuffer): CodePointBuffer => {
		return new  CodePointBuffer(this.Type.BYTE, byteBuffer, undefined, undefined);
	}

	public static withChars = (charBuffer: java.nio.CharBuffer): CodePointBuffer => {
		return new  CodePointBuffer(this.Type.CHAR, undefined, charBuffer, undefined);
	}

	public static withInts = (intBuffer: IntBuffer): CodePointBuffer => {
		return new  CodePointBuffer(this.Type.INT, undefined, undefined, intBuffer);
	}

	public position(): number;

	public position(newPosition: number): void;


	public position(newPosition?: number):  number |  void {
if (newPosition === undefined) {
		switch (this.type) {
			case BYTE:
				return this.byteBuffer.position();
			case CHAR:
				return this.charBuffer.position();
			case INT:
				return this.intBuffer.position();

default:

		}
		throw new  java.lang.UnsupportedOperationException("Not reached");
	}
 else  {
		switch (this.type) {
			case BYTE:
				this.byteBuffer.position(newPosition);
				break;
			case CHAR:
				this.charBuffer.position(newPosition);
				break;
			case INT:
				this.intBuffer.position(newPosition);
				break;

default:

		}
	}

}


	public remaining = (): number => {
		switch (this.type) {
			case BYTE:
				return this.byteBuffer.remaining();
			case CHAR:
				return this.charBuffer.remaining();
			case INT:
				return this.intBuffer.remaining();

default:

		}
		throw new  java.lang.UnsupportedOperationException("Not reached");
	}

	public get = (offset: number): number => {
		switch (this.type) {
			case BYTE:
				return this.byteBuffer.get(offset);
			case CHAR:
				return this.charBuffer.get(offset);
			case INT:
				return this.intBuffer.get(offset);

default:

		}
		throw new  java.lang.UnsupportedOperationException("Not reached");
	}

	public  getType = ():this.Type => {
		return this.type;
	}

	public  arrayOffset = ():number => {
		switch (this.type) {
			case BYTE:
				return this.byteBuffer.arrayOffset();
			case CHAR:
				return this.charBuffer.arrayOffset();
			case INT:
				return this.intBuffer.arrayOffset();

default:

		}
		throw new  java.lang.UnsupportedOperationException("Not reached");
	}

	public  byteArray = ():number[] => {
		/* assert type == Type.BYTE; */ 
		return this.byteBuffer.array();
	}

	public  charArray = ():number[] => {
		/* assert type == Type.CHAR; */ 
		return this.charBuffer.array();
	}

	public  intArray = ():number[] => {
		/* assert type == Type.INT; */ 
		return this.intBuffer.array();
	}

	public static builder = (initialBufferSize: number): CodePointBuffer.Builder => {
		return new  CodePointBuffer.Builder(initialBufferSize);
	}

	public static Builder = class Builder {
		private type?:  $outer.Type;
		private byteBuffer?:  ByteBuffer;
		private charBuffer?:  java.nio.CharBuffer;
		private intBuffer?:  IntBuffer;
		private prevHighSurrogate:  number;

		private constructor(initialBufferSize: number) {
			this.type = $outer.Type.BYTE;
			this.byteBuffer = ByteBuffer.allocate(initialBufferSize);
			this.charBuffer = undefined;
			this.intBuffer = undefined;
			this.prevHighSurrogate = -1;
		}

		public  getType = ():$outer.Type => {
			return this.type;
		}

		public  getByteBuffer = ():ByteBuffer => {
			return this.byteBuffer;
		}

		public  getCharBuffer = ():java.nio.CharBuffer => {
			return this.charBuffer;
		}

		public  getIntBuffer = ():IntBuffer => {
			return this.intBuffer;
		}

		public build = (): CodePointBuffer => {
			switch (this.type) {
				case BYTE:
					this.byteBuffer.flip();
					break;
				case CHAR:
					this.charBuffer.flip();
					break;
				case INT:
					this.intBuffer.flip();
					break;

default:

			}
			return new  CodePointBuffer(this.type, this.byteBuffer, this.charBuffer, this.intBuffer);
		}

		private static roundUpToNextPowerOfTwo = (i: number): number => {
			let  nextPowerOfTwo: number = 32 - java.lang.Integer.numberOfLeadingZeros(i - 1);
			return Number( Math.pow(2, nextPowerOfTwo));
		}

		public ensureRemaining = (remainingNeeded: number): void => {
			switch (this.type) {
				case BYTE:
					if (this.byteBuffer.remaining() < remainingNeeded) {
						let  newCapacity: number = Builder.roundUpToNextPowerOfTwo(this.byteBuffer.capacity() + remainingNeeded);
						let  newBuffer: ByteBuffer = ByteBuffer.allocate(newCapacity);
						this.byteBuffer.flip();
						newBuffer.put(this.byteBuffer);
						this.byteBuffer = newBuffer;
					}
					break;
				case CHAR:
					if (this.charBuffer.remaining() < remainingNeeded) {
						let  newCapacity: number = Builder.roundUpToNextPowerOfTwo(this.charBuffer.capacity() + remainingNeeded);
						let  newBuffer: java.nio.CharBuffer = java.nio.CharBuffer.allocate(newCapacity);
						this.charBuffer.flip();
						newBuffer.put(this.charBuffer);
						this.charBuffer = newBuffer;
					}
					break;
				case INT:
					if (this.intBuffer.remaining() < remainingNeeded) {
						let  newCapacity: number = Builder.roundUpToNextPowerOfTwo(this.intBuffer.capacity() + remainingNeeded);
						let  newBuffer: IntBuffer = IntBuffer.allocate(newCapacity);
						this.intBuffer.flip();
						newBuffer.put(this.intBuffer);
						this.intBuffer = newBuffer;
					}
					break;

default:

			}
		}

		public append = (utf16In: java.nio.CharBuffer): void => {
			this.ensureRemaining(utf16In.remaining());
			if (utf16In.hasArray()) {
				this.appendArray(utf16In);
			} else {
				// TODO
				throw new  java.lang.UnsupportedOperationException("TODO");
			}
		}

		private appendArray = (utf16In: java.nio.CharBuffer): void => {
			/* assert utf16In.hasArray(); */ 

			switch (this.type) {
				case BYTE:
					this.appendArrayByte(utf16In);
					break;
				case CHAR:
					this.appendArrayChar(utf16In);
					break;
				case INT:
					this.appendArrayInt(utf16In);
					break;

default:

			}
		}

		private appendArrayByte = (utf16In: java.nio.CharBuffer): void => {
			/* assert prevHighSurrogate == -1; */ 

			let  in: number[] = utf16In.array();
			let  inOffset: number = utf16In.arrayOffset() + utf16In.position();
			let  inLimit: number = utf16In.arrayOffset() + utf16In.limit();

			let  outByte: number[] = this.byteBuffer.array();
			let  outOffset: number = this.byteBuffer.arrayOffset() + this.byteBuffer.position();

			while (inOffset < inLimit) {
				let  c: number = in[inOffset];
				if (c <= 0xFF) {
					outByte[outOffset] = Number((c & 0xFF));
				} else {
					utf16In.position(inOffset - utf16In.arrayOffset());
					this.byteBuffer.position(outOffset - this.byteBuffer.arrayOffset());
					if (!java.lang.Character.isHighSurrogate(c)) {
						this.byteToCharBuffer(utf16In.remaining());
						this.appendArrayChar(utf16In);
						return;
					} else {
						this.byteToIntBuffer(utf16In.remaining());
						this.appendArrayInt(utf16In);
						return;
					}
				}
				inOffset++;
				outOffset++;
			}

			utf16In.position(inOffset - utf16In.arrayOffset());
			this.byteBuffer.position(outOffset - this.byteBuffer.arrayOffset());
		}

		private appendArrayChar = (utf16In: java.nio.CharBuffer): void => {
			/* assert prevHighSurrogate == -1; */ 

			let  in: number[] = utf16In.array();
			let  inOffset: number = utf16In.arrayOffset() + utf16In.position();
			let  inLimit: number = utf16In.arrayOffset() + utf16In.limit();

			let  outChar: number[] = this.charBuffer.array();
			let  outOffset: number = this.charBuffer.arrayOffset() + this.charBuffer.position();

			while (inOffset < inLimit) {
				let  c: number = in[inOffset];
				if (!java.lang.Character.isHighSurrogate(c)) {
					outChar[outOffset] = c;
				} else {
					utf16In.position(inOffset - utf16In.arrayOffset());
					this.charBuffer.position(outOffset - this.charBuffer.arrayOffset());
					this.charToIntBuffer(utf16In.remaining());
					this.appendArrayInt(utf16In);
					return;
				}
				inOffset++;
				outOffset++;
			}

			utf16In.position(inOffset - utf16In.arrayOffset());
			this.charBuffer.position(outOffset - this.charBuffer.arrayOffset());
		}

		private appendArrayInt = (utf16In: java.nio.CharBuffer): void => {
			let  in: number[] = utf16In.array();
			let  inOffset: number = utf16In.arrayOffset() + utf16In.position();
			let  inLimit: number = utf16In.arrayOffset() + utf16In.limit();

			let  outInt: number[] = this.intBuffer.array();
			let  outOffset: number = this.intBuffer.arrayOffset() + this.intBuffer.position();

			while (inOffset < inLimit) {
				let  c: number = in[inOffset];
				inOffset++;
				if (this.prevHighSurrogate !== -1) {
					if (java.lang.Character.isLowSurrogate(c)) {
						outInt[outOffset] = java.lang.Character.toCodePoint(Number( this.prevHighSurrogate), c);
						outOffset++;
						this.prevHighSurrogate = -1;
					} else {
						// Dangling high surrogate
						outInt[outOffset] = this.prevHighSurrogate;
						outOffset++;
						if (java.lang.Character.isHighSurrogate(c)) {
							this.prevHighSurrogate = c & 0xFFFF;
						} else {
							outInt[outOffset] = c & 0xFFFF;
							outOffset++;
							this.prevHighSurrogate = -1;
						}
					}
				} else { if (java.lang.Character.isHighSurrogate(c)) {
					this.prevHighSurrogate = c & 0xFFFF;
				} else {
					outInt[outOffset] = c & 0xFFFF;
					outOffset++;
				}
}

			}

			if (this.prevHighSurrogate !== -1) {
				// Dangling high surrogate
				outInt[outOffset] = this.prevHighSurrogate & 0xFFFF;
				outOffset++;
			}

			utf16In.position(inOffset - utf16In.arrayOffset());
			this.intBuffer.position(outOffset - this.intBuffer.arrayOffset());
		}

		private byteToCharBuffer = (toAppend: number): void => {
			this.byteBuffer.flip();
			// CharBuffers hold twice as much per unit as ByteBuffers, so start with half the capacity.
			let  newBuffer: java.nio.CharBuffer = java.nio.CharBuffer.allocate(Math.max(this.byteBuffer.remaining() + toAppend, this.byteBuffer.capacity() / 2));
			while (this.byteBuffer.hasRemaining()) {
				newBuffer.put(Number( (this.byteBuffer.get() & 0xFF)));
			}
			this.type = $outer.Type.CHAR;
			this.byteBuffer = undefined;
			this.charBuffer = newBuffer;
		}

		private byteToIntBuffer = (toAppend: number): void => {
			this.byteBuffer.flip();
			// IntBuffers hold four times as much per unit as ByteBuffers, so start with one quarter the capacity.
			let  newBuffer: IntBuffer = IntBuffer.allocate(Math.max(this.byteBuffer.remaining() + toAppend, this.byteBuffer.capacity() / 4));
			while (this.byteBuffer.hasRemaining()) {
				newBuffer.put(this.byteBuffer.get() & 0xFF);
			}
			this.type = $outer.Type.INT;
			this.byteBuffer = undefined;
			this.intBuffer = newBuffer;
		}

		private charToIntBuffer = (toAppend: number): void => {
			this.charBuffer.flip();
			// IntBuffers hold two times as much per unit as ByteBuffers, so start with one half the capacity.
			let  newBuffer: IntBuffer = IntBuffer.allocate(Math.max(this.charBuffer.remaining() + toAppend, this.charBuffer.capacity() / 2));
			while (this.charBuffer.hasRemaining()) {
				newBuffer.put(this.charBuffer.get() & 0xFFFF);
			}
			this.type = $outer.Type.INT;
			this.charBuffer = undefined;
			this.intBuffer = newBuffer;
		}
	};

}

namespace CodePointBuffer {
export 
	 enum Type {
			BYTE,
			CHAR,
			INT
	}
export type Builder = InstanceType<typeof CodePointBuffer.Builder>;
}


