/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

export enum ProjectType {
    API = "API",
    Views = "Views"
}

export class ProjectTypeExtensions {
    public static toString(projectType: ProjectType): string | null {
        switch (projectType) {
            case ProjectType.API:
                return "API";
            case ProjectType.Views:
                return "Views";
            default:
                return null;
        }
    }

    public static fromString(value: string): ProjectType | null {
        switch (value.toLowerCase()) {
            case "api":
                return ProjectType.API;
            case "views":
                return ProjectType.Views;
            default:
                return null;
        }
    }
}