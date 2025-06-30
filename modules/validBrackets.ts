export default function isValid(s: string): boolean {
  let stack: string[] = new Array();
  const open: Set<string> = new Set(["(", "{", "["]);
  const close: Map<string, string> = new Map([
    [")", "("],
    ["}", "{"],
    ["]", "["],
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
