/*
 * Copyright (c) Mike Lischke. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */

// cspell: ignore RULEMODIFIERS, ruleref

import { CommonToken, type ParserRuleContext, type TokenStream } from "antlr4ng";

import {
    ANTLRv4Parser, type AlternativeContext, type AltListContext, type AtomContext, type BlockContext,
    type BlockSetContext, type Action_Context, type ChannelsSpecContext, type CharacterRangeContext,
    type DelegateGrammarsContext, type EbnfContext, type EbnfSuffixContext, type ElementOptionsContext,
    type GrammarSpecContext, type LexerAtomContext, type LexerCommandsContext, type LexerElementsContext,
    type LexerRuleBlockContext, type LexerRuleSpecContext, type ModeSpecContext, type NotSetContext,
    type OptionsSpecContext, type PredicateOptionsContext, type PrequelConstructContext, type RulerefContext,
    type RuleSpecContext, type SetElementContext, type TerminalDefContext, type TokensSpecContext,
    type LexerBlockContext, type RuleActionContext, type ElementOptionContext
} from "../generated/ANTLRv4Parser.js";

import { GrammarASTAdaptor } from "../parse/GrammarASTAdaptor.js";
import { ToolANTLRParser } from "../parse/ToolANTLRParser.js";
import { ActionAST } from "../tool/ast/ActionAST.js";
import { AltAST } from "../tool/ast/AltAST.js";
import { BlockAST } from "../tool/ast/BlockAST.js";
import type { GrammarAST } from "../tool/ast/GrammarAST.js";
import { GrammarRootAST } from "../tool/ast/GrammarRootAST.js";
import { NotAST } from "../tool/ast/NotAST.js";
import { RuleAST } from "../tool/ast/RuleAST.js";
import { SetAST } from "../tool/ast/SetAST.js";
import { TerminalAST } from "../tool/ast/TerminalAST.js";
import { GrammarType } from "./GrammarType.js";
import { OptionalBlockAST } from "../tool/ast/OptionalBlockAST.js";
import { StarBlockAST } from "../tool/ast/StarBlockAST.js";
import { PlusBlockAST } from "../tool/ast/PlusBlockAST.js";

/**
 * Converts a grammar spec parse tree into a grammar AST.
 */
export class ParseTreeToASTConverter {
    // TODO: Grammar.setNodeOptions($tree, options);

    /**
     * Converts the grammar parse tree to an abstract syntax tree (AST).
     * We simulate here the same tree structure as produced by the old ANTlR 3.x parser.
     *
     * @param grammarSpec The root context of the grammar parse tree.
     * @param tokens The token stream to use for the AST nodes.
     *
     * @returns The generated AST.
     */
    public static convertToAST(grammarSpec: GrammarSpecContext, tokens: TokenStream): GrammarRootAST {
        const adaptor = new GrammarASTAdaptor();

        let name = "";
        let type: GrammarType;
        if (grammarSpec.grammarDecl().grammarType().LEXER() !== null) {
            name = "LEXER_GRAMMAR";
            type = GrammarType.Lexer;
        } else if (grammarSpec.grammarDecl().grammarType().PARSER() !== null) {
            name = "PARSER_GRAMMAR";
            type = GrammarType.Parser;
        } else {
            name = "COMBINED_GRAMMAR";
            type = GrammarType.Combined;
        }

        // The grammar type is our root AST node.
        const root = new GrammarRootAST(CommonToken.fromType(ANTLRv4Parser.GRAMMAR, name), tokens);
        root.grammarType = type;
        // TODO: root.token!.inputStream = input;
        const grammarName = grammarSpec.grammarDecl().identifier();
        root.addChild(adaptor.create(ANTLRv4Parser.ID, grammarName.getText()));

        this.convertPrequelConstructToAST(grammarSpec.prequelConstruct(), root, adaptor);
        this.convertRulesToAST(grammarSpec.rules().ruleSpec(), root, adaptor);
        this.convertModeSpecToAST(grammarSpec.modeSpec(), root, adaptor);

        return root;
    }

    private static convertPrequelConstructToAST(prequelConstruct: PrequelConstructContext[], ast: GrammarAST,
        adaptor: GrammarASTAdaptor): void {
        prequelConstruct.forEach((prequel) => {
            if (prequel.optionsSpec()) {
                this.convertOptionsSpecToAST(prequel.optionsSpec()!, ast, adaptor);
            } else if (prequel.delegateGrammars()) {
                this.convertDelegateGrammarsToAST(prequel.delegateGrammars()!, ast, adaptor);
            } else if (prequel.tokensSpec()) {
                this.convertTokensSpec(prequel.tokensSpec()!, ast, adaptor);
            } else if (prequel.channelsSpec()) {
                this.convertChannelsSpecToAST(prequel.channelsSpec()!, ast, adaptor);
            } else if (prequel.action_()) {
                this.convertActionRuleToAST(prequel.action_()!, ast, adaptor);
            }
        });
    }

    private static convertRulesToAST(rules: RuleSpecContext[], ast: GrammarAST, adaptor: GrammarASTAdaptor): void {
        const rulesRoot = adaptor.create(ToolANTLRParser.RULES, "RULES");
        ast.addChild(rulesRoot);
        rules.forEach((rule) => {
            if (rule.parserRuleSpec()) {
                const parserRule = rule.parserRuleSpec()!;
                const ruleAST = new RuleAST(CommonToken.fromType(ToolANTLRParser.RULE, "RULE"));
                rulesRoot.addChild(ruleAST);
                ruleAST.addChild(adaptor.create(ANTLRv4Parser.ID, parserRule.RULE_REF().getText()));
                if (parserRule.argActionBlock()) {
                    this.convertActionBlockToAST(ToolANTLRParser.ARG_ACTION, parserRule.argActionBlock()!, ruleAST);
                }

                if (parserRule.ruleReturns()) {
                    const returnsAST = adaptor.create(ANTLRv4Parser.RETURNS, "RETURNS");
                    this.convertActionBlockToAST(ToolANTLRParser.ARG_ACTION, parserRule.ruleReturns()!, returnsAST);

                    ruleAST.addChild(returnsAST);
                }

                if (parserRule.throwsSpec()) {
                    const throwsAST = adaptor.create(ANTLRv4Parser.THROWS, "THROWS");
                    parserRule.throwsSpec()!.identifier().forEach((id) => {
                        throwsAST.addChild(adaptor.create(ANTLRv4Parser.ID, id.getText()));
                    });

                    ruleAST.addChild(throwsAST);
                }

                if (parserRule.localsSpec()) {
                    const localsAST = adaptor.create(ANTLRv4Parser.LOCALS, "LOCALS");
                    this.convertActionBlockToAST(ToolANTLRParser.ARG_ACTION, parserRule.localsSpec()!, localsAST);

                    ruleAST.addChild(localsAST);
                }

                parserRule.rulePrequel().forEach((prequel) => {
                    if (prequel.optionsSpec()) {
                        this.convertOptionsSpecToAST(prequel.optionsSpec()!, ruleAST, adaptor);
                    } else if (prequel.ruleAction()) {
                        const action = adaptor.create(ANTLRv4Parser.AT, "@");
                        ruleAST.addChild(action);
                        action.addChild(adaptor.create(ANTLRv4Parser.ID, prequel.ruleAction()!.identifier().getText()));
                        this.convertActionBlockToAST(ToolANTLRParser.ACTION, prequel.ruleAction()!, action);
                    }
                });

                const blockAST = new BlockAST(CommonToken.fromType(ToolANTLRParser.BLOCK, "BLOCK"));
                ruleAST.addChild(blockAST);

                parserRule.ruleBlock().ruleAltList().labeledAlt().forEach((labeledAlt) => {
                    // labeledAlt.alternative is rooted at an AltAST node.
                    const altAST = this.convertAlternativeToAST(labeledAlt.alternative(), blockAST, adaptor);

                    if (labeledAlt.identifier()) {
                        const id = adaptor.create(ANTLRv4Parser.ID, labeledAlt.identifier()!.getText());
                        altAST.altLabel = id;
                    }
                });

                parserRule.exceptionGroup().exceptionHandler().forEach((exceptionHandler) => {
                    const exception = adaptor.create(exceptionHandler.CATCH().symbol);
                    ruleAST.addChild(exception);

                    const actionBlock = adaptor.create(ANTLRv4Parser.BEGIN_ARGUMENT,
                        exceptionHandler.argActionBlock().getText());
                    exception.addChild(actionBlock);

                    const token = CommonToken.fromType(ANTLRv4Parser.BEGIN_ACTION,
                        exceptionHandler.actionBlock().getText());
                    const actionAST = new ActionAST(token);
                    ruleAST.addChild(actionAST);
                });

                if (parserRule.exceptionGroup().finallyClause()) {
                    const finallyAST = adaptor.create(
                        parserRule.exceptionGroup().finallyClause()!.FINALLY().symbol);
                    ruleAST.addChild(finallyAST);
                }
            } else if (rule.lexerRuleSpec()) {
                this.convertLexerRuleToAST(rule.lexerRuleSpec()!, rulesRoot, adaptor);
            }
        });
    }

    private static convertModeSpecToAST(modeSpecs: ModeSpecContext[], ast: GrammarAST,
        adaptor: GrammarASTAdaptor): void {
        const mode = adaptor.create(ANTLRv4Parser.MODE, "MODE");
        ast.addChild(mode);
        modeSpecs.forEach((modeSpec) => {
            const id = adaptor.create(ANTLRv4Parser.ID, modeSpec.identifier().getText());
            mode.addChild(id);
            modeSpec.lexerRuleSpec().forEach((lexerRule) => {
                this.convertLexerRuleToAST(lexerRule, mode, adaptor);
            });
        });
    }

    private static convertOptionsSpecToAST(optionsSpec: OptionsSpecContext, ast: GrammarAST,
        adaptor: GrammarASTAdaptor): void {
        const options = adaptor.create(ANTLRv4Parser.OPTIONS, "OPTIONS");
        ast.addChild(options);
        optionsSpec.option().forEach((option) => {
            const assign = adaptor.create(ANTLRv4Parser.ASSIGN, "=");
            options.addChild(assign);
            const id = adaptor.create(ANTLRv4Parser.ID, option.identifier().getText());
            assign.addChild(id);
            const value = adaptor.create(ANTLRv4Parser.STRING_LITERAL, option.optionValue().getText());
            assign.addChild(value);
        });

    }

    private static convertDelegateGrammarsToAST(delegateGrammars: DelegateGrammarsContext, ast: GrammarAST,
        adaptor: GrammarASTAdaptor): void {
        const delegate = adaptor.create(ANTLRv4Parser.IMPORT, "IMPORT");
        ast.addChild(delegate);
        delegateGrammars.delegateGrammar().forEach((dg) => {
            if (dg.ASSIGN()) {
                const assign = adaptor.create(ANTLRv4Parser.ASSIGN, "=");
                delegate.addChild(assign);

                assign.addChild(adaptor.create(ANTLRv4Parser.ID, dg.identifier()[0].getText()));
                assign.addChild(adaptor.create(ANTLRv4Parser.ID, dg.identifier()[1].getText()));
            } else {
                const id = adaptor.create(ANTLRv4Parser.ID, dg.identifier()[0].getText());
                delegate.addChild(id);
            }
        });
    }

    private static convertTokensSpec(tokensSpec: TokensSpecContext, ast: GrammarAST, adaptor: GrammarASTAdaptor): void {
        if (tokensSpec.idList()) {
            const tokens = adaptor.create(ANTLRv4Parser.TOKENS, "TOKENS");
            ast.addChild(tokens);

            tokensSpec.idList()!.identifier().forEach((id) => {
                tokens.addChild(adaptor.create(ANTLRv4Parser.ID, id.getText()));
            });
        }

    }

    private static convertChannelsSpecToAST(channelsSpec: ChannelsSpecContext, ast: GrammarAST,
        adaptor: GrammarASTAdaptor): void {
        if (channelsSpec.idList()) {
            const channels = adaptor.create(ANTLRv4Parser.CHANNELS, "CHANNELS");
            ast.addChild(channels);
            channelsSpec.idList()!.identifier().forEach((id) => {
                channels.addChild(adaptor.create(ANTLRv4Parser.ID, id.getText()));
            });
        }
    }

    private static convertActionRuleToAST(actionRule: Action_Context, ast: GrammarAST,
        adaptor: GrammarASTAdaptor): void {
        const action = adaptor.create(ANTLRv4Parser.AT, "@");
        ast.addChild(action);

        if (actionRule.actionScopeName()) {
            action.addChild(adaptor.create(ANTLRv4Parser.ID, actionRule.actionScopeName()!.getText()));
        }
        action.addChild(adaptor.create(ANTLRv4Parser.ID, actionRule.identifier().getText()));
        this.convertActionBlockToAST(ToolANTLRParser.ACTION, actionRule.actionBlock(), action);
    }

    private static convertAtomToAST(atom: AtomContext, ast: GrammarAST, adaptor: GrammarASTAdaptor): void {
        if (atom.terminalDef()) {
            this.convertTerminalDefToAST(atom.terminalDef()!, ast, adaptor);
        } else if (atom.ruleref()) {
            this.convertRulerefToAST(atom.ruleref()!, ast, adaptor);
        } else if (atom.notSet()) {
            this.convertNotSetToAST(atom.notSet()!, ast, adaptor);
        } else if (atom.DOT()) {
            this.convertWildcardToAST(atom.elementOptions(), ast, adaptor);
        }
    }

    private static convertBlockToAST(block: BlockContext, ast: GrammarAST, adaptor: GrammarASTAdaptor): void {
        const blockAST = new BlockAST(CommonToken.fromType(ToolANTLRParser.BLOCK, "BLOCK"));
        ast.addChild(blockAST);

        if (block.optionsSpec()) {
            this.convertOptionsSpecToAST(block.optionsSpec()!, blockAST, adaptor);
        }

        block.ruleAction().forEach((ruleAction) => {
            this.convertRuleActionToAST(ruleAction, blockAST, adaptor);
        });

        this.convertAltListToAST(block.altList(), blockAST, adaptor);
    }

    private static convertEbnfSuffixToAST(ebnfSuffix: EbnfSuffixContext, ast: GrammarAST): GrammarAST | undefined {
        let blockAST;
        if (ebnfSuffix.QUESTION().length > 0) {
            blockAST = new OptionalBlockAST(ToolANTLRParser.OPTIONAL, CommonToken.fromType(ToolANTLRParser.OPTIONAL,
                "OPTIONAL"), ebnfSuffix.QUESTION().length === 1);
        } else if (ebnfSuffix.STAR()) {
            blockAST = new StarBlockAST(ANTLRv4Parser.STAR, CommonToken.fromType(ANTLRv4Parser.STAR, "CLOSURE"),
                ebnfSuffix.QUESTION().length === 0);
        } else if (ebnfSuffix.PLUS()) {
            blockAST = new PlusBlockAST(ANTLRv4Parser.PLUS,
                CommonToken.fromType(ANTLRv4Parser.PLUS, "POSITIVE_CLOSURE"),
                ebnfSuffix.QUESTION().length === 0);
        }

        ast.addChild(blockAST);

        return blockAST;
    }

    private static convertEbnfToAST(ebnf: EbnfContext, ast: GrammarAST, adaptor: GrammarASTAdaptor): void {
        if (ebnf.blockSuffix()) {
            const root = this.convertEbnfSuffixToAST(ebnf.blockSuffix()!.ebnfSuffix(), ast);
            if (root) {
                this.convertBlockToAST(ebnf.block(), root, adaptor);
            }
        } else {
            this.convertBlockToAST(ebnf.block(), ast, adaptor);
        }
    }

    private static convertActionBlockToAST(tokenType: number, actionBlock: ParserRuleContext,
        ast: GrammarAST): ActionAST {
        const token = CommonToken.fromType(tokenType, actionBlock.getText());
        const actionAST = new ActionAST(token);
        ast.addChild(actionAST);

        return actionAST;
    }

    private static convertPredicateOptionsToAST(options: PredicateOptionsContext, ast: GrammarAST,
        adaptor: GrammarASTAdaptor): void {
        const predicateOptions = adaptor.create(ToolANTLRParser.PREDICATE_OPTIONS, "PREDICATE_OPTIONS");
        ast.addChild(predicateOptions);

        options.predicateOption().forEach((option) => {
            if (option.elementOption()) {
                this.convertElementOptionToAST(option.elementOption()!, predicateOptions, adaptor);
            } else {
                const assign = adaptor.create(ANTLRv4Parser.ASSIGN, "=");
                ast.addChild(assign);
                const id = adaptor.create(ANTLRv4Parser.ID, option.identifier()!.getText());
                assign.addChild(id);

                this.convertActionBlockToAST(ToolANTLRParser.ACTION, option.actionBlock()!, assign);
            }
        });
    }

    private static convertLexerRuleToAST(lexerRule: LexerRuleSpecContext, ast: GrammarAST,
        adaptor: GrammarASTAdaptor): void {
        const ruleAST = new RuleAST(CommonToken.fromType(ToolANTLRParser.RULE, "RULE"));
        ast.addChild(ruleAST);
        ruleAST.addChild(adaptor.create(ANTLRv4Parser.ID, lexerRule.TOKEN_REF().getText()));

        if (lexerRule.FRAGMENT()) {
            const ruleModifiers = adaptor.create(ToolANTLRParser.RULEMODIFIERS, "RULEMODIFIERS");
            ruleAST.addChild(ruleModifiers);

            ruleModifiers.addChild(adaptor.create(ANTLRv4Parser.FRAGMENT, "FRAGMENT"));
        }

        if (lexerRule.optionsSpec()) {
            this.convertOptionsSpecToAST(lexerRule.optionsSpec()!, ruleAST, adaptor);
        }

        this.convertLexerRuleBlockToAST(lexerRule.lexerRuleBlock(), ruleAST, adaptor);
    }

    private static convertLexerRuleBlockToAST(lexerRuleBlock: LexerRuleBlockContext, ast: GrammarAST,
        adaptor: GrammarASTAdaptor): void {
        const blockAST = new BlockAST(CommonToken.fromType(ToolANTLRParser.BLOCK, "BLOCK"));
        ast.addChild(blockAST);

        lexerRuleBlock.lexerAltList().lexerAlt().forEach((lexerAlt) => {
            if (lexerAlt.lexerElements()) {
                if (lexerAlt.lexerCommands()) {
                    const token = CommonToken.fromType(ToolANTLRParser.LEXER_ALT_ACTION, "LEXER_ALT_ACTION");
                    const actionAST = new ActionAST(token);
                    blockAST.addChild(actionAST);

                    this.convertLexerElementsToAST(lexerAlt.lexerElements()!, actionAST, adaptor);
                    this.convertLexerCommandsToAST(lexerAlt.lexerCommands()!, actionAST, adaptor);
                } else {
                    this.convertLexerElementsToAST(lexerAlt.lexerElements()!, blockAST, adaptor);
                }
            }
        });
    }

    private static convertLexerElementsToAST(lexerElements: LexerElementsContext, ast: GrammarAST,
        adaptor: GrammarASTAdaptor): void {
        lexerElements.lexerElement().forEach((lexerElement) => {
            if (lexerElement.lexerAtom()) {
                this.convertLexerAtomToAST(lexerElement.lexerAtom()!, ast, adaptor);
            } else if (lexerElement.lexerBlock()) {
                this.convertLexerBlockToAST(lexerElement.lexerBlock()!, ast, adaptor);
            } else if (lexerElement.actionBlock()) {
                this.convertActionBlockToAST(ToolANTLRParser.ACTION, lexerElement.actionBlock()!, ast);
            }
        });
    }

    private static convertElementOptionsToAST(elementOptions: ElementOptionsContext, ast: GrammarAST,
        adaptor: GrammarASTAdaptor): void {
        const options = adaptor.create(ToolANTLRParser.ELEMENT_OPTIONS, "ELEMENT_OPTIONS");
        elementOptions.elementOption().forEach((elementOption) => {
            this.convertElementOptionToAST(elementOption, options, adaptor);
        });

        ast.addChild(options);
    }

    private static convertElementOptionToAST(elementOption: ElementOptionContext, ast: GrammarAST,
        adaptor: GrammarASTAdaptor): void {
        if (elementOption.ASSIGN()) {
            const assign = adaptor.create(ANTLRv4Parser.ASSIGN, "=");
            ast.addChild(assign);
            const id = adaptor.create(ANTLRv4Parser.ID,
                elementOption.identifier()[0].getText());
            assign.addChild(id);

            if (elementOption.STRING_LITERAL()) {
                const value = adaptor.create(ANTLRv4Parser.STRING_LITERAL,
                    elementOption.STRING_LITERAL()!.getText());
                assign.addChild(value);
            } else {
                const id = adaptor.create(ANTLRv4Parser.ID,
                    elementOption.identifier()[1].getText());
                assign.addChild(id);
            }
        } else {
            ast.addChild(adaptor.create(ANTLRv4Parser.ID, elementOption.getText()));
        }
    }

    private static convertLexerCommandsToAST(lexerCommands: LexerCommandsContext, ast: GrammarAST,
        adaptor: GrammarASTAdaptor): void {
        lexerCommands.lexerCommand().forEach((lexerCommand) => {
            if (lexerCommand.lexerCommandExpr()) {
                const callAST = adaptor.create(ToolANTLRParser.LEXER_ACTION_CALL, "LEXER_ACTION_CALL");
                callAST.addChild(adaptor.create(ANTLRv4Parser.ID, lexerCommand.lexerCommandName().getText()));
                callAST.addChild(adaptor.create(ANTLRv4Parser.STRING_LITERAL,
                    lexerCommand.lexerCommandExpr()!.getText()));
            } else {
                ast.addChild(adaptor.create(ANTLRv4Parser.ID, lexerCommand.lexerCommandName().getText()));
            }
        });
    }

    private static convertTerminalDefToAST(terminalDef: TerminalDefContext, ast: GrammarAST,
        adaptor: GrammarASTAdaptor): void {
        let terminalAST: GrammarAST | undefined;
        if (terminalDef.TOKEN_REF()) {
            const token = CommonToken.fromType(ANTLRv4Parser.TOKEN_REF, terminalDef.TOKEN_REF()!.getText());
            terminalAST = new TerminalAST(token);
        } else if (terminalDef.STRING_LITERAL()) {
            const token = CommonToken.fromType(ANTLRv4Parser.STRING_LITERAL, terminalDef.STRING_LITERAL()!.getText());
            terminalAST = new TerminalAST(token);
        }

        if (terminalAST) {
            ast.addChild(terminalAST);
            this.convertElementOptionsToAST(terminalDef.elementOptions()!, ast, adaptor);
        }
    }

    private static convertRulerefToAST(ruleref: RulerefContext, ast: GrammarAST, adaptor: GrammarASTAdaptor): void {
        const ruleRefAST = adaptor.create(ANTLRv4Parser.RULE_REF, ruleref.RULE_REF().getText());
        ast.addChild(ruleRefAST);

        if (ruleref.argActionBlock()) {
            this.convertActionBlockToAST(ToolANTLRParser.ARG_ACTION, ruleref.argActionBlock()!, ruleRefAST);
        }

        if (ruleref.elementOptions()) {
            this.convertElementOptionsToAST(ruleref.elementOptions()!, ruleRefAST, adaptor);
        }
    }

    private static convertNotSetToAST(notSet: NotSetContext, ast: GrammarAST, adaptor: GrammarASTAdaptor): void {
        const notAST = new NotAST(ANTLRv4Parser.NOT);
        ast.addChild(notAST);

        if (notSet.setElement()) {
            const setAST = new SetAST(ToolANTLRParser.SET, notSet.start!, "SET");
            notAST.addChild(setAST);

            this.convertSetElementToAST(notSet.setElement()!, setAST, adaptor);
        } else if (notSet.blockSet()) {
            this.convertBlockSetToAST(notSet.blockSet()!, notAST, adaptor);
        }
    }

    private static convertSetElementToAST(setElement: SetElementContext, ast: GrammarAST,
        adaptor: GrammarASTAdaptor): void {
        if (setElement.TOKEN_REF()) {
            const terminalAST = new TerminalAST(CommonToken.fromType(ANTLRv4Parser.TOKEN_REF,
                setElement.TOKEN_REF()!.getText()));
            ast.addChild(terminalAST);

            if (setElement.elementOptions()) {
                this.convertElementOptionsToAST(setElement.elementOptions()!, terminalAST, adaptor);
            }
        } else if (setElement.STRING_LITERAL()) {
            const literalAST = new TerminalAST(CommonToken.fromType(ANTLRv4Parser.STRING_LITERAL,
                setElement.STRING_LITERAL()!.getText()));
            ast.addChild(literalAST);

            if (setElement.elementOptions()) {
                this.convertElementOptionsToAST(setElement.elementOptions()!, literalAST, adaptor);
            }
        } else if (setElement.characterRange()) {
            this.convertCharacterRangeToAST(setElement.characterRange()!, ast, adaptor);
        } else if (setElement.LEXER_CHAR_SET()) {
            const set = adaptor.create(ANTLRv4Parser.LEXER_CHAR_SET, setElement.LEXER_CHAR_SET()!.getText());
            ast.addChild(set);
        }
    }

    private static convertBlockSetToAST(blockSet: BlockSetContext, ast: GrammarAST, adaptor: GrammarASTAdaptor): void {
        const setAST = new SetAST(ToolANTLRParser.SET, blockSet.start!, "SET");
        ast.addChild(setAST);

        blockSet.setElement().forEach((setElement) => {
            this.convertSetElementToAST(setElement, setAST, adaptor);
        });
    }

    private static convertLexerAtomToAST(lexerAtom: LexerAtomContext, ast: GrammarAST,
        adaptor: GrammarASTAdaptor): void {
        if (lexerAtom.characterRange()) {
            this.convertCharacterRangeToAST(lexerAtom.characterRange()!, ast, adaptor);
        } else if (lexerAtom.terminalDef()) {
            this.convertTerminalDefToAST(lexerAtom.terminalDef()!, ast, adaptor);
        } else if (lexerAtom.notSet()) {
            this.convertNotSetToAST(lexerAtom.notSet()!, ast, adaptor);
        } else if (lexerAtom.LEXER_CHAR_SET()) {
            const set = adaptor.create(ANTLRv4Parser.LEXER_CHAR_SET, lexerAtom.LEXER_CHAR_SET()!.getText());
            ast.addChild(set);
        } else if (lexerAtom.DOT()) {
            this.convertWildcardToAST(lexerAtom.elementOptions(), ast, adaptor);
        }
    }

    private static convertCharacterRangeToAST(characterRange: CharacterRangeContext, ast: GrammarAST,
        adaptor: GrammarASTAdaptor): void {
        const range = adaptor.create(ANTLRv4Parser.RANGE, "RANGE");
        ast.addChild(range);

        characterRange.STRING_LITERAL().forEach((string) => {
            const literalAST = new TerminalAST(CommonToken.fromType(ANTLRv4Parser.STRING_LITERAL,
                string.getText()));
            range.addChild(literalAST);
        });
    }

    private static convertWildcardToAST(elementOptions: ElementOptionsContext | null, ast: GrammarAST,
        adaptor: GrammarASTAdaptor): void {
        const dotAST = new TerminalAST(CommonToken.fromType(ANTLRv4Parser.DOT, "."));
        ast.addChild(dotAST);

        if (elementOptions) {
            this.convertElementOptionsToAST(elementOptions, dotAST, adaptor);
        }
    }

    private static convertRuleActionToAST(ruleAction: RuleActionContext, ast: GrammarAST,
        adaptor: GrammarASTAdaptor): void {
        const action = adaptor.create(ANTLRv4Parser.AT, "@");
        ast.addChild(action);

        action.addChild(adaptor.create(ANTLRv4Parser.ID, ruleAction.identifier().getText()));
        this.convertActionBlockToAST(ToolANTLRParser.ACTION, ruleAction.actionBlock(), action);
    }

    private static convertAltListToAST(altList: AltListContext, ast: GrammarAST, adaptor: GrammarASTAdaptor): void {
        altList.alternative().forEach((alternative) => {
            this.convertAlternativeToAST(alternative, ast, adaptor);
        });
    }

    private static convertAlternativeToAST(alternative: AlternativeContext, ast: GrammarAST,
        adaptor: GrammarASTAdaptor): AltAST {
        const altAST = new AltAST(CommonToken.fromType(ToolANTLRParser.ALT, "ALT"));
        ast.addChild(altAST);
        if (alternative.elementOptions()) {
            this.convertElementOptionsToAST(alternative.elementOptions()!, altAST, adaptor);
        }

        if (alternative.element().length === 0) {
            // Empty alt.
            altAST.addChild(adaptor.create(ToolANTLRParser.EPSILON, "EPSILON"));
        } else {
            alternative.element().forEach((element) => {
                if (element.labeledElement()) {
                    let token;
                    if (element.labeledElement()!.ASSIGN()) {
                        token = CommonToken.fromType(ANTLRv4Parser.ASSIGN, "=");
                    } else {
                        token = CommonToken.fromType(ANTLRv4Parser.PLUS_ASSIGN, "+=");
                    }

                    const labeledELementAST = adaptor.create(token);
                    altAST.addChild(labeledELementAST);

                    const id = adaptor.create(ANTLRv4Parser.ID, element.labeledElement()!.identifier().getText());
                    labeledELementAST.addChild(id);

                    if (element.labeledElement()!.atom()) {
                        this.convertAtomToAST(element.labeledElement()!.atom()!, labeledELementAST, adaptor);
                    } else if (element.labeledElement()!.block()) {
                        this.convertBlockToAST(element.labeledElement()!.block()!, labeledELementAST, adaptor);
                    }

                    if (element.ebnfSuffix()) {
                        this.convertEbnfSuffixToAST(element.ebnfSuffix()!, labeledELementAST);
                    }
                } else if (element.atom()) {
                    this.convertAtomToAST(element.labeledElement()!.atom()!, altAST, adaptor);
                    if (element.ebnfSuffix()) {
                        this.convertEbnfSuffixToAST(element.ebnfSuffix()!, altAST);
                    }
                } else if (element.ebnf()) {
                    this.convertEbnfToAST(element.ebnf()!, altAST, adaptor);
                } else if (element.actionBlock()) {
                    const actionAST = this.convertActionBlockToAST(ToolANTLRParser.ACTION,
                        element.actionBlock()!, altAST);

                    if (element.predicateOptions()) {
                        this.convertPredicateOptionsToAST(element.predicateOptions()!, actionAST, adaptor);
                    }
                }
            });
        }

        return altAST;
    }

    private static convertLexerBlockToAST(lexerBlock: LexerBlockContext, ast: GrammarAST,
        adaptor: GrammarASTAdaptor): void {
        const blockAST = new BlockAST(CommonToken.fromType(ToolANTLRParser.BLOCK, "BLOCK"));
        ast.addChild(blockAST);

        lexerBlock.lexerAltList().lexerAlt().forEach((lexerAlt) => {
            if (lexerAlt.lexerElements()) {
                let targetAST: GrammarAST;
                if (lexerAlt.lexerCommands()) {
                    const token = CommonToken.fromType(ToolANTLRParser.LEXER_ALT_ACTION, "LEXER_ALT_ACTION");
                    const actionAST = new ActionAST(token);
                    blockAST.addChild(actionAST);
                    targetAST = actionAST;
                } else {
                    targetAST = blockAST;
                }
                this.convertLexerElementsToAST(lexerAlt.lexerElements()!, targetAST, adaptor);
            }
        });
    }
}
