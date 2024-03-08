
/* eslint-disable jsdoc/require-returns, jsdoc/require-param */



export  class TokenInfo {
	public readonly  type:  number;
	public readonly  name:  string;

	public  constructor(type: number, name: string) {
		this.type = type;
		this.name = name;
	}

	@Override
public override  toString():  string {
		return "TokenInfo{" +
				"type=" + this.type +
				", name='" + this.name + '\'' +
				'}';
	}
}
