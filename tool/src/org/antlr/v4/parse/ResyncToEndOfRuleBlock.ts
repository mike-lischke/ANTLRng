/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

/* eslint-disable jsdoc/require-returns, jsdoc/require-param */

/**
 * Used to throw us out of deeply nested element back to end of a rule's
 *  alt list. Note it's not under RecognitionException.
 */
export  class ResyncToEndOfRuleBlock extends java.lang.RuntimeException {
}
