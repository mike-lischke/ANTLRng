/* java2ts: keep */

/* eslint-disable jsdoc/require-returns, jsdoc/require-param */

export class CharactersDataCheckStatus {
    public readonly collision: boolean;
    public readonly notImpliedCharacters: boolean;

    public constructor(collision: boolean, notImpliedCharacters: boolean) {
        this.collision = collision;
        this.notImpliedCharacters = notImpliedCharacters;
    }
}
