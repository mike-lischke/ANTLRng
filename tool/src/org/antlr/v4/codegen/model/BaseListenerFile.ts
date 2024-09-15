/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { ListenerFile } from "./ListenerFile.js";
import { OutputModelFactory } from "../OutputModelFactory.js";

export class BaseListenerFile extends ListenerFile {
    public constructor(factory: OutputModelFactory, fileName: string) {
        super(factory, fileName);
    }
}
