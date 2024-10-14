
/* eslint-disable jsdoc/require-returns, jsdoc/require-param */





export class TestUtils {
    @Test
    public testStripFileExtension(): void {
        assertNull(Utils.stripFileExtension(null));
        assertEquals("foo", Utils.stripFileExtension("foo"));
        assertEquals("foo", Utils.stripFileExtension("foo.txt"));
    }

    @Test
    public testJoin(): void {
        assertEquals("foobbar",
            Utils.join(["foo", "bar"], "b"));
        assertEquals("foo,bar",
            Utils.join(["foo", "bar"], ","));
    }

    @Test
    public testSortLinesInString(): void {
        assertEquals("bar\nbaz\nfoo\n",
            Utils.sortLinesInString("foo\nbar\nbaz"));
    }

    @Test
    public testNodesToStrings(): void {
        let values = new Array();
        values.add(new GrammarAST(Token.EOR_TOKEN_TYPE));
        values.add(new GrammarAST(Token.DOWN));
        values.add(new GrammarAST(Token.UP));

        assertNull(Utils.nodesToStrings(null));
        assertNotNull(Utils.nodesToStrings(values));
    }

    @Test
    public testCapitalize(): void {
        assertEquals("Foo", Utils.capitalize("foo"));
    }

    @Test
    public testDecapitalize(): void {
        assertEquals("fOO", Utils.decapitalize("FOO"));
    }

    @Test
    public testSelect(): void {
        let strings = new Array();
        strings.add("foo");
        strings.add("bar");

        let func1 = new class extends Utils.Func1 {

            public exec(arg1: Object): Object {
                return "baz";
            }
        }();

        let retval = new Array();
        retval.add("baz");
        retval.add("baz");

        assertEquals(retval, Utils.select(strings, func1));
        assertNull(Utils.select(null, null));
    }

    @Test
    public testFind(): void {
        let strings = new Array();
        strings.add("foo");
        strings.add("bar");
        assertEquals("foo", Utils.find(strings, string.class));

        assertNull(Utils.find(new Array(), string.class));
    }

    @Test
    public testIndexOf(): void {
        let strings = new Array();
        strings.add("foo");
        strings.add("bar");
        let filter = new class extends Utils.Filter {

            public select(o: Object): boolean {
                return true;
            }
        }();
        assertEquals(0, Utils.indexOf(strings, filter));
        assertEquals(-1, Utils.indexOf(new Array(), null));
    }

    @Test
    public testLastIndexOf(): void {
        let strings = new Array();
        strings.add("foo");
        strings.add("bar");
        let filter = new class extends Utils.Filter {

            public select(o: Object): boolean {
                return true;
            }
        }();
        assertEquals(1, Utils.lastIndexOf(strings, filter));
        assertEquals(-1, Utils.lastIndexOf(new Array(), null));
    }

    @Test
    public testSetSize(): void {
        let strings = new Array();
        strings.add("foo");
        strings.add("bar");
        strings.add("baz");
        assertEquals(3, strings.size());

        Utils.setSize(strings, 2);
        assertEquals(2, strings.size());

        Utils.setSize(strings, 4);
        assertEquals(4, strings.size());
    }
}
