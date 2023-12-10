/* java2ts: keep */

export class GeneratedFile {
    public readonly name: string;
    public readonly isParser: boolean;

    public constructor(name: string, isParser: boolean) {
        this.name = name;
        this.isParser = isParser;
    }

    public toString(): string {
        return this.name + "; isParser:" + this.isParser;
    }
}
