#!/usr/bin/env node

/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { Tool } from "../src/Tool.js";

Tool.main(process.argv.slice(2));
