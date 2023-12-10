/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */




import { JavaObject, java } from "jree";
import { IntegerList } from "antlr4ng";
import { junit } from "junit.ts";

type IllegalArgumentException = java.lang.IllegalArgumentException;
const IllegalArgumentException = java.lang.IllegalArgumentException;



export  class TestIntegerList extends JavaObject {
	@Test
public  emptyListToEmptyCharArray():  void {
		let  l = new  IntegerList();
		assertArrayEquals(new  Uint16Array(0), l.toCharArray());
	}

	@Test
public  negativeIntegerToCharArrayThrows():  void {
		let  l = new  IntegerList();
		l.add(-42);
		assertThrows(
				IllegalArgumentException.class,
				l.toCharArray
		);
	}

	@Test
public  surrogateRangeIntegerToCharArray():  void {
		let  l = new  IntegerList();
		// Java allows dangling surrogates, so (currently) we do
		// as well. We could change this if desired.
		l.add(0xDC00);
		let  expected =  [ 0xDC00 ];
		assertArrayEquals(expected, l.toCharArray());
	}

	@Test
public  tooLargeIntegerToCharArrayThrows():  void {
		let  l = new  IntegerList();
		l.add(0x110000);
		assertThrows(
				IllegalArgumentException.class,
				l.toCharArray
		);
	}

	@Test
public  unicodeBMPIntegerListToCharArray():  void {
		let  l = new  IntegerList();
		l.add(0x35);
		l.add(0x4E94);
		l.add(0xFF15);
		let  expected =  [ 0x35, 0x4E94, 0xFF15 ];
		assertArrayEquals(expected, l.toCharArray());
	}

	@Test
public  unicodeSMPIntegerListToCharArray():  void {
		let  l = new  IntegerList();
		l.add(0x104A5);
		l.add(0x116C5);
		l.add(0x1D7FB);
		let  expected =  [ 0xD801, 0xDCA5, 0xD805, 0xDEC5, 0xD835, 0xDFFB ];
		assertArrayEquals(expected, l.toCharArray());
	}
}
