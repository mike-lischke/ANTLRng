/*
 * Copyright (c) 2012-2022 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */


import { java, S } from "jree";

type Enum<E extends Enum<E>> = java.lang.Enum<E extends Enum<E>>;
const Enum = java.lang.Enum;

import { Test, Override } from "../../../../../../decorators.js";
 class  OSType extends java.lang.Enum<OSType> {
	public static readonly Windows: OSType = new class extends OSType {
}(S`Windows`, 0);
	public static readonly Linux: OSType = new class extends OSType {
}(S`Linux`, 1);
	public static readonly Mac: OSType = new class extends OSType {
}(S`Mac`, 2);
	public static readonly Unknown: OSType = new class extends OSType {
}(S`Unknown`, 3)
}
