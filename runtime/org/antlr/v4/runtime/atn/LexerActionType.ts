/* java2ts: keep */

/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { S, java } from "jree";

/**
 * Represents the serialization type of a {@link LexerAction}.
 *
 * @author Sam Harwell
 *
 */
export class LexerActionType extends java.lang.Enum<LexerActionType> {
    /**
     * The type of a {@link LexerChannelAction} action.
     */
    public static readonly CHANNEL: LexerActionType = new class extends LexerActionType {
    }(S`CHANNEL`, 0);
    /**
     * The type of a {@link LexerCustomAction} action.
     */
    public static readonly CUSTOM: LexerActionType = new class extends LexerActionType {
    }(S`CUSTOM`, 1);
    /**
     * The type of a {@link LexerModeAction} action.
     */
    public static readonly MODE: LexerActionType = new class extends LexerActionType {
    }(S`MODE`, 2);
    /**
     * The type of a {@link LexerMoreAction} action.
     */
    public static readonly MORE: LexerActionType = new class extends LexerActionType {
    }(S`MORE`, 3);
    /**
     * The type of a {@link LexerPopModeAction} action.
     */
    public static readonly POP_MODE: LexerActionType = new class extends LexerActionType {
    }(S`POP_MODE`, 4);
    /**
     * The type of a {@link LexerPushModeAction} action.
     */
    public static readonly PUSH_MODE: LexerActionType = new class extends LexerActionType {
    }(S`PUSH_MODE`, 5);
    /**
     * The type of a {@link LexerSkipAction} action.
     */
    public static readonly SKIP: LexerActionType = new class extends LexerActionType {
    }(S`SKIP`, 6);
    /**
     * The type of a {@link LexerTypeAction} action.
     */
    public static readonly TYPE: LexerActionType = new class extends LexerActionType {
    }(S`TYPE`, 7);
}
