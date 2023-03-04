/* java2ts: keep */

/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { java, S } from "jree";
import { ANTLRInputStream } from "./ANTLRInputStream";
import { Utils } from "./misc/Utils";

/**
 * This is an {@link ANTLRInputStream} that is loaded from a file all at once
 * when you construct the object.
 *
 * @deprecated as of 4.7 Please use {@link CharStreams} interface.
 */
export class ANTLRFileStream extends ANTLRInputStream {
    protected fileName: java.lang.String;

    public constructor(fileName: java.lang.String | null);

    public constructor(fileName: java.lang.String | null, encoding: java.lang.String | null);
    public constructor(...args: unknown[]) {
        super();

        switch (args.length) {
            case 1: {
                [this.fileName] = args as [java.lang.String];
                this.load(this.fileName, null);

                break;
            }

            case 2: {
                const [fileName, encoding] = args as [java.lang.String, java.lang.String];

                this.fileName = fileName;
                this.load(fileName, encoding);

                break;
            }

            default: {
                throw new java.lang.IllegalArgumentException(S`Invalid number of arguments`);
            }
        }
    }

    public load(fileName: java.lang.String, encoding: java.lang.String | null): void;
    public load(r: java.io.Reader | null, size: number, readChunkSize: number): void;
    public load(...args: unknown[]): void {
        if (args.length === 2) {
            const [fileName, encoding] = args as [java.lang.String, java.lang.String];
            this.data = Utils.readFile(fileName, encoding);
            this.n = this.data.length;
        } else {
            const [r, size, readChunkSize] = args as [java.io.Reader, number, number];
            super.load(r, size, readChunkSize);
        }
    }

    public getSourceName = (): java.lang.String => {
        return this.fileName;
    };
}
