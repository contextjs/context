/**
 * This script builds ContextJS.
 * 
 * @example
 * npm run build - builds all projects.
 * npm run build project1 project2 ... - builds specified projects.
 */

import { execSync } from "child_process";
import * as fs from 'fs';
import { BUILD_FOLDER, PACKAGES_FOLDER, PROJECTS, VERSION } from "./config.mts";

try {
    npmInstall();
    createOutputDirectories();

    const projects = getProjects(process.argv.slice(2));

    for (let project of projects)
        buildProject(project);
}
catch (error) {
    console.log(error);
}


function npmInstall() {
    if (!fs.existsSync('node_modules')) {
        console.log('Installing npm packages...');
        execSync('npm pkg delete dependencies', { stdio: 'inherit' });
        execSync('npm update', { stdio: 'inherit' });
    }
}

function buildProject(project: string) {
    console.log(`Building "${project}"...`);

    removeDependency(project);
    createDirectory(`${BUILD_FOLDER}/${project}`);
    runLocalProjectBuild(project);
    copyPackageFile(project);
    setVersion(project);
    createPackage(project);
    installPackage(project);

    console.log(`Building "${project}"... Done`);
}

function createOutputDirectories() {
    if (!fs.existsSync(BUILD_FOLDER))
        fs.mkdirSync(BUILD_FOLDER);
    if (!fs.existsSync(PACKAGES_FOLDER))
        fs.mkdirSync(PACKAGES_FOLDER);
}

function runLocalProjectBuild(project: string) {
    if (fs.existsSync(`src/${project}/build.mts`))
        execSync(`node src/${project}/build.mts`, { stdio: 'inherit' });
}

function setVersion(project: string) {
    let packageContent = fs.readFileSync(`${BUILD_FOLDER}/${project}/package.json`)
        .toString()
        .replace(/__VERSION__/g, VERSION);

    fs.writeFileSync(`${BUILD_FOLDER}/${project}/package.json`, packageContent);
}

function copyPackageFile(project: string) {
    if (!fs.existsSync(`src/${project}/package.json`))
        throw new Error(`Missing package.json in "${project}" project.`);
    fs.copyFileSync(`src/${project}/package.json`, `${BUILD_FOLDER}/${project}/package.json`);
}

function createPackage(project: string) {
    execSync(`cd src/${project} && tsc`, { stdio: 'inherit' });
    execSync(`cd ${BUILD_FOLDER}/${project} && npm pack --silent --pack-destination ../../${PACKAGES_FOLDER}`, { stdio: 'inherit' });
}

function installPackage(project: string) {
    const packageJson = JSON.parse(fs.readFileSync(`${BUILD_FOLDER}/${project}/package.json`).toString());
    const name = packageJson.name.replace("@", "").replace("/", "-");

    execSync(`npm install ./${PACKAGES_FOLDER}/${name}-${VERSION}.tgz`, { stdio: 'inherit' });
}

function createDirectory(directory: string) {
    if (fs.existsSync(directory))
        fs.rmSync(directory, { recursive: true });
    fs.mkdirSync(directory);
}

function getProjects(args: string[]) {
    if (args.length > 0)
        return args;

    return PROJECTS;
}

function removeDependency(project: string) {
    console.log(`Removing dependency for "${project}"...`);

    const command = `npm pkg delete dependencies.@contextjs/${project}`;
    execSync(command, { stdio: 'inherit' });
}