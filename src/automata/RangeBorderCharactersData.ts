/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { Character } from "../support/Character.js";
import { ErrorManager } from "../tool/ErrorManager.js";
import { ErrorType } from "../tool/ErrorType.js";
import { Grammar } from "../tool/Grammar.js";
import type { CommonTree } from "../tree/CommonTree.js";

export class RangeBorderCharactersData {
    public readonly lowerFrom: number;
    public readonly upperFrom: number;
    public readonly lowerTo: number;
    public readonly upperTo: number;
    public readonly mixOfLowerAndUpperCharCase: boolean;

    public constructor(lowerFrom: number, upperFrom: number, lowerTo: number, upperTo: number,
        mixOfLowerAndUpperCharCase: boolean) {
        this.lowerFrom = lowerFrom;
        this.upperFrom = upperFrom;
        this.lowerTo = lowerTo;
        this.upperTo = upperTo;
        this.mixOfLowerAndUpperCharCase = mixOfLowerAndUpperCharCase;
    }

    public static getAndCheckCharactersData(from: number, to: number, grammar: Grammar, tree: CommonTree,
        reportRangeContainsNotImpliedCharacters: boolean,
    ): RangeBorderCharactersData {
        const lowerFrom = Character.toLowerCase(from);
        const upperFrom = Character.toUpperCase(from);
        const lowerTo = Character.toLowerCase(to);
        const upperTo = Character.toUpperCase(to);

        const isLowerFrom = lowerFrom === from;
        const isLowerTo = lowerTo === to;
        const mixOfLowerAndUpperCharCase = isLowerFrom && !isLowerTo || !isLowerFrom && isLowerTo;
        if (reportRangeContainsNotImpliedCharacters && mixOfLowerAndUpperCharCase && from <= 0x7F && to <= 0x7F) {
            let notImpliedCharacters = "";
            for (let i = from; i < to; i++) {
                if (!Character.isAlphabetic(i)) {
                    notImpliedCharacters += i;
                }
            }

            if (notImpliedCharacters.length > 0) {
                ErrorManager.get().grammarError(ErrorType.RANGE_PROBABLY_CONTAINS_NOT_IMPLIED_CHARACTERS,
                    grammar.fileName, tree.token!, from, to, notImpliedCharacters.toString());
            }
        }

        return new RangeBorderCharactersData(lowerFrom, upperFrom, lowerTo, upperTo, mixOfLowerAndUpperCharCase);
    }

    public isSingleRange(): boolean {
        return this.lowerFrom === this.upperFrom && this.lowerTo === this.upperTo ||
            this.mixOfLowerAndUpperCharCase ||
            this.lowerTo - this.lowerFrom !== this.upperTo - this.upperFrom;
    }
}
