/*
 * Copyright (c) Mike Lischke. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */

/*
 eslint-disable
    @typescript-eslint/naming-convention,
    prefer-arrow/prefer-arrow-functions,
    jsdoc/require-param,
    jsdoc/require-returns
*/

/** A definition of the target function for a function decorator. */
export type DecoratorTargetFunction<This, Args extends unknown[], Return> = (this: This, ...args: Args) => Return;

/**
 * Decorator function for the Override annotation. It does nothing but mark the method as overriding an inherited
 * method.
 */
export function Override<This>(target: This, propertyKey: PropertyKey, propertyDescriptor?: PropertyDescriptor): void {
    // Intentionally empty.
}

/** Decorator function for the Test annotation. */
export function Test<This, Args extends unknown[], Return>(
    target: This, propertyKey: PropertyKey, propertyDescriptor?: PropertyDescriptor,
): TypedPropertyDescriptor<() => void> {

    const originalMethod = propertyDescriptor?.value as Function;
    const result = function (this: This, ...args: Args): Return {
        originalMethod?.call(this, ...args);

        return void 0 as Return;
    };
    Object.defineProperty(result, "isTest", { value: true });

    return { value: result };
}
