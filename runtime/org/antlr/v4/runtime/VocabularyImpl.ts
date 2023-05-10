/* java2ts: keep */

/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { int, java, JavaObject } from "jree";
import { Token } from "./Token";
import { Vocabulary } from "./Vocabulary";

/**
 * This class provides a default implementation of the {@link Vocabulary}
 * interface.
 *
 * @author Sam Harwell
 */
export class VocabularyImpl extends JavaObject implements Vocabulary {
    private static readonly EMPTY_NAMES = new Array<string>();

    /**
     * Gets an empty {@link Vocabulary} instance.
     *
     * <p>
     * No literal or symbol names are assigned to token types, so
     * {@link #getDisplayName(int)} returns the numeric value for all tokens
     * except {@link Token#EOF}.</p>
     */
    // eslint-disable-next-line @typescript-eslint/member-ordering
    public static readonly EMPTY_VOCABULARY = new VocabularyImpl(VocabularyImpl.EMPTY_NAMES, VocabularyImpl.EMPTY_NAMES,
        VocabularyImpl.EMPTY_NAMES);

    private readonly literalNames: Array<string | null>;
    private readonly symbolicNames: Array<string | null>;
    private readonly displayNames: Array<string | null> | null = null;
    private readonly maxTokenType: number = 0;

    /**
     * Constructs a new instance of {@link VocabularyImpl} from the specified
     * literal and symbolic token names.
     *
     * @param literalNames The literal names assigned to tokens, or {@code null}
     * if no literal names are assigned.
     * @param symbolicNames The symbolic names assigned to tokens, or
     * {@code null} if no symbolic names are assigned.
     *
     * @see #getLiteralName(int)
     * @see #getSymbolicName(int)
     */
    public constructor(literalNames: Array<string | null> | null, symbolicNames: Array<string | null> | null);
    /**
     * Constructs a new instance of {@link VocabularyImpl} from the specified
     * literal, symbolic, and display token names.
     *
     * @param literalNames The literal names assigned to tokens, or {@code null}
     * if no literal names are assigned.
     * @param symbolicNames The symbolic names assigned to tokens, or
     * {@code null} if no symbolic names are assigned.
     * @param displayNames The display names assigned to tokens, or {@code null}
     * to use the values in {@code literalNames} and {@code symbolicNames} as
     * the source of display names, as described in
     * {@link #getDisplayName(int)}.
     *
     * @see #getLiteralName(int)
     * @see #getSymbolicName(int)
     * @see #getDisplayName(int)
     */
    public constructor(literalNames: Array<string | null> | null, symbolicNames: Array<string | null> | null,
        displayNames: Array<string | null> | null);
    public constructor(...args: unknown[]) {
        super();

        const literalNames = args[0] as Array<string | null>;
        const symbolicNames = args[1] as Array<string | null>;
        this.literalNames = literalNames ?? VocabularyImpl.EMPTY_NAMES;
        this.symbolicNames = symbolicNames ?? VocabularyImpl.EMPTY_NAMES;

        let displayNames = null;
        if (args.length > 2) {
            displayNames = args[2] as Array<string | null>;
        }
        this.displayNames = displayNames ?? VocabularyImpl.EMPTY_NAMES;

        this.maxTokenType = Math.max(this.displayNames.length,
            Math.max(this.literalNames.length, this.symbolicNames.length)) - 1;
    }

    /**
     * Returns a {@link VocabularyImpl} instance from the specified set of token
     * names. This method acts as a compatibility layer for the single
     * {@code tokenNames} array generated by previous releases of ANTLR.
     *
     * <p>The resulting vocabulary instance returns {@code null} for
     * {@link #getLiteralName(int)} and {@link #getSymbolicName(int)}, and the
     * value from {@code tokenNames} for the display names.</p>
     *
     * @param tokenNames The token names, or {@code null} if no token names are
     * available.
     * @returns A {@link Vocabulary} instance which uses {@code tokenNames} for
     * the display names of tokens.
     */
    public static fromTokenNames = (tokenNames: Array<string | null> | null): Vocabulary => {
        if (tokenNames === null || tokenNames.length === 0) {
            return VocabularyImpl.EMPTY_VOCABULARY;
        }

        const literalNames = [...tokenNames];
        const symbolicNames = [...tokenNames];
        for (let i = 0; i < tokenNames.length; i++) {
            const tokenName = tokenNames[i];
            if (tokenName === null) {
                continue;
            }

            if (tokenName.length > 0) {
                const firstChar = tokenName.codePointAt(0)!;
                if (firstChar === 0x27) { // "'"
                    symbolicNames[i] = null;
                    continue;
                } else {
                    if (java.lang.Character.isUpperCase(firstChar)) {
                        literalNames[i] = null;
                        continue;
                    }
                }
            }

            // wasn't a literal or symbolic name
            literalNames[i] = null;
            symbolicNames[i] = null;
        }

        return new VocabularyImpl(literalNames, symbolicNames, tokenNames);
    };

    public getMaxTokenType = (): number => {
        return this.maxTokenType;
    };

    public getLiteralName = (tokenType: int): string | null => {
        if (tokenType >= 0 && tokenType < this.literalNames.length) {
            return this.literalNames[tokenType];
        }

        return null;
    };

    public getSymbolicName = (tokenType: int): string | null => {
        if (tokenType >= 0 && tokenType < this.symbolicNames.length) {
            return this.symbolicNames[tokenType];
        }

        if (tokenType === Token.EOF) {
            return "EOF";
        }

        return null;
    };

    public getDisplayName = (tokenType: int): string => {
        if (this.displayNames && tokenType >= 0 && tokenType < this.displayNames.length) {
            const displayName = this.displayNames[tokenType];
            if (displayName !== null) {
                return displayName;
            }
        }

        const literalName = this.getLiteralName(tokenType);
        if (literalName !== null) {
            return literalName;
        }

        const symbolicName = this.getSymbolicName(tokenType);
        if (symbolicName !== null) {
            return symbolicName;
        }

        return java.lang.Integer.toString(tokenType).valueOf();
    };

    // Because this is an actual implementation object, we can provide access methods for vocabulary symbols

    public getLiteralNames = (): Array<string | null> => {
        return this.literalNames;
    };

    public getSymbolicNames = (): Array<string | null> => {
        return this.symbolicNames;
    };

    public getDisplayNames = (): Array<string | null> | null => {
        return this.displayNames;
    };
}
