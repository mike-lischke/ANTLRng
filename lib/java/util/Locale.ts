/*
 * This file is released under the MIT license.
 * Copyright (c) 2022, Mike Lischke
 *
 * See LICENSE-MIT.txt file for more info.
 */

import { final } from "../../Decorators";
import { Cloneable } from "../lang";

/** This class has no meaningful implementation and exist only to satisfy call signatures. */
@final
export class Locale implements Cloneable<Locale> {
    public static getDefault(): Locale {
        return new Locale();
    }

    public clone(): Locale {
        return this;
    }
}
