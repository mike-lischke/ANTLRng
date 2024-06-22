/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { GrammarTreeVisitor } from "../../../../../src/tree-walkers/GrammarTreeVisitor.js";
import type { ErrorManager } from "./tool/ErrorManager.js";
import { ErrorType } from "./tool/ErrorType.js";
import type { ActionAST } from "./tool/ast/ActionAST.js";
import type { GrammarAST } from "./tool/ast/GrammarAST.js";
import type { RuleAST } from "./tool/ast/RuleAST.js";
import type { TerminalAST } from "./tool/ast/TerminalAST.js";

export class UndefChecker extends GrammarTreeVisitor {
    public badRef: boolean = false;
    private errMgr: ErrorManager;
    private ruleToAST: Map<string, RuleAST>;

    public constructor(private isLexer: boolean) {
        super();
    }

    public override tokenRef(ref: TerminalAST): void {
        if (ref.getText() === "EOF") {
            // this is a special predefined reference
            return;
        }

        if (this.isLexer) {
            this.ruleRef(ref, null);
        }
    }

    public override ruleRef(ref: GrammarAST, arg: ActionAST | null): void {
        const ruleAST: RuleAST | undefined = this.ruleToAST.get(ref.getText()!);
        const fileName = ref.getToken()?.inputStream?.getSourceName() ?? "<unknown>";
        if (this.currentRuleName?.charAt(0).toUpperCase() === this.currentRuleName?.charAt(0) &&
            ref.getText()?.charAt(0).toLowerCase() === ref.getText()?.charAt(0)) {
            this.badRef = true;
            this.errMgr.grammarError(ErrorType.PARSER_RULE_REF_IN_LEXER_RULE,
                fileName, ref.getToken(), ref.getText(), this.currentRuleName);
        } else if (!ruleAST) {
            this.badRef = true;
            this.errMgr.grammarError(ErrorType.UNDEFINED_RULE_REF, fileName, ref.token, ref.getText());
        }
    }

    public override getErrorManager(): ErrorManager {
        return this.errMgr;
    }
}
