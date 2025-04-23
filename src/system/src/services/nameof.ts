/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { InvalidExpressionException } from "../exceptions/invalid-expression.exception.js";

/**
 * Returns the name of a property as a string.
 *
 * This utility supports two forms:
 * - Passing a string literal that matches a key of the specified type.
 * - Passing a lambda expression that accesses a property.
 *
 * @example
 * nameof<Person>("firstName");               // "firstName"
 * nameof(() => person.age);                  // "age"
 *
 * @template T The target type whose key or property is being referenced.
 * @param expr A string literal of a key in type T, or a lambda accessing a property.
 * @returns The extracted property name.
 * @throws {InvalidExpressionException} If the lambda expression is invalid or cannot be parsed.
 */
export function nameof<T>(expr: keyof T): string;
export function nameof<T>(expr: () => T): string;
export function nameof<T>(expr: keyof T | (() => T)): string {
    if (typeof expr === "string")
        return expr;

    const match = /\.\s*([_$a-zA-Z][_$a-zA-Z0-9]*)\s*$/.exec(expr.toString());
    if (!match)
        throw new InvalidExpressionException(`Invalid expression passed to nameof(): ${expr.toString()}`);

    return match[1];
}