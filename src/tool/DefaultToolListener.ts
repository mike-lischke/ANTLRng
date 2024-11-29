/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { ANTLRMessage } from "./ANTLRMessage.js";
import { ANTLRToolListener } from "./ANTLRToolListener.js";
import type { ErrorManager } from "./ErrorManager.js";

// TODO: This listener takes an error manager, but is added that as listener.
export class DefaultToolListener implements ANTLRToolListener {
    public constructor(private errorManager: ErrorManager) { }

    public info(msg: string): void {
        if (this.errorManager.formatWantsSingleLineMessage()) {
            msg = msg.replace("\n", " ");
        }

        console.log(msg);
    }

    public error(msg: ANTLRMessage): void {
        const msgST = this.errorManager.getMessageTemplate(msg);
        if (msgST) {
            let outputMsg = msgST.render();
            if (this.errorManager.formatWantsSingleLineMessage()) {
                outputMsg = outputMsg.replace("\n", " ");
            }

            console.log(outputMsg);
        }
    }

    public warning(msg: ANTLRMessage): void {
        const msgST = this.errorManager.getMessageTemplate(msg);
        if (msgST) {
            let outputMsg = msgST.render();
            if (this.errorManager.formatWantsSingleLineMessage()) {
                outputMsg = outputMsg.replace("\n", " ");
            }

            console.log(outputMsg);
        }
    }
}
