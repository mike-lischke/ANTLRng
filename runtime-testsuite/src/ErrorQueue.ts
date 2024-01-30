/* java2ts: keep */

/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

export class ErrorQueue {
    public readonly infos: string[] = [];
    public readonly errors: string[] = [];
    public readonly warnings: string[] = [];
    public readonly all: string[] = [];

    public info(msg: string): void {
        this.infos.push(msg);
    }

    public error(msg: string): void {
        this.errors.push(msg);
        this.all.push(msg);
    }

    public warning(msg: string): void {
        this.warnings.push(msg);
        this.all.push(msg);
    }

    public size(): number {
        return this.all.length + this.infos.length;
    }
}
