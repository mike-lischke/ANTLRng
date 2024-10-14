/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

/* eslint-disable jsdoc/require-returns, jsdoc/require-param */





export  class TestFastQueue {
    @Test
public  testQueueNoRemove():  void {
        let  q = new  FastQueue<string>();
        q.add("a");
        q.add("b");
        q.add("c");
        q.add("d");
        q.add("e");
        let  expecting = "a b c d e";
        let  found = q.toString();
        assertEquals(expecting, found);
    }

    @Test
public  testQueueThenRemoveAll():  void {
        let  q = new  FastQueue<string>();
        q.add("a");
        q.add("b");
        q.add("c");
        q.add("d");
        q.add("e");
        let  buf = new  StringBuilder();
        while ( q.size()>0 ) {
            let  o = q.remove();
            buf.append(o);
            if ( q.size()>0 ) {
 buf.append(" ");
}

        }
        assertEquals(0, q.size(), "queue should be empty");
        let  expecting = "a b c d e";
        let  found = buf.toString();
        assertEquals(expecting, found);
    }

    @Test
public  testQueueThenRemoveOneByOne():  void {
        let  buf = new  StringBuilder();
        let  q = new  FastQueue<string>();
        q.add("a");
        buf.append(q.remove());
        q.add("b");
        buf.append(q.remove());
        q.add("c");
        buf.append(q.remove());
        q.add("d");
        buf.append(q.remove());
        q.add("e");
        buf.append(q.remove());
        assertEquals(0, q.size(), "queue should be empty");
        let  expecting = "abcde";
        let  found = buf.toString();
        assertEquals(expecting, found);
    }

    // E r r o r s

    @Test
public  testGetFromEmptyQueue():  void {
        let  q = new  FastQueue<string>();
        let  msg = null;
        try { q.remove(); } catch (nsee) {
if (nsee instanceof NoSuchElementException) {
            msg = nsee.getMessage();
        } else {
	throw nsee;
	}
}
        let  expecting = "queue index 0 > last index -1";
        let  found = msg;
        assertEquals(expecting, found);
    }

    @Test
public  testGetFromEmptyQueueAfterSomeAdds():  void {
        let  q = new  FastQueue<string>();
        q.add("a");
        q.add("b");
        q.remove();
        q.remove();
        let  msg = null;
        try { q.remove(); } catch (nsee) {
if (nsee instanceof NoSuchElementException) {
            msg = nsee.getMessage();
        } else {
	throw nsee;
	}
}
        let  expecting = "queue index 0 > last index -1";
        let  found = msg;
        assertEquals(expecting, found);
    }

    @Test
public  testGetFromEmptyQueueAfterClear():  void {
        let  q = new  FastQueue<string>();
        q.add("a");
        q.add("b");
        q.clear();
        let  msg = null;
        try { q.remove(); } catch (nsee) {
if (nsee instanceof NoSuchElementException) {
            msg = nsee.getMessage();
        } else {
	throw nsee;
	}
}
        let  expecting = "queue index 0 > last index -1";
        let  found = msg;
        assertEquals(expecting, found);
    }
}
