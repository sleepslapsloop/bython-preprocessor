import {
    bracketError,
    emptyFile,
    fileNotFound,
    noInput,
    writingError,
} from "./modules/errors";
import isValid from "./modules/validBrackets";
import { readFileSync, writeFile } from "fs";

const args: string[] = process.argv.slice(2);
let inputFile: string | undefined = undefined;
let outputFile: string = "out.py";

for (let str of args) {
    if (str.endsWith(".pyb")) {
        inputFile = str;
    } else if (str.endsWith(".py")) {
        outputFile = str;
    }
}

if (inputFile === undefined) {
    throw noInput;
}

function compiler(inputFile: string): string {
    let code: string;
    try {
        code = readFileSync(inputFile, "utf-8");
    } catch (err) {
        throw fileNotFound;
    }
    let codeSplit: string[] = code.split("\n");

    for (let str of codeSplit) {
        if (str === undefined) throw emptyFile;
    }

    let finalCode: string[] = new Array();
    let brackets: string = "";
    let indentLevel: number = 0;
    let tab: string = "\t";

    for (const line of codeSplit) {
        let finalCmd: string = "";
        for (let j = 0; j < line.length; j++) {
            if (line[j] !== "{" && line[j] !== "}") {
                finalCmd += line[j];
            } else if (line[j] === "{") {
                brackets += "{";
                indentLevel++;
                finalCmd += ":\n" + tab.repeat(indentLevel);
            } else if (line[j] === "}") {
                brackets += "}";
                indentLevel--;
                finalCmd += "\n";
            }
        }
        finalCode.push(finalCmd);
    }

    if (!isValid(brackets)) throw bracketError;
    if (finalCode.length === 0) throw emptyFile;
    if (indentLevel !== 0) throw bracketError;

    return finalCode.join("\n");
}

function writeOutput(outputFile: string, code: string): void {
    writeFile(outputFile, code, (err) => {
        if (err) {
            throw writingError;
        } else {
            process.exit(0);
        }
    });
}

writeOutput(outputFile, compiler(inputFile!));
