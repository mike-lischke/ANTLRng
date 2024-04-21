/* java2ts: keep */

/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

// cspell: disable

/* eslint-disable jsdoc/require-returns, jsdoc/require-param */

export interface PositionTrackingStream<T> {
    /**
     * Returns an element containing concrete information about the current
     * position in the stream.
     *
     * @param allowApproximateLocation if {@code false}, this method returns
     * {@code null} if an element containing exact information about the current
     * position is not available
     */
    getKnownPositionElement(allowApproximateLocation: boolean): T;

    /**
     * Determines if the specified {@code element} contains concrete position
     * information.
     *
     * @param element the element to check
     * @returns `true` if `element` contains concrete position information, otherwise `false`
     */
    hasPositionInformation(element: T): boolean;
}
