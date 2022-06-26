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
import { IntStream } from "./IntStream";
import { Interval } from "./misc/Interval";




/**
 * Vacuum all input from a {@link Reader}/{@link InputStream} and then treat it
 * like a {@code char[]} buffer. Can also pass in a {@link String} or
 * {@code char[]} to use.
 *
 * <p>If you need encoding, pass in stream/reader with correct encoding.</p>
 *
 * @deprecated as of 4.7 Please use {@link CharStreams} interface.
 */
export  class ANTLRInputStream extends  CharStream {
    public static readonly  READ_BUFFER_SIZE:  number = 1024;
   	public static readonly  INITIAL_BUFFER_SIZE:  number = 1024;

	/** The data being scanned */
	protected data:  number[];

	/** How many characters are actually in the buffer */
	protected n:  number;

	/** 0..n-1 index into string of next char */
	protected p:  number=0;

	/** What is name or source of this char stream? */
	public name?:  string;

    public constructor();

	/** Copy data in string to a local char array */
	public constructor(input: string);

    public constructor(r: Reader);

	public constructor(input: InputStream);

	/** This is the preferred constructor for strings as no data is copied */
	public constructor(data: number[], numberOfActualCharsInArray: number);

    public constructor(r: Reader, initialSize: number);

	public constructor(input: InputStream, initialSize: number);

    public constructor(r: Reader, initialSize: number, readChunkSize: number);

	public constructor(input: InputStream, initialSize: number, readChunkSize: number);
public constructor(inputOrROrData?: string | Reader | InputStream | number[], numberOfActualCharsInArrayOrInitialSize?: number, readChunkSize?: number) {
const $this = (inputOrROrData?: string | Reader | InputStream | number[], numberOfActualCharsInArrayOrInitialSize?: number, readChunkSize?: number): void => {
if (inputOrROrData === undefined) { super();
}
 else if (typeof inputOrROrData === "string" && numberOfActualCharsInArrayOrInitialSize === undefined) {
const input = inputOrROrData as string;
		super();
this.data = input.toCharArray();
		this.n = input.length;
	}
 else if (inputOrROrData instanceof Reader && numberOfActualCharsInArrayOrInitialSize === undefined) {
const r = inputOrROrData as Reader;
        $this(r, ANTLRInputStream.INITIAL_BUFFER_SIZE, ANTLRInputStream.READ_BUFFER_SIZE);
    }
 else if (inputOrROrData instanceof InputStream && numberOfActualCharsInArrayOrInitialSize === undefined) {
const input = inputOrROrData as InputStream;
		$this(new  InputStreamReader(input), ANTLRInputStream.INITIAL_BUFFER_SIZE);
	}
 else if (typeof inputOrROrData === "number[]" && typeof numberOfActualCharsInArrayOrInitialSize === "number" && readChunkSize === undefined) {
const data = inputOrROrData as number[];
const numberOfActualCharsInArray = numberOfActualCharsInArrayOrInitialSize as number;
		super();
this.data = data;
		this.n = numberOfActualCharsInArray;
	}
 else if (inputOrROrData instanceof Reader && typeof numberOfActualCharsInArrayOrInitialSize === "number" && readChunkSize === undefined) {
const r = inputOrROrData as Reader;
const initialSize = numberOfActualCharsInArrayOrInitialSize as number;
        $this(r, initialSize, ANTLRInputStream.READ_BUFFER_SIZE);
    }
 else if (inputOrROrData instanceof InputStream && typeof numberOfActualCharsInArrayOrInitialSize === "number" && readChunkSize === undefined) {
const input = inputOrROrData as InputStream;
const initialSize = numberOfActualCharsInArrayOrInitialSize as number;
		$this(new  InputStreamReader(input), initialSize);
	}
 else if (inputOrROrData instanceof Reader && typeof numberOfActualCharsInArrayOrInitialSize === "number" && typeof readChunkSize === "number") {
const r = inputOrROrData as Reader;
const initialSize = numberOfActualCharsInArrayOrInitialSize as number;
        super();
this.load(r, initialSize, readChunkSize);
    }
 else  {
let input = inputOrROrData as InputStream;
let initialSize = numberOfActualCharsInArrayOrInitialSize as number;
		$this(new  InputStreamReader(input), initialSize, readChunkSize);
	}
};

$this(inputOrROrData, numberOfActualCharsInArrayOrInitialSize, readChunkSize);

}


	public load = (r: Reader, size: number, readChunkSize: number): void =>
	{
		if ( r===undefined ) {
			return;
		}
		if ( size<=0 ) {
			size = ANTLRInputStream.INITIAL_BUFFER_SIZE;
		}
		if ( readChunkSize<=0 ) {
			readChunkSize = ANTLRInputStream.READ_BUFFER_SIZE;
   		}
   		// System.out.println("load "+size+" in chunks of "+readChunkSize);
   		try {
   			// alloc initial buffer size.
   			this.data = new   Array<number>(size);
   			// read all the data in chunks of readChunkSize
   			let  numRead: number=0;
   			let  p: number = 0;
   			do {
   				if ( p+readChunkSize > this.data.length ) { // overflow?
   					// System.out.println("### overflow p="+p+", data.length="+data.length);
   					this.data = java.util.Arrays.copyOf(this.data, this.data.length * 2);
   				}
   				numRead = r.read(this.data, p, readChunkSize);
   				// System.out.println("read "+numRead+" chars; p was "+p+" is now "+(p+numRead));
   				p += numRead;
   			} while (numRead!==-1); // while not EOF
   			// set the actual size of the data available;
   			// EOF subtracted one above in p+=numRead; add one back
   			this.n = p+1;
   			//System.out.println("n="+n);
   		}
   		finally {
   			r.close();
   		}
   	}

	/** Reset the stream so that it's in the same state it was
	 *  when the object was created *except* the data array is not
	 *  touched.
	 */
	public reset = (): void => {
		this.p = 0;
	}

    public consume = (): void => {
		if (this.p >= this.n) {
			/* assert LA(1) == IntStream.EOF; */ 
			throw new  java.lang.IllegalStateException("cannot consume EOF");
		}

		//System.out.println("prev p="+p+", c="+(char)data[p]);
        if ( this.p < this.n ) {
            this.p++;
			//System.out.println("p moves to "+p+" (c='"+(char)data[p]+"')");
        }
    }

    public LA = (i: number): number => {
		if ( i===0 ) {
			return 0; // undefined
		}
		if ( i<0 ) {
			i++; // e.g., translate LA(-1) to use offset i=0; then data[p+0-1]
			if ( (this.p+i-1) < 0 ) {
				return IntStream.EOF; // invalid; no char before first char
			}
		}

		if ( (this.p+i-1) >= this.n ) {
            //System.out.println("char LA("+i+")=EOF; p="+p);
            return IntStream.EOF;
        }
        //System.out.println("char LA("+i+")="+(char)data[p+i-1]+"; p="+p);
		//System.out.println("LA("+i+"); p="+p+" n="+n+" data.length="+data.length);
		return this.data[this.p+i-1];
    }

	public LT = (i: number): number => {
		return this.LA(i);
	}

	/** Return the current input symbol index 0..n where n indicates the
     *  last symbol has been read.  The index is the index of char to
	 *  be returned from LA(1).
     */
    public index = (): number => {
        return this.p;
    }

	public size = (): number => {
		return this.n;
	}

    /** mark/release do nothing; we have entire buffer */
	public mark = (): number => {
		return -1;
    }

	public release = (marker: number): void => {
	}

	/** consume() ahead until p==index; can't just set p=index as we must
	 *  update line and charPositionInLine. If we seek backwards, just set p
	 */
	public seek = (index: number): void => {
		if ( index<=this.p ) {
			this.p = index; // just jump; don't update stream state (line, ...)
			return;
		}
		// seek forward, consume until p hits index or n (whichever comes first)
		index = Math.min(index, this.n);
		while ( this.p<index ) {
			this.consume();
		}
	}

	public getText = (interval: Interval): string => {
		let  start: number = interval.a;
		let  stop: number = interval.b;
		if ( stop >= this.n ) {
 stop = this.n-1;
}

		let  count: number = stop - start + 1;
		if ( start >= this.n ) {
 return "";
}

//		System.err.println("data: "+Arrays.toString(data)+", n="+n+
//						   ", start="+start+
//						   ", stop="+stop);
		return new  string(this.data, start, count);
	}

	public getSourceName = (): string => {
		if (this.name === undefined || this.name.isEmpty()) {
			return IntStream.UNKNOWN_SOURCE_NAME;
		}

		return this.name;
	}

    public toString = (): string => { return new  string(this.data); }
}
