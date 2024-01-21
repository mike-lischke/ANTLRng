/*
 * Copyright (c) Mike Lischke. All rights reserved.
 * Licensed under the MIT License. See License-MIT.txt in the project root for license information.
 */

/* eslint-disable @typescript-eslint/naming-convention */

/**
 * This file contains the decorators for the test framework.
 */

/**
 * Parameters for the Test decorator.
 */
export interface ITestParameters {
    /** The name of the test. Used for result output, if given and no description is specified. */
    testName?: string;

    /** A description for the test. */
    description?: string;

    /** The name of a static method in the same class, which generates test data for the decorated method. */
    dataProvider?: string;

    /** The type of expected exceptions in the decorated method. */
    expectedExceptions?: Array<typeof Error>;

    /** Whether methods on this class/method are enabled. */
    enabled?: boolean;

    /** The maximum number of milliseconds this test should take. */
    timeout?: number;
}

export interface IDataProviderParameters {
    /** The name of the data provider. If not given then the decorated method name is used instead.*/
    name?: string;

    /** Not used. */
    parallel?: boolean;
}

/** A definition of the target function for a function decorator. */
export type DecoratorTargetFunction<This, Args extends unknown[], Return> = (this: This, ...args: Args) => Return;

/**
 * Marks a method as overriding an inherited method.
 * @param target The decorated target function.
 * @param _context The context of the decorator.
 *
 * @returns The original method.
 */
export const Override = <This, Args extends unknown[], Return>(
    target: DecoratorTargetFunction<This, Args, Return>,
    _context: ClassMethodDecoratorContext<This, DecoratorTargetFunction<This, Args, Return>>,
): DecoratorTargetFunction<This, Args, Return> => {
    return target;
};

/**
 * Executes the given target method and handles expected exceptions.
 *
 * @param target The target method.
 * @param expectedExceptions If given then the method is expected to throw an exception of one of the given types.
 * @param args The arguments for the target method.
 */
function executeTarget(this: unknown, target: Function, expectedExceptions?: Array<typeof Error>, ...args: unknown[]) {
    try {
        target.call(this, ...args);

        if (expectedExceptions) {
            throw new Error(`Expected exception of type ${expectedExceptions} but no exception was thrown.`);
        }
    } catch (e) {
        for (const expected of expectedExceptions ?? []) {
            if (e instanceof expected) {
                return;
            }
        }
        throw e;
    }
}

/**
 * Collects and calls a list of all methods with the name of the target function in the prototype chain of the given
 * instance.
 * The list is ordered from the top of the prototype chain to the current instance and contains the original
 * methods (not the decorator methods).
 * @param target The target method.
 * @param args The arguments for the target method.
 */
function executeTargetWithInheritance<This>(this: This, target: Function, ...args: unknown[]) {
    // Call the original method and all overridden methods in the prototype chain (in reverse order).
    const methods: Function[] = [];

    // Start with the current instance's prototype.
    let proto = Object.getPrototypeOf(this) as { [key: string]: Function; };

    // Traverse up the prototype chain.
    while (proto != null) {
        // If the current prototype has the method, call it.
        if (typeof proto[target.name] === "function") {
            const f = proto[target.name] as Function & { originalMethod: Function; };

            // If there's no originalMethod property then this is the original method.
            methods.unshift(f.originalMethod ?? f);
        }

        proto = Object.getPrototypeOf(proto);
    }

    methods.forEach((method) => {
        method.call(this, ...args);
    });
};

export function DataProvider<This, Args extends unknown[], Return>(
    target: DecoratorTargetFunction<This, Args, Return>,
    context: ClassMethodDecoratorContext<This, DecoratorTargetFunction<This, Args, Return>>
): DecoratorTargetFunction<This, Args, Return>;
export function DataProvider(param: IDataProviderParameters): Function;
/**
 * Mark a method as supplying data for a test method.
 *
 * This decorator mimics the base functionality of the TestNG DataProvider annotation.
 *
 * @param args Either a single parameter object or the target method and the context of the decorator.
 *
 * @returns The original method.
 */
// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
export function DataProvider<This, Args extends unknown[], Return>(
    ...args: unknown[]): Function | DecoratorTargetFunction<This, Args, Return> {
    if (args.length === 1) {
        // Only one argument given => handled as decorator factory.
        const [param] = args as [IDataProviderParameters];

        return <This, Args extends unknown[], Return>(
            target: DecoratorTargetFunction<This, Args, Return>,
            context: ClassMethodDecoratorContext<This, DecoratorTargetFunction<This, Args, Return>>) => {

            if (param.name) {
                // If a name is given for the data provider then change the name of the method to that name.
                // Note: this will not change the name in the property descriptor of the class. It only changes the
                //       name of the method itself.
                Object.defineProperty(target, "name", { value: param.name });
            }
            Object.defineProperty(target, "isDataProvider", { value: true });

            return target;
        };
    } else {
        // Multiple arguments given. This makes this function to a decorator.
        const [target, _context] = args as [DecoratorTargetFunction<This, Args, Return>,
            ClassMethodDecoratorContext<This, DecoratorTargetFunction<This, Args, Return>>];
        Object.defineProperty(target, "isDataProvider", { value: true });

        return target;
    }
}

/**
 * Decorator function for the Test annotation.
 *
 * @param target The target method.
 * @param context The context of the decorator.
 *
 * @returns a method decorator.
 */
export function Test<This, Args extends unknown[], Return>(
    target: DecoratorTargetFunction<This, Args, Return>,
    context: ClassMethodDecoratorContext<This, DecoratorTargetFunction<This, Args, Return>>
): DecoratorTargetFunction<This, Args, Return>;
export function Test<T extends ITestParameters>(param: T): Function;
/**
 * Decorator factory for the Test annotation. It creates a method decorator that applies the parameters given to the
 * factory.
 *
 * @param args A single parameter object with details for the decorated method.
 *
 * @returns A decorator factory method.
 */
// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
export function Test<T extends ITestParameters, This, Args extends unknown[], Return>(
    ...args: unknown[]): Function | DecoratorTargetFunction<This, Args, Return> {

    if (args.length === 1) {
        // Only one argument given. This makes this function to a decorator factory.
        const param = args[0] as T;

        return <This, Args extends unknown[], Return>(target: DecoratorTargetFunction<This, Args, Return>,
            context: ClassMethodDecoratorContext<This, DecoratorTargetFunction<This, Args, Return>>) => {
            const result = function (this: This & {
                [key: string]: unknown;
                constructor: { [key: string]: Function; };
            }, ...args: Args): Return {
                const title = param.description ?? param.testName ?? target.name;
                if (param.enabled === false) { // Can be undefined which defaults to true.
                    xit(title, () => {
                        // Skip this test.
                    });
                } else {
                    if (param.dataProvider) {
                        // If a data provider is given assume it's a static method on the class and call it to get
                        // the new arguments.
                        let provider: Function | undefined;

                        // Provider methods can be renamed by the DataProvider decorator. Therefore enumerate all
                        // properties of the class and look for the provider method.
                        Object.getOwnPropertyNames(this.constructor).forEach((name) => {
                            if (this.constructor[name].name === param.dataProvider) {
                                provider = this.constructor[name];
                            }
                        });

                        if (!provider) {
                            // If there's no static method with the provider name try to find a method with the
                            // provider name on the prototype.
                            Object.getOwnPropertyNames(Object.getPrototypeOf(this)).forEach((name) => {
                                if (typeof this[name] === "function" && name === param.dataProvider) {
                                    provider = this[name] as Function;
                                }
                            });
                        }

                        if (!provider) {
                            throw new Error(`Data provider "${param.dataProvider}" not found.`);
                        }

                        if (typeof provider !== "function") {
                            throw new Error(`Data provider "${param.dataProvider}" is not a function.`);
                        }

                        if (!("isDataProvider" in provider)) {
                            throw new Error(`The method "${param.dataProvider}" is not a data provider. ` +
                                `Use the @DataProvider decorator to mark it as data provider.`);
                        }

                        // Call the provider method to get a list of test cases.
                        const list = provider.call(this);
                        /*let cases: Iterator<unknown[]>;
                        if ("iterator" in list && typeof list.iterator === "function") {
                            // eslint-disable-next-line @typescript-eslint/no-unsafe-call
                            cases = list.iterator();
                        } else if (Array.isArray(list)) {
                            cases = java.util.Arrays.asList(list).iterator();
                        } else {
                            cases = list;
                        }*/
                        const cases: Iterator<unknown[]> = list;

                        let index = 0;
                        while (true) {
                            const next = cases.next();
                            if (next.done) {
                                break;
                            }

                            const testArgs = next.value as Args;
                            it(`Data Set ${index++}`, () => {
                                executeTarget.call(this, target, param?.expectedExceptions, ...testArgs);
                            }, param.timeout);
                        }

                        return void 0 as Return;
                    } else {
                        it(title, () => {
                            executeTarget.call(this, target, param?.expectedExceptions, args);
                        }, param.timeout);
                    }
                }

                return void 0 as Return;
            };

            Object.defineProperty(result, "isTest", { value: true });
            if (param.description) {
                Object.defineProperty(result, "description", { value: param.description });
            }

            return result;
        };
    } else {
        // Multiple arguments given, that is, the decorator has no parameters.
        const [target, _context] = args as [DecoratorTargetFunction<This, Args, Return>,
            ClassMethodDecoratorContext<This, DecoratorTargetFunction<This, Args, Return>>];

        const result = function (this: This, ...args: Args): Return {
            it(target.name, () => {
                target.call(this, ...args);
            });

            return void 0 as Return;
        };
        Object.defineProperty(result, "isTest", { value: true });

        return result;
    }
}

/**
 * Decorator function for the BeforeEach annotation.
 *
 * @param target The target method.
 * @param context The context of the decorator.
 *
 * @returns a method decorator.
 */
export const BeforeEach = <This, Args extends unknown[], Return>(
    target: DecoratorTargetFunction<This, Args, Return>,
    context: ClassMethodDecoratorContext<This, DecoratorTargetFunction<This, Args, Return>>,
): DecoratorTargetFunction<This, Args, Return> => {

    const result = function (this: This, ...args: Args): Return {
        beforeEach(() => {
            executeTargetWithInheritance.call(this, target, ...args);
        });

        return void 0 as Return;
    };

    Object.defineProperty(result, "originalMethod", { value: target });
    Object.defineProperty(result, "isBeforeEach", { value: true });

    return result;
};

/**
 * Decorator function for the BeforeAll annotation.
 *
 * @param target The target method.
 * @param context The context of the decorator.
 *
 * @returns a method decorator.
 */
export const BeforeAll = <This, Args extends unknown[], Return>(
    target: DecoratorTargetFunction<This, Args, Return>,
    context: ClassMethodDecoratorContext<This, DecoratorTargetFunction<This, Args, Return>>,
): DecoratorTargetFunction<This, Args, Return> => {

    const result = function (this: This, ...args: Args): Return {
        beforeAll(() => {
            executeTargetWithInheritance.call(this, target, ...args);
        });

        return void 0 as Return;
    };

    Object.defineProperty(result, "originalMethod", { value: target });
    Object.defineProperty(result, "isBeforeAll", { value: true });

    return result;
};

/**
 * Decorator function for the AfterEach annotation.
 *
 * @param target The target method.
 * @param context The context of the decorator.
 *
 * @returns a method decorator.
 */
export const AfterEach = <This, Args extends unknown[], Return>(
    target: DecoratorTargetFunction<This, Args, Return>,
    context: ClassMethodDecoratorContext<This, DecoratorTargetFunction<This, Args, Return>>,
): DecoratorTargetFunction<This, Args, Return> => {

    const result = function (this: This, ...args: Args): Return {
        afterEach(() => {
            executeTargetWithInheritance.call(this, target, ...args);
        });

        return void 0 as Return;
    };

    Object.defineProperty(result, "originalMethod", { value: target });
    Object.defineProperty(result, "isAfterEach", { value: true });

    return result;
};
/**
 * Decorator function for the AfterAll annotation.
 *
 * @param target The target method.
 * @param context The context of the decorator.
 *
 * @returns a method decorator.
 */
export const AfterAll = <This, Args extends unknown[], Return>(
    target: DecoratorTargetFunction<This, Args, Return>,
    context: ClassMethodDecoratorContext<This, DecoratorTargetFunction<This, Args, Return>>,
): DecoratorTargetFunction<This, Args, Return> => {

    const result = function (this: This, ...args: Args): Return {
        afterAll(() => {
            executeTargetWithInheritance.call(this, target, ...args);
        });

        return void 0 as Return;
    };

    Object.defineProperty(result, "originalMethod", { value: target });
    Object.defineProperty(result, "isAfterAll", { value: true });

    return result;
};

/**
 * Decorator function for the Ignore annotation.
 *
 * @param param The reason why the test is ignored.
 *
 * @returns the original method.
 */
export const Ignore = (param: string): Function => {

    return <This, Args extends unknown[], Return>(target: DecoratorTargetFunction<This, Args, Return>,
        context: ClassMethodDecoratorContext<This, DecoratorTargetFunction<This, Args, Return>>) => {

        Object.defineProperty(target, "enabled", { value: false });

        return target;
    };
};
