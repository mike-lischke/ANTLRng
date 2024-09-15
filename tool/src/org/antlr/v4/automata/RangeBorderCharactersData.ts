
import { ErrorType } from "../tool/ErrorType.js";
import { Grammar } from "../tool/Grammar.js";

export class RangeBorderCharactersData {
    public readonly lowerFrom: number;
    public readonly upperFrom: number;
    public readonly lowerTo: number;
    public readonly upperTo: number;
    public readonly mixOfLowerAndUpperCharCase: boolean;

    public constructor(lowerFrom: number, upperFrom: number, lowerTo: number, upperTo: number, mixOfLowerAndUpperCharCase: boolean) {
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
            const notImpliedCharacters = new StringBuilder();
            for (let i = from; i < to; i++) {
                if (!Character.isAlphabetic(i)) {
                    notImpliedCharacters.append(Number(i));
                }
            }
            if (notImpliedCharacters.length() > 0) {
                grammar.tool.errMgr.grammarError(ErrorType.RANGE_PROBABLY_CONTAINS_NOT_IMPLIED_CHARACTERS, grammar.fileName, tree.getToken(),
                    Number(from), Number(to), notImpliedCharacters.toString());
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
