/* java2ts: keep */

/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { ANTLRMessage, ANTLRToolListener, Tool } from "../temp.js";

export class ErrorQueue implements ANTLRToolListener {
    public readonly tool?: Tool;
    public readonly infos: string[] = [];
    public readonly errors: ANTLRMessage[] = [];
    public readonly warnings: ANTLRMessage[] = [];
    public readonly all: ANTLRMessage[] = [];

    public constructor(tool?: Tool) {
        this.tool = tool;
    }

    public info(msg: string): void {
        this.infos.push(msg);
    }

    public error(msg: ANTLRMessage): void {
        this.errors.push(msg);
        this.all.push(msg);
    }

    public warning(msg: ANTLRMessage): void {
        this.warnings.push(msg);
        this.all.push(msg);
    }

    public size(): number {
        return this.all.length + this.infos.length;
    }

    public toString(rendered?: boolean): string {
        if (!rendered) {
            return this.all.map((m) => { return m.toString(); }).join("\n");
        }

        if (this.tool === null) {
            throw new Error(`No ANTLRng instance is available.`);
        }

        let buf = "";
        for (const m of this.all) {
            const st = this.tool?.errMgr.getMessageTemplate(m);
            buf += st?.render() + "\n";
        }

        return buf;
    }

}
