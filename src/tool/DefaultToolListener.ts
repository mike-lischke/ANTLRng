/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { ANTLRMessage } from "./ANTLRMessage.js";
import { ANTLRToolListener } from "./ANTLRToolListener.js";
import type { ErrorManager } from "./ErrorManager.js";

export class DefaultToolListener implements ANTLRToolListener {
    public constructor(private manager: ErrorManager) {
    }

    public info(msg: string): void {
        if (this.manager.formatWantsSingleLineMessage()) {
            msg = msg.replace("\n", " ");
        }

        console.log(msg);
    }

    public error(msg: ANTLRMessage): void {
        const msgST = this.manager.getMessageTemplate(msg);
        if (msgST) {
            let outputMsg = msgST.render();
            if (this.manager.formatWantsSingleLineMessage()) {
                outputMsg = outputMsg.replace("\n", " ");
            }

            console.log(outputMsg);
        }
    }

    public warning(msg: ANTLRMessage): void {
        const msgST = this.manager.getMessageTemplate(msg);
        if (msgST) {
            let outputMsg = msgST.render();
            if (this.manager.formatWantsSingleLineMessage()) {
                outputMsg = outputMsg.replace("\n", " ");
            }

            console.log(outputMsg);
        }
    }
}
