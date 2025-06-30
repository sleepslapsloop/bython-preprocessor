// modules/errors.ts
var noInput = new Error("Fatal: No File to Compile");
var fileNotFound = new Error("Fatal: File Not Found");
var bracketError = new Error("Fatal: Invalid Brackets");
var emptyFile = new Error("Fatal: Empty File");
var writingError = new Error("Fatal: Unable to Compile File");

// modules/validBrackets.ts
function isValid(s) {
  let stack = new Array;
  const open = new Set(["(", "{", "["]);
  const close = new Map([
    [")", "("],
    ["}", "{"],
    ["]", "["]
  ]);
  for (let char of s) {
    if (open.has(char)) {
      stack.push(char);
    } else if (close.has(char)) {
      if (close.get(char) !== stack.pop()) {
        return false;
      }
    } else {
      return false;
    }
  }
  if (stack.length === 0) {
    return true;
  } else {
    return false;
  }
}

// index.ts
var {readFileSync, writeFile} = (() => ({}));
var args = process.argv.slice(2);
var inputFile = undefined;
var outputFile = "out.py";
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
function compiler(inputFile2) {
  let code;
  try {
    code = readFileSync(inputFile2, "utf-8");
  } catch (err) {
    throw fileNotFound;
  }
  let codeSplit = code.split(`
`);
  for (let str of codeSplit) {
    if (str === undefined)
      throw emptyFile;
  }
  let finalCode = new Array;
  let brackets = "";
  let indentLevel = 0;
  let tab = "\t";
  for (const line of codeSplit) {
    let finalCmd = "";
    for (let j = 0;j < line.length; j++) {
      if (line[j] !== "{" && line[j] !== "}") {
        finalCmd += line[j];
      } else if (line[j] === "{") {
        brackets += "{";
        indentLevel++;
        finalCmd += `:
` + tab.repeat(indentLevel);
      } else if (line[j] === "}") {
        brackets += "}";
        indentLevel--;
        finalCmd += `
`;
      }
    }
    finalCode.push(finalCmd);
  }
  if (!isValid(brackets))
    throw bracketError;
  if (finalCode.length === 0)
    throw emptyFile;
  if (indentLevel !== 0)
    throw bracketError;
  return finalCode.join(`
`);
}
function writeOutput(outputFile2, code) {
  writeFile(outputFile2, code, (err) => {
    if (err) {
      throw writingError;
    } else {
      process.exit(0);
    }
  });
}
writeOutput(outputFile, compiler(inputFile));
