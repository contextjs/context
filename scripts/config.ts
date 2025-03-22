/**
 * This script builds ContextJS.
 * 
 * @example
 * npm run build - builds all projects.
 * npm run build project1 project2 ... - builds specified projects.
 */

export default class Config {
    public static version: string = "0.0.6";
    public static buildFolder: string = "_build";
    public static packagesFolder: string = "_packages";
    public static packages: string[] = [
        "core",
        "context"
    ];
}