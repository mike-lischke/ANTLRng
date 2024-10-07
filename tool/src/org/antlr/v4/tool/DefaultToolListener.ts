/* java2ts: keep */

/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { Tool } from "../Tool.js";
import { ANTLRMessage } from "./ANTLRMessage.js";
import { ANTLRToolListener } from "./ANTLRToolListener.js";

export class DefaultToolListener implements ANTLRToolListener {
    public tool: Tool;

    public constructor(tool: Tool) { this.tool = tool; }

    public info(msg: string): void {
        if (this.tool.errMgr.formatWantsSingleLineMessage()) {
            msg = msg.replace("\n", " ");
        }

        console.log(msg);
    }

    public error(msg: ANTLRMessage): void {
        const msgST = this.tool.errMgr.getMessageTemplate(msg);
        if (msgST) {
            let outputMsg = msgST.render();
            if (this.tool.errMgr.formatWantsSingleLineMessage()) {
                outputMsg = outputMsg.replace("\n", " ");
            }

            console.log(outputMsg);
        }
    }

    public warning(msg: ANTLRMessage): void {
        const msgST = this.tool.errMgr.getMessageTemplate(msg);
        if (msgST) {
            let outputMsg = msgST.render();
            if (this.tool.errMgr.formatWantsSingleLineMessage()) {
                outputMsg = outputMsg.replace("\n", " ");
            }

            console.log(outputMsg);
        }
    }
}
