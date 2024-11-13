/*
 * Copyright (c) Mike Lischke. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */

// cspell: ignore RULEMODIFIERS, ruleref

import {
    CommonToken, ParserRuleContext, type CharStream, type TerminalNode, type TokenSource, type TokenStream
} from "antlr4ng";

import {
    ANTLRv4Parser,
    type Action_Context, type AlternativeContext, type AltListContext, type AtomContext, type BlockContext,
    type BlockSetContext, type ChannelsSpecContext, type CharacterRangeContext, type DelegateGrammarsContext,
    type EbnfContext, type EbnfSuffixContext, type ElementContext, type ElementOptionContext,
    type ElementOptionsContext, type GrammarSpecContext, type LabeledElementContext, type LexerAltContext,
    type LexerAtomContext, type LexerBlockContext, type LexerCommandContext, type LexerCommandsContext,
    type LexerElementContext, type LexerElementsContext, type LexerRuleBlockContext, type LexerRuleSpecContext,
    type ModeSpecContext, type NotSetContext, type OptionsSpecContext, type ParserRuleSpecContext,
    type PredicateOptionsContext, type PrequelConstructContext, type RuleActionContext, type RuleBlockContext,
    type RulerefContext, type RulesContext, type RuleSpecContext,
    type SetElementContext, type TerminalDefContext, type TokensSpecContext
} from "../generated/ANTLRv4Parser.js";

import { Constants } from "../Constants1.js";
import { ANTLRv4Lexer } from "../generated/ANTLRv4Lexer.js";
import type { Constructor } from "../misc/Utils.js";
import { ActionAST } from "../tool/ast/ActionAST.js";
import { AltAST } from "../tool/ast/AltAST.js";
import { BlockAST } from "../tool/ast/BlockAST.js";
import { GrammarAST } from "../tool/ast/GrammarAST.js";
import { GrammarRootAST } from "../tool/ast/GrammarRootAST.js";
import { NotAST } from "../tool/ast/NotAST.js";
import { OptionalBlockAST } from "../tool/ast/OptionalBlockAST.js";
import { PlusBlockAST } from "../tool/ast/PlusBlockAST.js";
import { RuleAST } from "../tool/ast/RuleAST.js";
import { SetAST } from "../tool/ast/SetAST.js";
import { StarBlockAST } from "../tool/ast/StarBlockAST.js";
import { TerminalAST } from "../tool/ast/TerminalAST.js";
import { GrammarType } from "./GrammarType.js";

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
        const token = this.createToken(ANTLRv4Parser.GRAMMAR, grammarSpec);
        const root = new GrammarRootAST(ANTLRv4Parser.GRAMMAR, token, name, tokens);
        root.grammarType = type;
        const grammarName = grammarSpec.grammarDecl().identifier();
        root.addChild(this.createASTNode(ANTLRv4Parser.ID, grammarName));

        this.convertPrequelConstructToAST(grammarSpec.prequelConstruct(), root);
        this.convertRulesToAST(grammarSpec.rules(), root);
        this.convertModeSpecToAST(grammarSpec.modeSpec(), root);

        return root;
    }

    public static convertRuleSpecToAST(rule: RuleSpecContext, ast: GrammarAST): void {
        if (rule.parserRuleSpec()) {
            const parserRule = rule.parserRuleSpec()!;
            const ruleAST = this.createVirtualASTNode(RuleAST, ANTLRv4Lexer.RULE, rule);
            ast.addChild(ruleAST);

            ruleAST.addChild(this.createASTNode(ANTLRv4Parser.RULE_REF, parserRule.RULE_REF()));
            if (parserRule.argActionBlock()) {
                this.convertActionBlockToAST(ANTLRv4Lexer.ARG_ACTION, parserRule.argActionBlock()!, ruleAST);
            }

            if (parserRule.ruleReturns()) {
                const returnsAST = this.createASTNode(ANTLRv4Parser.RETURNS, parserRule.ruleReturns()!);
                this.convertActionBlockToAST(ANTLRv4Lexer.ARG_ACTION, parserRule.ruleReturns()!, returnsAST);

                ruleAST.addChild(returnsAST);
            }

            if (parserRule.throwsSpec()) {
                const throwsAST = this.createASTNode(ANTLRv4Parser.THROWS, parserRule.throwsSpec()!);
                parserRule.throwsSpec()!.identifier().forEach((id) => {
                    throwsAST.addChild(this.createASTNode(ANTLRv4Parser.ID, id));
                });

                ruleAST.addChild(throwsAST);
            }

            if (parserRule.localsSpec()) {
                const localsAST = this.createASTNode(ANTLRv4Parser.LOCALS, parserRule.localsSpec()!);
                this.convertActionBlockToAST(ANTLRv4Lexer.ARG_ACTION, parserRule.localsSpec()!, localsAST);

                ruleAST.addChild(localsAST);
            }

            parserRule.rulePrequel().forEach((prequel) => {
                if (prequel.optionsSpec()) {
                    this.convertOptionsSpecToAST(prequel.optionsSpec()!, ruleAST);
                } else if (prequel.ruleAction()) {
                    const action = this.createASTNode(ANTLRv4Parser.AT, prequel.ruleAction()!.AT());
                    ruleAST.addChild(action);
                    action.addChild(this.createASTNode(ANTLRv4Parser.ID, prequel.ruleAction()!.identifier()));
                    this.convertActionBlockToAST(ANTLRv4Lexer.ACTION, prequel.ruleAction()!, action);
                }
            });

            this.convertRuleBlockToAST(parserRule.ruleBlock(), ruleAST);

            parserRule.exceptionGroup().exceptionHandler().forEach((exceptionHandler) => {
                const exception = this.createASTNode(exceptionHandler.CATCH().symbol.type, exceptionHandler.CATCH());
                ruleAST.addChild(exception);

                const actionBlock = this.createASTNode(ANTLRv4Parser.ARG_ACTION, exceptionHandler.argActionBlock());
                exception.addChild(actionBlock);
            });

            if (parserRule.exceptionGroup().finallyClause()) {
                const finallyAST = new BlockAST(this.createToken(ANTLRv4Lexer.FINALLY,
                    parserRule.exceptionGroup().finallyClause()!));
                ruleAST.addChild(finallyAST);
                this.convertActionBlockToAST(ANTLRv4Lexer.ACTION,
                    parserRule.exceptionGroup().finallyClause()!.actionBlock(), finallyAST);
            }
        } else if (rule.lexerRuleSpec()) {
            this.convertLexerRuleSpecToAST(rule.lexerRuleSpec()!, ast);
        }
    }

    private static convertRuleBlockToAST(ruleBlock: RuleBlockContext, ast: GrammarAST): void {
        const colon = (ruleBlock.parent as ParserRuleSpecContext).COLON();
        const blockAST = this.createVirtualASTNode(BlockAST, ANTLRv4Lexer.BLOCK, colon, "BLOCK");
        ast.addChild(blockAST);

        ruleBlock.ruleAltList().labeledAlt().forEach((labeledAlt) => {
            // labeledAlt.alternative is rooted at an AltAST node.
            const altAST = this.convertAlternativeToAST(labeledAlt.alternative(), blockAST);

            if (altAST && labeledAlt.POUND()) {
                const id = this.createASTNode(ANTLRv4Parser.ID, labeledAlt.identifier()!);
                altAST.altLabel = id;
            }
        });

    }

    /**
     * Must be public as we need it in LeftRecursiveRuleTransformer.
     *
     * @param ruleref The rule reference context.
     * @param ast The parent AST node.
     */
    private static convertRulerefToAST(ruleref: RulerefContext, ast: GrammarAST): void {
        const ruleRefAST = this.createASTNode(ANTLRv4Parser.RULE_REF, ruleref.RULE_REF());
        ast.addChild(ruleRefAST);

        if (ruleref.argActionBlock()) {
            this.convertActionBlockToAST(ANTLRv4Lexer.ARG_ACTION, ruleref.argActionBlock()!, ruleRefAST);
        }

        if (ruleref.elementOptions()) {
            this.convertElementOptionsToAST(ruleref.elementOptions()!, ruleRefAST);
        }
    }

    private static convertPrequelConstructToAST(prequelConstruct: PrequelConstructContext[], ast: GrammarAST): void {
        prequelConstruct.forEach((prequel) => {
            if (prequel.optionsSpec()) {
                this.convertOptionsSpecToAST(prequel.optionsSpec()!, ast);
            } else if (prequel.delegateGrammars()) {
                this.convertDelegateGrammarsToAST(prequel.delegateGrammars()!, ast);
            } else if (prequel.tokensSpec()) {
                this.convertTokensSpec(prequel.tokensSpec()!, ast);
            } else if (prequel.channelsSpec()) {
                this.convertChannelsSpecToAST(prequel.channelsSpec()!, ast);
            } else if (prequel.action_()) {
                this.convertActionRuleToAST(prequel.action_()!, ast);
            }
        });
    }

    private static convertRulesToAST(rules: RulesContext, ast: GrammarAST): void {
        const rulesRoot = this.createASTNode(ANTLRv4Lexer.RULES, rules);
        ast.addChild(rulesRoot);
        rules.ruleSpec().forEach((rule) => {
            this.convertRuleSpecToAST(rule, rulesRoot);
        });
    }

    private static convertModeSpecToAST(modeSpecs: ModeSpecContext[], ast: GrammarAST): void {
        if (modeSpecs.length > 0) {
            const mode = this.createASTNode(ANTLRv4Parser.MODE, modeSpecs[0].parent!);
            ast.addChild(mode);
            modeSpecs.forEach((modeSpec) => {
                const id = this.createASTNode(ANTLRv4Parser.ID, modeSpec.identifier());
                mode.addChild(id);
                modeSpec.lexerRuleSpec().forEach((lexerRule) => {
                    this.convertLexerRuleSpecToAST(lexerRule, mode);
                });
            });
        }
    }

    private static convertOptionsSpecToAST(optionsSpec: OptionsSpecContext, ast: GrammarAST): void {
        const options = this.createVirtualASTNode(GrammarAST, ANTLRv4Parser.OPTIONS, optionsSpec.OPTIONS(), "OPTIONS");
        ast.addChild(options);
        optionsSpec.option().forEach((option) => {
            const assign = this.createASTNode(ANTLRv4Parser.ASSIGN, option);
            options.addChild(assign);
            const id = this.createASTNode(ANTLRv4Parser.ID, option.identifier());
            assign.addChild(id);
            const value = this.createASTNode(ANTLRv4Parser.STRING_LITERAL, option.optionValue());
            assign.addChild(value);
        });

    }

    private static convertDelegateGrammarsToAST(delegateGrammars: DelegateGrammarsContext, ast: GrammarAST): void {
        const delegate = this.createASTNode(ANTLRv4Parser.IMPORT, delegateGrammars);
        ast.addChild(delegate);
        delegateGrammars.delegateGrammar().forEach((dg) => {
            if (dg.ASSIGN()) {
                const assign = this.createASTNode(ANTLRv4Parser.ASSIGN, dg.ASSIGN()!);
                delegate.addChild(assign);

                assign.addChild(this.createASTNode(ANTLRv4Parser.ID, dg.identifier()[0]));
                assign.addChild(this.createASTNode(ANTLRv4Parser.ID, dg.identifier()[1]));
            } else {
                const id = this.createASTNode(ANTLRv4Parser.ID, dg.identifier()[0]);
                delegate.addChild(id);
            }
        });
    }

    private static convertTokensSpec(tokensSpec: TokensSpecContext, ast: GrammarAST): void {
        if (tokensSpec.idList()) {
            const tokens = this.createASTNode(ANTLRv4Parser.TOKENS, tokensSpec);
            ast.addChild(tokens);

            tokensSpec.idList()!.identifier().forEach((id) => {
                tokens.addChild(this.createASTNode(ANTLRv4Parser.ID, id));
            });
        }

    }

    private static convertChannelsSpecToAST(channelsSpec: ChannelsSpecContext, ast: GrammarAST): void {
        if (channelsSpec.idList()) {
            const channels = this.createASTNode(ANTLRv4Parser.CHANNELS, channelsSpec);
            ast.addChild(channels);
            channelsSpec.idList()!.identifier().forEach((id) => {
                channels.addChild(this.createASTNode(ANTLRv4Parser.ID, id));
            });
        }
    }

    private static convertActionRuleToAST(actionRule: Action_Context, ast: GrammarAST): void {
        const action = this.createASTNode(ANTLRv4Parser.AT, actionRule);
        ast.addChild(action);

        if (actionRule.actionScopeName()) {
            action.addChild(this.createASTNode(ANTLRv4Parser.ID, actionRule.actionScopeName()!));
        }
        action.addChild(this.createASTNode(ANTLRv4Parser.ID, actionRule.identifier()));
        this.convertActionBlockToAST(ANTLRv4Lexer.ACTION, actionRule.actionBlock(), action);
    }

    private static convertAtomToAST(atom: AtomContext, ast: GrammarAST): void {
        if (atom.terminalDef()) {
            this.convertTerminalDefToAST(atom.terminalDef()!, ast);
        } else if (atom.ruleref()) {
            this.convertRulerefToAST(atom.ruleref()!, ast);
        } else if (atom.notSet()) {
            this.convertNotSetToAST(atom.notSet()!, ast);
        } else if (atom.DOT()) {
            this.convertWildcardToAST(atom.DOT()!, atom.elementOptions(), ast);
        }
    }

    private static convertBlockToAST(block: BlockContext, ast: GrammarAST): void {
        const blockAST = new BlockAST(ANTLRv4Parser.BLOCK, block.LPAREN().symbol, "BLOCK");
        ast.addChild(blockAST);

        if (block.optionsSpec()) {
            this.convertOptionsSpecToAST(block.optionsSpec()!, blockAST);
        }

        block.ruleAction().forEach((ruleAction) => {
            this.convertRuleActionToAST(ruleAction, blockAST);
        });

        this.convertAltListToAST(block.altList(), blockAST);
    }

    private static convertEbnfSuffixToAST(ebnfSuffix: EbnfSuffixContext, ast: GrammarAST): GrammarAST | undefined {
        let blockAST;
        if (ebnfSuffix.QUESTION().length > 0) {
            blockAST = new OptionalBlockAST(ANTLRv4Lexer.OPTIONAL, this.createToken(ANTLRv4Lexer.OPTIONAL, ebnfSuffix),
                ebnfSuffix.QUESTION().length === 1);
        } else if (ebnfSuffix.STAR()) {
            blockAST = new StarBlockAST(ANTLRv4Parser.CLOSURE, this.createToken(ANTLRv4Parser.STAR, ebnfSuffix),
                ebnfSuffix.QUESTION().length === 0);
        } else if (ebnfSuffix.PLUS()) {
            blockAST = new PlusBlockAST(ANTLRv4Parser.POSITIVE_CLOSURE,
                this.createToken(ANTLRv4Parser.PLUS, ebnfSuffix), ebnfSuffix.QUESTION().length === 0);
        }

        ast.addChild(blockAST);

        return blockAST;
    }

    private static convertEbnfToAST(ebnf: EbnfContext, ast: GrammarAST): void {
        if (ebnf.blockSuffix()) {
            const root = this.convertEbnfSuffixToAST(ebnf.blockSuffix()!.ebnfSuffix(), ast);
            if (root) {
                this.convertBlockToAST(ebnf.block(), root);
            }
        } else {
            this.convertBlockToAST(ebnf.block(), ast);
        }
    }

    private static convertActionBlockToAST(astType: number, actionBlock: ParserRuleContext,
        ast: GrammarAST): ActionAST {
        const token = this.createToken(astType, actionBlock);
        const actionAST = new ActionAST(token);
        ast.addChild(actionAST);

        return actionAST;
    }

    private static convertPredicateOptionsToAST(options: PredicateOptionsContext, ast: GrammarAST): void {
        const predicateOptions = this.createASTNode(ANTLRv4Lexer.PREDICATE_OPTIONS, options);
        ast.addChild(predicateOptions);

        options.predicateOption().forEach((option) => {
            if (option.elementOption()) {
                this.convertElementOptionToAST(option.elementOption()!, predicateOptions);
            } else {
                const assign = this.createASTNode(ANTLRv4Parser.ASSIGN, option);
                ast.addChild(assign);
                const id = this.createASTNode(ANTLRv4Parser.ID, option.identifier()!);
                assign.addChild(id);

                this.convertActionBlockToAST(ANTLRv4Lexer.ACTION, option.actionBlock()!, assign);
            }
        });
    }

    private static convertLexerRuleSpecToAST(lexerRule: LexerRuleSpecContext, ast: GrammarAST): void {
        const ruleAST = this.createVirtualASTNode(RuleAST, ANTLRv4Lexer.RULE, lexerRule);
        ast.addChild(ruleAST);
        ruleAST.addChild(this.createASTNode(ANTLRv4Parser.TOKEN_REF, lexerRule.TOKEN_REF()));

        if (lexerRule.FRAGMENT()) {
            const ruleModifiers = this.createASTNode(ANTLRv4Lexer.RULEMODIFIERS, lexerRule.FRAGMENT()!);
            ruleAST.addChild(ruleModifiers);

            ruleModifiers.addChild(this.createASTNode(ANTLRv4Parser.FRAGMENT, lexerRule.FRAGMENT()!));
        }

        if (lexerRule.optionsSpec()) {
            this.convertOptionsSpecToAST(lexerRule.optionsSpec()!, ruleAST);
        }

        this.convertLexerRuleBlockToAST(lexerRule.lexerRuleBlock(), ruleAST);
    }

    private static convertLexerRuleBlockToAST(lexerRuleBlock: LexerRuleBlockContext, ast: GrammarAST): void {
        const colon = (lexerRuleBlock.parent as LexerRuleSpecContext).COLON();
        const blockAST = this.createVirtualASTNode(BlockAST, ANTLRv4Lexer.BLOCK, colon, "BLOCK");
        ast.addChild(blockAST);

        lexerRuleBlock.lexerAltList().lexerAlt().forEach((lexerAlt) => {
            this.convertLexerAltToAST(lexerAlt, blockAST);
        });
    }

    private static convertLexerAltToAST(lexerAlt: LexerAltContext, ast: GrammarAST): void {
        if (lexerAlt.lexerElements()) {
            if (lexerAlt.lexerCommands()) {
                const altAST = this.createVirtualASTNode(AltAST, ANTLRv4Lexer.LEXER_ALT_ACTION,
                    lexerAlt.lexerCommands()!);
                ast.addChild(altAST);

                this.convertLexerElementsToAST(lexerAlt.lexerElements()!, altAST);
                this.convertLexerCommandsToAST(lexerAlt.lexerCommands()!, altAST);
            } else {
                this.convertLexerElementsToAST(lexerAlt.lexerElements()!, ast);
            }
        }
    }

    private static convertLexerElementsToAST(lexerElements: LexerElementsContext, ast: GrammarAST): void {
        const altAST = this.createVirtualASTNode(AltAST, ANTLRv4Lexer.ALT, lexerElements);
        ast.addChild(altAST);

        if (lexerElements.lexerElement.length === 0) {
            // Empty alt.
            altAST.addChild(this.createASTNode(ANTLRv4Lexer.EPSILON, lexerElements));
        } else {
            lexerElements.lexerElement().forEach((lexerElement) => {
                this.convertLexerElementToAST(lexerElement, altAST);
            });
        }
    }

    private static convertLexerElementToAST(lexerElement: LexerElementContext, ast: GrammarAST): void {
        if (lexerElement.lexerAtom()) {
            if (lexerElement.ebnfSuffix()) {
                const ebnfSuffixAST = this.convertEbnfSuffixToAST(lexerElement.ebnfSuffix()!, ast);
                if (ebnfSuffixAST) {
                    const blockAST = this.createVirtualASTNode(BlockAST, ANTLRv4Parser.BLOCK, lexerElement.lexerAtom()!,
                        "BLOCK");
                    ebnfSuffixAST.addChild(blockAST);
                    const altAST = this.createVirtualASTNode(AltAST, ANTLRv4Lexer.ALT, lexerElement.lexerAtom()!);
                    blockAST.addChild(altAST);
                    this.convertLexerAtomToAST(lexerElement.lexerAtom()!, altAST);
                }
            } else {
                this.convertLexerAtomToAST(lexerElement.lexerAtom()!, ast);
            }
        } else if (lexerElement.lexerBlock()) {
            if (lexerElement.ebnfSuffix()) {
                const ebnfSuffixAST = this.convertEbnfSuffixToAST(lexerElement.ebnfSuffix()!, ast);
                if (ebnfSuffixAST) {
                    this.convertLexerBlockToAST(lexerElement.lexerBlock()!, ebnfSuffixAST);
                }
            } else {
                this.convertLexerBlockToAST(lexerElement.lexerBlock()!, ast);
            }
        } else if (lexerElement.actionBlock()) {
            this.convertActionBlockToAST(ANTLRv4Lexer.ACTION, lexerElement.actionBlock()!, ast);
        }
    }

    private static convertElementOptionsToAST(elementOptions: ElementOptionsContext, ast: GrammarAST): void {
        const options = this.createASTNode(ANTLRv4Lexer.ELEMENT_OPTIONS, elementOptions);
        elementOptions.elementOption().forEach((elementOption) => {
            this.convertElementOptionToAST(elementOption, options);
        });

        ast.addChild(options);
    }

    private static convertElementOptionToAST(elementOption: ElementOptionContext, ast: GrammarAST): void {
        if (elementOption.ASSIGN()) {
            const assign = this.createASTNode(ANTLRv4Parser.ASSIGN, elementOption.ASSIGN()!);
            ast.addChild(assign);
            const id = this.createASTNode(ANTLRv4Parser.ID, elementOption.identifier()[0]);
            assign.addChild(id);

            if (elementOption.STRING_LITERAL()) {
                const value = this.createASTNode(ANTLRv4Parser.STRING_LITERAL, elementOption.STRING_LITERAL()!);
                assign.addChild(value);
            } else {
                const id = this.createASTNode(ANTLRv4Parser.ID, elementOption.identifier()[1]);
                assign.addChild(id);
            }
        } else {
            ast.addChild(this.createASTNode(ANTLRv4Parser.ID, elementOption));
        }
    }

    private static convertLexerCommandsToAST(lexerCommands: LexerCommandsContext, ast: GrammarAST): void {
        lexerCommands.lexerCommand().forEach((lexerCommand) => {
            this.convertLexerCommandToAST(lexerCommand, ast);
        });
    }

    private static convertLexerCommandToAST(lexerCommand: LexerCommandContext, ast: GrammarAST): void {
        if (lexerCommand.lexerCommandExpr()) {
            const callAST = this.createASTNode(ANTLRv4Lexer.LEXER_ACTION_CALL, lexerCommand);
            callAST.addChild(this.createASTNode(ANTLRv4Parser.ID, lexerCommand.lexerCommandName()));
            callAST.addChild(this.createASTNode(ANTLRv4Parser.STRING_LITERAL, lexerCommand.lexerCommandExpr()!));
        } else {
            ast.addChild(this.createASTNode(ANTLRv4Parser.ID, lexerCommand.lexerCommandName()));
        }
    }

    private static convertTerminalDefToAST(terminalDef: TerminalDefContext, ast: GrammarAST): void {
        let terminalAST: GrammarAST | undefined;
        if (terminalDef.TOKEN_REF()) {
            const token = this.createToken(ANTLRv4Parser.TOKEN_REF, terminalDef.TOKEN_REF()!);
            terminalAST = new TerminalAST(token);
        } else if (terminalDef.STRING_LITERAL()) {
            const token = this.createToken(ANTLRv4Parser.STRING_LITERAL, terminalDef.STRING_LITERAL()!);
            terminalAST = new TerminalAST(token);
        }

        if (terminalAST) {
            ast.addChild(terminalAST);

            if (terminalDef.elementOptions()) {
                this.convertElementOptionsToAST(terminalDef.elementOptions()!, ast);
            }
        }
    }

    private static convertNotSetToAST(notSet: NotSetContext, ast: GrammarAST,): void {
        const notAST = new NotAST(ANTLRv4Parser.NOT);
        ast.addChild(notAST);

        if (notSet.setElement()) {
            const setAST = new SetAST(ANTLRv4Lexer.SET, notSet.start!, "SET");
            notAST.addChild(setAST);

            this.convertSetElementToAST(notSet.setElement()!, setAST);
        } else if (notSet.blockSet()) {
            this.convertBlockSetToAST(notSet.blockSet()!, notAST);
        }
    }

    private static convertSetElementToAST(setElement: SetElementContext, ast: GrammarAST): void {
        if (setElement.TOKEN_REF()) {
            const terminalAST = new TerminalAST(this.createToken(ANTLRv4Parser.TOKEN_REF, setElement.TOKEN_REF()!));
            ast.addChild(terminalAST);

            if (setElement.elementOptions()) {
                this.convertElementOptionsToAST(setElement.elementOptions()!, terminalAST);
            }
        } else if (setElement.STRING_LITERAL()) {
            const literalAST = new TerminalAST(this.createToken(ANTLRv4Parser.STRING_LITERAL,
                setElement.STRING_LITERAL()!));
            ast.addChild(literalAST);

            if (setElement.elementOptions()) {
                this.convertElementOptionsToAST(setElement.elementOptions()!, literalAST);
            }
        } else if (setElement.characterRange()) {
            this.convertCharacterRangeToAST(setElement.characterRange()!, ast);
        } else if (setElement.LEXER_CHAR_SET()) {
            const set = this.createASTNode(ANTLRv4Parser.LEXER_CHAR_SET, setElement.LEXER_CHAR_SET()!);
            ast.addChild(set);
        }
    }

    private static convertBlockSetToAST(blockSet: BlockSetContext, ast: GrammarAST): void {
        const setAST = new SetAST(ANTLRv4Lexer.SET, blockSet.start!, "SET");
        ast.addChild(setAST);

        blockSet.setElement().forEach((setElement) => {
            this.convertSetElementToAST(setElement, setAST);
        });
    }

    private static convertLexerAtomToAST(lexerAtom: LexerAtomContext, ast: GrammarAST): void {
        if (lexerAtom.characterRange()) {
            this.convertCharacterRangeToAST(lexerAtom.characterRange()!, ast);
        } else if (lexerAtom.terminalDef()) {
            this.convertTerminalDefToAST(lexerAtom.terminalDef()!, ast);
        } else if (lexerAtom.notSet()) {
            this.convertNotSetToAST(lexerAtom.notSet()!, ast);
        } else if (lexerAtom.LEXER_CHAR_SET()) {
            const set = this.createASTNode(ANTLRv4Parser.LEXER_CHAR_SET, lexerAtom.LEXER_CHAR_SET()!);
            ast.addChild(set);
        } else if (lexerAtom.DOT()) {
            this.convertWildcardToAST(lexerAtom.DOT()!, lexerAtom.elementOptions(), ast);
        }
    }

    private static convertCharacterRangeToAST(characterRange: CharacterRangeContext, ast: GrammarAST): void {
        const range = this.createASTNode(ANTLRv4Parser.RANGE, characterRange);
        ast.addChild(range);

        characterRange.STRING_LITERAL().forEach((string) => {
            const literalAST = new TerminalAST(this.createToken(ANTLRv4Parser.STRING_LITERAL, string));
            range.addChild(literalAST);
        });
    }

    private static convertWildcardToAST(dot: TerminalNode, elementOptions: ElementOptionsContext | null,
        ast: GrammarAST): void {
        const dotAST = new TerminalAST(this.createToken(ANTLRv4Parser.DOT, dot));
        ast.addChild(dotAST);

        if (elementOptions) {
            this.convertElementOptionsToAST(elementOptions, dotAST);
        }
    }

    private static convertRuleActionToAST(ruleAction: RuleActionContext, ast: GrammarAST): void {
        const action = this.createASTNode(ANTLRv4Parser.AT, ruleAction.AT());
        ast.addChild(action);

        action.addChild(this.createASTNode(ANTLRv4Parser.ID, ruleAction.identifier()));
        this.convertActionBlockToAST(ANTLRv4Lexer.ACTION, ruleAction.actionBlock(), action);
    }

    private static convertAltListToAST(altList: AltListContext, ast: GrammarAST): void {
        altList.alternative().forEach((alternative) => {
            this.convertAlternativeToAST(alternative, ast);
        });
    }

    private static convertAlternativeToAST(alternative: AlternativeContext, ast: GrammarAST): AltAST | undefined {
        const altAST = this.createVirtualASTNode(AltAST, ANTLRv4Lexer.ALT, alternative);
        ast.addChild(altAST);

        if (alternative.elementOptions()) {
            this.convertElementOptionsToAST(alternative.elementOptions()!, altAST);

            return altAST;
        }

        if (alternative.element().length === 0) {
            // Empty alt.
            altAST.addChild(this.createASTNode(ANTLRv4Lexer.EPSILON, alternative));
        } else {
            alternative.element().forEach((element) => {
                this.convertElementToAST(element, altAST);

            });
        }

        return altAST;
    }

    private static convertElementToAST(element: ElementContext, ast: GrammarAST): void {
        if (element.labeledElement()) {
            if (element.ebnfSuffix()) {
                const ebnfAST = this.convertEbnfSuffixToAST(element.ebnfSuffix()!, ast);
                if (ebnfAST) {
                    const blockAST = this.createVirtualASTNode(BlockAST, ANTLRv4Lexer.BLOCK, element.labeledElement()!,
                        "BLOCK");
                    ebnfAST.addChild(blockAST);

                    const altAST = this.createVirtualASTNode(AltAST, ANTLRv4Lexer.ALT, element.labeledElement()!);
                    blockAST.addChild(altAST);
                    this.convertLabeledElementToAST(element.labeledElement()!, altAST);
                }
            } else {
                this.convertLabeledElementToAST(element.labeledElement()!, ast);
            }
        } else if (element.atom()) {
            if (element.ebnfSuffix()) {
                const ebnfAST = this.convertEbnfSuffixToAST(element.ebnfSuffix()!, ast);
                if (ebnfAST) {
                    const blockAST = this.createVirtualASTNode(BlockAST, ANTLRv4Lexer.BLOCK, element.atom()!, "BLOCK");
                    ebnfAST.addChild(blockAST);

                    const altAST = this.createVirtualASTNode(AltAST, ANTLRv4Lexer.ALT, element.atom()!);
                    blockAST.addChild(altAST);
                    this.convertAtomToAST(element.atom()!, altAST);
                }
            } else {
                this.convertAtomToAST(element.atom()!, ast);
            }
        } else if (element.ebnf()) {
            this.convertEbnfToAST(element.ebnf()!, ast);
        } else if (element.actionBlock()) {
            const actionAST = this.convertActionBlockToAST(ANTLRv4Lexer.ACTION, element.actionBlock()!, ast);

            if (element.predicateOptions()) {
                this.convertPredicateOptionsToAST(element.predicateOptions()!, actionAST);
            }
        }
    }

    private static convertLabeledElementToAST(labeledElement: LabeledElementContext, ast: GrammarAST): void {
        let root;
        if (labeledElement.ASSIGN()) {
            root = this.createASTNode(ANTLRv4Parser.ASSIGN, labeledElement.ASSIGN()!);
        } else {
            root = this.createASTNode(ANTLRv4Parser.PLUS_ASSIGN, labeledElement.PLUS_ASSIGN()!);
        }
        ast.addChild(root);

        const id = this.createASTNode(ANTLRv4Parser.ID, labeledElement.identifier());
        root.addChild(id);

        // The label is the actual start of the element, so its start index the parent's start index.
        root.startIndex = id.startIndex;

        if (labeledElement.atom()) {
            this.convertAtomToAST(labeledElement.atom()!, root);
        } else if (labeledElement.block()) {
            this.convertBlockToAST(labeledElement.block()!, root);
        }
    }

    private static convertLexerBlockToAST(lexerBlock: LexerBlockContext, ast: GrammarAST): void {
        const blockAST = this.createVirtualASTNode(BlockAST, ANTLRv4Lexer.BLOCK, lexerBlock.LPAREN(), "BLOCK");
        ast.addChild(blockAST);

        lexerBlock.lexerAltList().lexerAlt().forEach((lexerAlt) => {
            if (lexerAlt.lexerElements()) {
                let targetAST: GrammarAST;
                if (lexerAlt.lexerCommands()) {
                    const altAST = this.createVirtualASTNode(AltAST, ANTLRv4Lexer.LEXER_ALT_ACTION,
                        lexerAlt.lexerCommands()!, "ALT");
                    blockAST.addChild(altAST);
                    targetAST = altAST;
                } else {
                    targetAST = blockAST;
                }
                this.convertLexerElementsToAST(lexerAlt.lexerElements()!, targetAST);
            }
        });
    }

    private static createToken(type: number, context: ParserRuleContext | TerminalNode): CommonToken {
        if (context instanceof ParserRuleContext) {
            const token = CommonToken.fromSource([context.start!.tokenSource, context.start!.inputStream], type,
                Constants.DEFAULT_TOKEN_CHANNEL, context.start!.start, context.start!.stop);
            token.tokenIndex = context.start!.tokenIndex;

            return token;
        }

        const symbol = context.symbol;

        const token = CommonToken.fromSource([symbol.tokenSource, symbol.inputStream], type,
            Constants.DEFAULT_TOKEN_CHANNEL, symbol.start, symbol.stop);
        token.tokenIndex = symbol.tokenIndex;

        return token;
    }

    private static createASTNode(astType: number, context: ParserRuleContext | TerminalNode): GrammarAST {
        const token = this.createToken(astType, context);

        // The token determines the payload of the AST node as well as the start token index.
        const ast = new GrammarAST(token);

        // Set also the stop token index, if available.
        if (context instanceof ParserRuleContext) {
            ast.stopIndex = context.stop!.tokenIndex;
        }

        return ast;
    }

    private static createVirtualASTNode<T extends GrammarAST>(c: Constructor<T>, astType: number,
        ref: ParserRuleContext | TerminalNode, text?: string): T {

        const sourceToken = ref instanceof ParserRuleContext ? ref.start! : ref.symbol;
        const source: [TokenSource | null, CharStream | null] = [sourceToken.tokenSource, sourceToken.inputStream];
        const token = CommonToken.fromSource(source, astType, Constants.DEFAULT_TOKEN_CHANNEL, sourceToken.start,
            sourceToken.stop);

        if (text) {
            token.text = text;
        }

        token.tokenIndex = sourceToken.tokenIndex;

        const ast = new c(token);

        if (ref instanceof ParserRuleContext) {
            ast.stopIndex = ref.stop!.tokenIndex;
        }

        return ast;
    }
}
