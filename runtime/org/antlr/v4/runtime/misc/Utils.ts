/* java2ts: keep */

/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { JavaObject, java, S, SourceDataType, I } from "jree";

import { IntegerList } from "./IntegerList";
import { IntervalSet } from "./IntervalSet";

export class Utils extends JavaObject {
    // Seriously: why isn't this built in to java? ugh!
    public static join<T extends SourceDataType>(iter: java.util.Iterator<T>,
        separator: java.lang.String): java.lang.String;
    public static join<T extends SourceDataType>(array: T[], separator: java.lang.String): java.lang.String;
    public static join<T extends SourceDataType>(iterOrArray: java.util.Iterator<T> | T[],
        separator: java.lang.String): java.lang.String {
        if (Array.isArray(iterOrArray)) {
            return S`${iterOrArray.join(`${separator}`)}`;
        }

        const buf = new java.lang.StringBuilder();
        while (iterOrArray.hasNext()) {
            buf.append(iterOrArray.next());
            if (iterOrArray.hasNext()) {
                buf.append(separator);
            }
        }

        return buf.toString();
    }

    public static numNonnull = (data: java.lang.Object[] | null): number => {
        let n = 0;
        if (data === null) {
            return n;
        }

        for (const o of data) {
            if (o !== null) {
                n++;
            }

        }

        return n;
    };

    public static removeAllElements = <T>(data: java.util.Collection<T> | null, value: T): void => {
        if (data === null) {
            return;
        }

        while (data.contains(value)) {
            data.remove(value);
        }
    };

    public static escapeWhitespace = (s: java.lang.String, escapeSpaces: boolean): java.lang.String => {
        const buf: java.lang.StringBuilder = new java.lang.StringBuilder();
        for (const c of s.toCharArray()) {
            if (c === 0x20 && escapeSpaces) {
                buf.append("\u00B7");
            }

            else {
                if (c === 0x09) {
                    buf.append(S`\\t`);
                }

                else {
                    if (c === 0x0A) {
                        buf.append(S`\\n`);
                    }

                    else {
                        if (c === 0x0D) {
                            buf.append(S`\\r`);
                        }

                        else {
                            buf.append(c);
                        }
                    }
                }
            }
        }

        return buf.toString();
    };

    public static writeFile(fileName: java.lang.String, content: java.lang.String): void;
    public static writeFile(fileName: java.lang.String, content: java.lang.String, encoding: java.lang.String): void;
    public static writeFile(fileName: java.lang.String, content: java.lang.String, encoding?: java.lang.String): void {
        const f = new java.io.File(fileName);
        const fos = new java.io.FileOutputStream(f);
        const osw = new java.io.OutputStreamWriter(fos, encoding);

        try {
            osw.write(content);
        }
        finally {
            osw.close();
        }
    }

    public static readFile(fileName: java.lang.String): Uint16Array;
    public static readFile(fileName: java.lang.String, encoding: java.lang.String): Uint16Array;
    public static readFile(fileName: java.lang.String, encoding?: java.lang.String): Uint16Array {
        const f = new java.io.File(fileName);
        const size = Number(f.length());
        const fis = new java.io.FileInputStream(fileName);
        const isr = new java.io.InputStreamReader(fis, encoding);
        let data = new Uint16Array(size);
        try {
            const n = isr.read(data);
            if (n < data.length) {
                data = java.util.Arrays.copyOf(data, n);
            }
        }
        finally {
            isr.close();
        }

        return data;
    }

    /**
     * Convert array of strings to string -> index map. Useful for
     *  converting rule names to name -> rule index map.
     *
     * @param keys The array of strings to convert.
     *
     * @returns The resulting map.
     */
    public static toMap = (keys: java.lang.String[]): java.util.Map<java.lang.String, java.lang.Integer> => {
        const m = new java.util.HashMap<java.lang.String, java.lang.Integer>();
        for (let i = 0; i < keys.length; i++) {
            m.put(keys[i], I`${i}`);
        }

        return m;
    };

    public static toCharArray = (data: IntegerList | null): Uint16Array | null => {
        if (data === null) {
            return null;
        }

        return data.toCharArray();
    };

    public static toSet = (bits: java.util.BitSet): IntervalSet | null => {
        const s = new IntervalSet();
        let i: number = bits.nextSetBit(0);
        while (i >= 0) {
            s.add(i);
            i = bits.nextSetBit(i + 1);
        }

        return s;
    };

    /***/
    public static expandTabs = (s: java.lang.String | null, tabSize: number): java.lang.String | null => {
        if (s === null) {
            return null;
        }

        const buf = new java.lang.StringBuilder();
        let col = 0;
        for (let i = 0; i < s.length(); i++) {
            const c = s.charAt(i);
            switch (c) {
                case 0x0A: {
                    col = 0;
                    buf.append(c);
                    break;
                }

                case 0x09: {
                    const n: number = tabSize - col % tabSize;
                    col += n;
                    buf.append(Utils.spaces(n));
                    break;
                }

                default: {
                    col++;
                    buf.append(c);
                    break;
                }

            }
        }

        return buf.toString();
    };

    /***/
    public static spaces = (n: number): java.lang.String => {
        return S`${" ".repeat(n)}`;
    };

    /***/
    public static newlines = (n: number): java.lang.String => {
        return S`${"\n".repeat(n)}`;
    };

    /***/
    public static sequence = (n: number, s: java.lang.String): java.lang.String => {
        return S`${s.valueOf().repeat(n)}`;
    };

    /***/
    public static count = (s: java.lang.String, x: java.lang.char): number => {
        let n = 0;
        for (let i = 0; i < s.length(); i++) {
            if (s.charAt(i) === x) {
                n++;
            }
        }

        return n;
    };
}
