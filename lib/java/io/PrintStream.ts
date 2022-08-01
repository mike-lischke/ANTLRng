/*
 * This file is released under the MIT license.
 * Copyright (c) 2022, Mike Lischke
 *
 * See LICENSE-MIT.txt file for more info.
 */

import * as util from "util";

import { NotImplementedError } from "../../NotImplementedError";
import { CodePoint, IllegalArgumentException, System } from "../lang";
import { CharSequence } from "../lang/CharSequence";
import { File } from "./File";
import { FileOutputStream } from "./FileOutputStream";
import { FilterOutputStream } from "./FilterOutputStream";
import { OutputStream } from "./OutputStream";

// A very simple implementation of this class, only to have print/println available, which always print to the console.
export class PrintStream extends FilterOutputStream {

    // TODO: need a way to get all individual values from the BufferEncoding union type.
    private static supportedEncodings = new Set<string>([
        "ascii",   // alias to latin1
        "utf8",
        "utf-8",
        "utf16le",
        "ucs2",    // alias to utf16le
        "ucs-2",   // alias to utf16le
        "latin1",
        "binary",  // alias to latin11
    ]);
    private autoFlush = false;

    private encoding: BufferEncoding;

    /** Creates a new print stream, without automatic line flushing, with the specified file and charset. */
    public constructor(file: File, csn?: string);
    public constructor(out: OutputStream, autoFlush?: boolean, encoding?: string);
    // eslint-disable-next-line @typescript-eslint/unified-signatures
    public constructor(fileName: string, csn?: string);
    public constructor(fileOrOutOrFileName: File | OutputStream | string, csnOrAutoFlush?: string | boolean,
        encoding?: string) {
        if (fileOrOutOrFileName instanceof File) {
            /* @ts-expect-error, because of the super() call in the closure. */
            super(new FileOutputStream(fileOrOutOrFileName));
        } else if (fileOrOutOrFileName instanceof OutputStream) {
            super(fileOrOutOrFileName);
        } else {
            super(new FileOutputStream(fileOrOutOrFileName));
        }

        if (typeof csnOrAutoFlush === "boolean") {
            this.autoFlush = csnOrAutoFlush;
        } else if (encoding || csnOrAutoFlush) {
            let charset = "utf8";
            charset = encoding ?? csnOrAutoFlush;

            charset = charset.toLowerCase();
            if (!PrintStream.supportedEncodings.has(charset)) {
                new IllegalArgumentException(`Invalid encoding specified: ${encoding}`);
            }

            this.encoding = charset as BufferEncoding;
        }

    }

    // Appends the specified character ((sub) sequence) to this output stream.
    // Because the JS string type does not implement CharSequence, a separate signature only for a string is added.
    public append(c: CodePoint | string | CharSequence): PrintStream;
    public append(csq: CharSequence, start: number, end: number): PrintStream;
    public append(cOrSOrCsq: CodePoint | string | CharSequence, start?: number, end?: number): PrintStream {
        let text: string;
        if (typeof cOrSOrCsq === "string") {
            text = cOrSOrCsq;
        } else if (typeof cOrSOrCsq === "number") {
            text = String.fromCodePoint(cOrSOrCsq);
        } else {
            start = start ?? 0;
            end = end ?? cOrSOrCsq.length();
            text = cOrSOrCsq.subSequence(start, end).toString();
        }

        const buffer = Buffer.from(text, this.encoding);
        this.out.write(buffer.valueOf());

        return this;
    }

    // Flushes the stream and checks its error state.
    public checkError(): boolean {
        try {
            this.out.flush();

            return true;
        } catch (e) {
            return false;
        }
    }

    // Closes the stream.
    public close(): void {
        this.out.close();
    }

    // Flushes the stream.
    public flush(): void {
        this.out.flush();
    }

    // Writes a formatted string to this output stream using the specified format string and arguments.
    // public format(l: string, format: string, ...args: unknown[]): PrintStream; no support for locales for now.
    public format(format: string, ...args: unknown[]): PrintStream {
        const text = util.format(format, args);
        this.append(text);

        return this;
    }

    public print(v?: boolean | CodePoint | number | object | string): void {
        if (v === undefined) {
            this.append("null");
        } else {
            this.append(String(v));
        }
    }

    // A convenience method to write a formatted string to this output stream using the specified format string
    // and arguments.
    public printf(format: string, ...args: unknown[]): PrintStream {
        return this.format(format, args);
    }

    // Terminates the current line by writing the line separator string.
    public println(v?: boolean | CodePoint | number | object | string): void {
        this.print(v);
        this.print(System.getProperty("line.separator"));

        if (this.autoFlush) {
            this.flush();
        }
    }

    // Writes len bytes from the specified byte array starting at offset off to this stream.
    public write(b: Uint8Array): void;
    public write(b: Uint8Array, off: number, len: number): void;
    // Writes the specified byte to this output stream.
    // eslint-disable-next-line @typescript-eslint/unified-signatures
    public write(b: number): void;
    public write(b: Uint8Array | number, off?: number, len?: number): void {
        if (typeof b === "number") {
            this.out.write(b);
        } else {
            this.out.write(b, off, len);
        }
    }

    // Clears the internal error state of this stream.
    protected clearError(): void {
        throw new NotImplementedError();
    }

    // Sets the error state of the stream to true.
    protected setError(): void {
        throw new NotImplementedError();
    }

}
