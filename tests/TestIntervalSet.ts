/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */


/* eslint-disable jsdoc/require-returns, jsdoc/require-param */


import { Lexer, Token, IntervalSet } from "antlr4ng";



export  class TestIntervalSet {

    /** Public default constructor used by TestRig */
    public  constructor() {
	}

	@Test
public  testSingleElement():  void {
		let  s = IntervalSet.of(99);
		let  expecting = "99";
		assertEquals(s.toString(), expecting);
	}

	@Test
public  testMin():  void {
		assertEquals(0, IntervalSet.COMPLETE_CHAR_SET.getMinElement());
		assertEquals(Token.EPSILON, IntervalSet.COMPLETE_CHAR_SET.or(IntervalSet.of(Token.EPSILON)).getMinElement());
		assertEquals(Token.EOF, IntervalSet.COMPLETE_CHAR_SET.or(IntervalSet.of(Token.EOF)).getMinElement());
	}

	@Test
public  testIsolatedElements():  void {
		let  s = new  IntervalSet();
		s.add(1);
		s.add('z');
		s.add('\uFFF0');
		let  expecting = "{1, 122, 65520}";
        assertEquals(s.toString(), expecting);
    }

    @Test
public  testMixedRangesAndElements():  void {
        let  s = new  IntervalSet();
        s.add(1);
        s.add('a','z');
        s.add('0','9');
        let  expecting = "{1, 48..57, 97..122}";
        assertEquals(s.toString(), expecting);
    }

    @Test
public  testSimpleAnd():  void {
        let  s = IntervalSet.of(10,20);
        let  s2 = IntervalSet.of(13,15);
        let  expecting = "{13..15}";
        let  result = (s.and(s2)).toString();
        assertEquals(expecting, result);
    }

    @Test
public  testRangeAndIsolatedElement():  void {
        let  s = IntervalSet.of('a','z');
        let  s2 = IntervalSet.of('d');
        let  expecting = "100";
        let  result = (s.and(s2)).toString();
        assertEquals(expecting, result);
    }

	@Test
public  testEmptyIntersection():  void {
		let  s = IntervalSet.of('a','z');
		let  s2 = IntervalSet.of('0','9');
		let  expecting = "{}";
		let  result = (s.and(s2)).toString();
		assertEquals(expecting, result);
	}

	@Test
public  testEmptyIntersectionSingleElements():  void {
		let  s = IntervalSet.of('a');
		let  s2 = IntervalSet.of('d');
		let  expecting = "{}";
		let  result = (s.and(s2)).toString();
		assertEquals(expecting, result);
	}

    @Test
public  testNotSingleElement():  void {
        let  vocabulary = IntervalSet.of(1,1000);
        vocabulary.add(2000,3000);
        let  s = IntervalSet.of(50,50);
        let  expecting = "{1..49, 51..1000, 2000..3000}";
        let  result = (s.complement(vocabulary)).toString();
        assertEquals(expecting, result);
    }

	@Test
public  testNotSet():  void {
		let  vocabulary = IntervalSet.of(1,1000);
		let  s = IntervalSet.of(50,60);
		s.add(5);
		s.add(250,300);
		let  expecting = "{1..4, 6..49, 61..249, 301..1000}";
		let  result = (s.complement(vocabulary)).toString();
		assertEquals(expecting, result);
	}

	@Test
public  testNotEqualSet():  void {
		let  vocabulary = IntervalSet.of(1,1000);
		let  s = IntervalSet.of(1,1000);
		let  expecting = "{}";
		let  result = (s.complement(vocabulary)).toString();
		assertEquals(expecting, result);
	}

	@Test
public  testNotSetEdgeElement():  void {
		let  vocabulary = IntervalSet.of(1,2);
		let  s = IntervalSet.of(1);
		let  expecting = "2";
		let  result = (s.complement(vocabulary)).toString();
		assertEquals(expecting, result);
	}

    @Test
public  testNotSetFragmentedVocabulary():  void {
        let  vocabulary = IntervalSet.of(1,255);
        vocabulary.add(1000,2000);
        vocabulary.add(9999);
        let  s = IntervalSet.of(50, 60);
        s.add(3);
        s.add(250,300);
        s.add(10000); // this is outside range of vocab and should be ignored
        let  expecting = "{1..2, 4..49, 61..249, 1000..2000, 9999}";
        let  result = (s.complement(vocabulary)).toString();
        assertEquals(expecting, result);
    }

    @Test
public  testSubtractOfCompletelyContainedRange():  void {
        let  s = IntervalSet.of(10,20);
        let  s2 = IntervalSet.of(12,15);
        let  expecting = "{10..11, 16..20}";
        let  result = (s.subtract(s2)).toString();
        assertEquals(expecting, result);
    }

	@Test
public  testSubtractFromSetWithEOF():  void {
		let  s = IntervalSet.of(10,20);
		s.add(Token.EOF);
		let  s2 = IntervalSet.of(12,15);
		let  expecting = "{<EOF>, 10..11, 16..20}";
		let  result = (s.subtract(s2)).toString();
		assertEquals(expecting, result);
	}

	@Test
public  testSubtractOfOverlappingRangeFromLeft():  void {
		let  s = IntervalSet.of(10,20);
		let  s2 = IntervalSet.of(5,11);
		let  expecting = "{12..20}";
        let  result = (s.subtract(s2)).toString();
        assertEquals(expecting, result);

        let  s3 = IntervalSet.of(5,10);
        expecting = "{11..20}";
        result = (s.subtract(s3)).toString();
        assertEquals(expecting, result);
    }

    @Test
public  testSubtractOfOverlappingRangeFromRight():  void {
        let  s = IntervalSet.of(10,20);
        let  s2 = IntervalSet.of(15,25);
        let  expecting = "{10..14}";
        let  result = (s.subtract(s2)).toString();
        assertEquals(expecting, result);

        let  s3 = IntervalSet.of(20,25);
        expecting = "{10..19}";
        result = (s.subtract(s3)).toString();
        assertEquals(expecting, result);
    }

    @Test
public  testSubtractOfCompletelyCoveredRange():  void {
        let  s = IntervalSet.of(10,20);
        let  s2 = IntervalSet.of(1,25);
        let  expecting = "{}";
        let  result = (s.subtract(s2)).toString();
        assertEquals(expecting, result);
    }

    @Test
public  testSubtractOfRangeSpanningMultipleRanges():  void {
        let  s = IntervalSet.of(10,20);
        s.add(30,40);
        s.add(50,60); // s has 3 ranges now: 10..20, 30..40, 50..60
        let  s2 = IntervalSet.of(5,55); // covers one and touches 2nd range
        let  expecting = "{56..60}";
        let  result = (s.subtract(s2)).toString();
        assertEquals(expecting, result);

        let  s3 = IntervalSet.of(15,55); // touches both
        expecting = "{10..14, 56..60}";
        result = (s.subtract(s3)).toString();
        assertEquals(expecting, result);
    }

	/** The following was broken:
	 	{0..113, 115..65534}-{0..115, 117..65534}=116..65534
	 */
	@Test
public  testSubtractOfWackyRange():  void {
		let  s = IntervalSet.of(0,113);
		s.add(115,200);
		let  s2 = IntervalSet.of(0,115);
		s2.add(117,200);
		let  expecting = "116";
		let  result = (s.subtract(s2)).toString();
		assertEquals(expecting, result);
	}

    @Test
public  testSimpleEquals():  void {
        let  s = IntervalSet.of(10,20);
        let  s2 = IntervalSet.of(10,20);
        assertEquals(s, s2);

        let  s3 = IntervalSet.of(15,55);
        assertFalse(s.equals(s3));
    }

    @Test
public  testEquals():  void {
        let  s = IntervalSet.of(10,20);
        s.add(2);
        s.add(499,501);
        let  s2 = IntervalSet.of(10,20);
        s2.add(2);
        s2.add(499,501);
        assertEquals(s, s2);

        let  s3 = IntervalSet.of(10,20);
        s3.add(2);
		assertFalse(s.equals(s3));
    }

    @Test
public  testSingleElementMinusDisjointSet():  void {
        let  s = IntervalSet.of(15,15);
        let  s2 = IntervalSet.of(1,5);
        s2.add(10,20);
        let  expecting = "{}"; // 15 - {1..5, 10..20} = {}
        let  result = s.subtract(s2).toString();
        assertEquals(expecting, result);
    }

    @Test
public  testMembership():  void {
        let  s = IntervalSet.of(15,15);
        s.add(50,60);
        assertTrue(!s.contains(0));
        assertTrue(!s.contains(20));
        assertTrue(!s.contains(100));
        assertTrue(s.contains(15));
        assertTrue(s.contains(55));
        assertTrue(s.contains(50));
        assertTrue(s.contains(60));
    }

    // {2,15,18} & 10..20
    @Test
public  testIntersectionWithTwoContainedElements():  void {
        let  s = IntervalSet.of(10,20);
        let  s2 = IntervalSet.of(2,2);
        s2.add(15);
        s2.add(18);
        let  expecting = "{15, 18}";
        let  result = (s.and(s2)).toString();
        assertEquals(expecting, result);
    }

    @Test
public  testIntersectionWithTwoContainedElementsReversed():  void {
        let  s = IntervalSet.of(10,20);
        let  s2 = IntervalSet.of(2,2);
        s2.add(15);
        s2.add(18);
        let  expecting = "{15, 18}";
        let  result = (s2.and(s)).toString();
        assertEquals(expecting, result);
    }

    @Test
public  testComplement():  void {
        let  s = IntervalSet.of(100,100);
        s.add(101,101);
        let  s2 = IntervalSet.of(100,102);
        let  expecting = "102";
        let  result = (s.complement(s2)).toString();
        assertEquals(expecting, result);
    }

	@Test
public  testComplement2():  void {
		let  s = IntervalSet.of(100,101);
		let  s2 = IntervalSet.of(100,102);
		let  expecting = "102";
		let  result = (s.complement(s2)).toString();
		assertEquals(expecting, result);
	}

	@Test
public  testComplement3():  void {
		let  s = IntervalSet.of(1,96);
		s.add(99, Lexer.MAX_CHAR_VALUE);
		let  expecting = "{97..98}";
		let  result = (s.complement(1, Lexer.MAX_CHAR_VALUE)).toString();
		assertEquals(expecting, result);
	}

    @Test
public  testMergeOfRangesAndSingleValues():  void {
        // {0..41, 42, 43..65534}
        let  s = IntervalSet.of(0,41);
        s.add(42);
        s.add(43,65534);
        let  expecting = "{0..65534}";
        let  result = s.toString();
        assertEquals(expecting, result);
    }

    @Test
public  testMergeOfRangesAndSingleValuesReverse():  void {
        let  s = IntervalSet.of(43,65534);
        s.add(42);
        s.add(0,41);
        let  expecting = "{0..65534}";
        let  result = s.toString();
        assertEquals(expecting, result);
    }

    @Test
public  testMergeWhereAdditionMergesTwoExistingIntervals():  void {
        // 42, 10, {0..9, 11..41, 43..65534}
        let  s = IntervalSet.of(42);
        s.add(10);
        s.add(0,9);
        s.add(43,65534);
        s.add(11,41);
        let  expecting = "{0..65534}";
        let  result = s.toString();
        assertEquals(expecting, result);
    }

	/**
	 * This case is responsible for antlr/antlr4#153.
	 * https://github.com/antlr/antlr4/issues/153
	 */
	@Test
public  testMergeWhereAdditionMergesThreeExistingIntervals():  void {
		let  s = new  IntervalSet();
		s.add(0);
		s.add(3);
		s.add(5);
		s.add(0, 7);
		let  expecting = "{0..7}";
		let  result = s.toString();
		assertEquals(expecting, result);
	}

	@Test
public  testMergeWithDoubleOverlap():  void {
		let  s = IntervalSet.of(1,10);
		s.add(20,30);
		s.add(5,25); // overlaps two!
		let  expecting = "{1..30}";
		let  result = s.toString();
		assertEquals(expecting, result);
	}

	@Test
public  testSize():  void {
		let  s = IntervalSet.of(20,30);
		s.add(50,55);
		s.add(5,19);
		let  expecting = "32";
		let  result = string.valueOf(s.size());
		assertEquals(expecting, result);
	}

	@Test
public  testToList():  void {
		let  s = IntervalSet.of(20,25);
		s.add(50,55);
		s.add(5,5);
		let  expecting = "[5, 20, 21, 22, 23, 24, 25, 50, 51, 52, 53, 54, 55]";
		let  result = string.valueOf(s.toList());
		assertEquals(expecting, result);
	}

	/** The following was broken:
	    {'\u0000'..'s', 'u'..'\uFFFE'} & {'\u0000'..'q', 's'..'\uFFFE'}=
	    {'\u0000'..'q', 's'}!!!! broken...
	 	'q' is 113 ascii
	 	'u' is 117
	*/
	@Test
public  testNotRIntersectionNotT():  void {
		let  s = IntervalSet.of(0,'s');
		s.add('u',200);
		let  s2 = IntervalSet.of(0,'q');
		s2.add('s',200);
		let  expecting = "{0..113, 115, 117..200}";
		let  result = (s.and(s2)).toString();
		assertEquals(expecting, result);
	}

    @Test
public  testRmSingleElement():  void {
        let  s = IntervalSet.of(1,10);
        s.add(-3,-3);
        s.remove(-3);
        let  expecting = "{1..10}";
        let  result = s.toString();
        assertEquals(expecting, result);
    }

    @Test
public  testRmLeftSide():  void {
        let  s = IntervalSet.of(1,10);
        s.add(-3,-3);
        s.remove(1);
        let  expecting = "{-3, 2..10}";
        let  result = s.toString();
        assertEquals(expecting, result);
    }

    @Test
public  testRmRightSide():  void {
        let  s = IntervalSet.of(1,10);
        s.add(-3,-3);
        s.remove(10);
        let  expecting = "{-3, 1..9}";
        let  result = s.toString();
        assertEquals(expecting, result);
    }

    @Test
public  testRmMiddleRange():  void {
        let  s = IntervalSet.of(1,10);
        s.add(-3,-3);
        s.remove(5);
        let  expecting = "{-3, 1..4, 6..10}";
        let  result = s.toString();
        assertEquals(expecting, result);
    }
}
