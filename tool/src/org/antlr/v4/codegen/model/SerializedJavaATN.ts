
/* eslint-disable jsdoc/require-returns, jsdoc/require-param */


import { SerializedATN } from "./SerializedATN.js";
import { OutputModelObject } from "./OutputModelObject.js";
import { OutputModelFactory } from "../OutputModelFactory.js";
import { Target } from "../Target.js";
import { ATN, ATNDeserializer, ATNSerializer, IntegerList } from "antlr4ng";



/** A serialized ATN for the java target, which requires we use strings and 16-bit unicode values */
export  class SerializedJavaATN extends SerializedATN {
	private readonly  serializedAsString:  string[];
	private readonly  segments:  string[][];

	public  constructor(factory: OutputModelFactory, atn: ATN) {
		super(factory);
		let  data = ATNSerializer.getSerialized(atn);
		data = ATNDeserializer.encodeIntsWith16BitWords(data);

		let  size = data.size();
		let  target = factory.getGenerator().getTarget();
		let  segmentLimit = target.getSerializedATNSegmentLimit();
		this.segments = new  Array<string>(Number(((size as bigint + segmentLimit - 1) / segmentLimit)))[];
		let  segmentIndex = 0;

		for (let  i = 0; i < size; i += segmentLimit) {
			let  segmentSize = Math.min(i + segmentLimit, size) - i;
			let  segment = new  Array<string>(segmentSize);
			this.segments[segmentIndex++] = segment;
			for (let  j = 0; j < segmentSize; j++) {
				segment[j] = target.encodeInt16AsCharEscape(data.get(i + j));
			}
		}

		this.serializedAsString = this.segments[0]; // serializedAsString is valid if only one segment
	}

	public override  getSerialized():  Object { return this.serializedAsString; }
	public  getSegments():  string[][] { return this.segments; }
}
