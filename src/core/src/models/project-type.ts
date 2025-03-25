/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { ObjectExtensions } from "../extensions/object.extensions.js";
import { StringExtensions } from "../extensions/string.extensions.js";

export enum ProjectType {
    API
}

export class ProjectTypeExtensions {
    public static toString(projectType: ProjectType): string | null {
        if (ObjectExtensions.isNullOrUndefined(projectType))
            return null;

        switch (projectType) {
            case ProjectType.API:
                return "API";
            default:
                return null;
        }
    }

    public static fromString(value: string): ProjectType | null {
        if (StringExtensions.isNullOrWhiteSpace(value))
            return null;

        switch (value.toLowerCase()) {
            case "api":
                return ProjectType.API;
            default:
                return null;
        }
    }
}