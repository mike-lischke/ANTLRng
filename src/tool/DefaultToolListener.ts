/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { ANTLRMessage } from "./ANTLRMessage.js";
import { ANTLRToolListener } from "./ANTLRToolListener.js";
import { ErrorManager } from "./ErrorManager.js";

export class DefaultToolListener implements ANTLRToolListener {
    public info(msg: string): void {
        if (ErrorManager.get().formatWantsSingleLineMessage()) {
            msg = msg.replace("\n", " ");
        }

        console.log(msg);
    }

    public error(msg: ANTLRMessage): void {
        const msgST = ErrorManager.get().getMessageTemplate(msg);
        if (msgST) {
            let outputMsg = msgST.render();
            if (ErrorManager.get().formatWantsSingleLineMessage()) {
                outputMsg = outputMsg.replace("\n", " ");
            }

            console.log(outputMsg);
        }
    }

    public warning(msg: ANTLRMessage): void {
        const msgST = ErrorManager.get().getMessageTemplate(msg);
        if (msgST) {
            let outputMsg = msgST.render();
            if (ErrorManager.get().formatWantsSingleLineMessage()) {
                outputMsg = outputMsg.replace("\n", " ");
            }

            console.log(outputMsg);
        }
    }
}
