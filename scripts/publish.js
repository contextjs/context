/**
 * This script builds ContextJS.
 * 
 * @example
 * npm run build - builds all projects.
 * npm run build project1 project2 ... - builds specified projects.
 */

import { execSync } from "child_process";
import * as fs from 'fs';
import { BUILD_FOLDER, PACKAGES_FOLDER, PROJECTS, VERSION } from "./config.js";
//import * as build from build.js;
import './build.js';

try {
    const projects = getProjects(process.argv.slice(2));

    for (let project of projects)
        publishProject(project);
}
catch (error) {
    console.log(error);
}

function publishProject(project) {
    console.log(`Publishing "${project}"...`);
    execSync(`cd ${BUILD_FOLDER}/${project}`, { stdio: 'inherit' });
    execSync(`npm version prerelease --preid=${VERSION}`, { stdio: 'inherit' });
    execSync(`npm publish && cd .. && cd ..`, { stdio: 'inherit' });

    console.log(`Publishing "${project}"... Done`);
}

function getProjects(args) {
    if (args.length > 0)
        return args;

    return PROJECTS;
}