/*
 * This file is released under the MIT license.
 * Copyright (c) 2022, Mike Lischke
 *
 * See LICENSE file for more info.
 */

/* cSpell: ignore closeables */

import * as fs from "fs/promises";
import { readSync } from "fs";

import { Throwable } from "../lang";
import { Closeable } from "./Closable";
import { IOException } from "./IOException";

export class FileDescriptor {
    //public static readonly err = new FileDescriptor(2);
    //public static readonly out = new FileDescriptor(1);
    //public static readonly in = new FileDescriptor(0);

    private parent?: Closeable;
    private otherParents: Closeable[] = [];
    private closed = true;
    //private append = false;

    private handle: fs.FileHandle;

    public constructor(fileName: string, flags: string | number, mode: number) {
        fs.open(fileName, flags, mode).then((handle) => {
            this.handle = handle;
        }).catch((reason) => {
            throw new IOException("Cannot open file", Throwable.fromError(reason));
        });
    }

    public sync(): Promise<void> {
        return this.handle.sync();
    }

    public valid(): boolean {
        return true;
    }

    /**
     * Attach a Closeable to this FD for tracking.
     * parent reference is added to otherParents when
     * needed to make closeAll simpler.
     *
     * @param c tbd
     */
    public attach(c: Closeable): void {
        if (!this.parent) {
            // first caller gets to do this
            this.parent = c;
        } else if (this.otherParents.length === 0) {
            this.otherParents.push(this.parent);
            this.otherParents.push(c);
        } else {
            this.otherParents.push(c);
        }
    }

    /**
     * Cycle through all closeables sharing this FD and call
     * close() on each one.
     *
     * The caller closeable gets to call close0().
     *
     * @param releaser tbd
     */
    public closeAll(releaser: Closeable): void {
        if (!this.closed) {
            this.closed = true;
            let ioe: IOException | undefined;

            try {
                try {
                    for (const referent of this.otherParents) {
                        try {
                            referent.close();
                        } catch (x) {
                            if (!ioe) {
                                ioe = x;
                            } else {
                                ioe.addSuppressed(new Throwable(String(x)));
                            }
                        }
                    }
                } finally {
                    releaser.close();
                }
            } catch (ex) {
                /*
                 * If releaser close() throws IOException
                 * add other exceptions as suppressed.
                 */
                const t = new Throwable(String(ex));
                if (ioe) {
                    t.addSuppressed(ioe);
                }

                ioe = t;
            } finally {
                if (ioe) {
                    // eslint-disable-next-line no-unsafe-finally
                    throw ioe;
                }
            }
        }
    }

    public readData(target: Buffer, offset?: number, length?: number): number {
        return readSync(this.handle.fd, target, { offset, length });
    }

}
