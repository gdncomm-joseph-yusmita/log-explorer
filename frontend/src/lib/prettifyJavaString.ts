/**
 * Fully vibecoded because I'm too lazy to hand write of a java string formatter
 */

export function prettifyJavaString(logMessage: string): string {
  let indentLevel = 0;
  let inKeywordDepth = 0;
  const INDENT_SIZE = 4; // 2 spaces per indentation level
  let result = "";
  let insideQuotes = false;

  // Helper to create the correct amount of spaces
  const getIndent = () => " ".repeat(Math.max(0, indentLevel) * INDENT_SIZE);

  for (let i = 0; i < logMessage.length; i++) {
    const char = logMessage[i];

    // Toggle quote state so we don't accidentally format inside English sentences or JSON strings!
    if (char === '"') {
      insideQuotes = !insideQuotes;
      result += char;
      continue;
    }

    // If we are inside a string, just pass the character through untouched
    if (insideQuotes) {
      result += char;
      continue;
    }

    if (char === "(" || char === "{") {
      inKeywordDepth++;
      indentLevel++;
      result += char + "\n" + getIndent();
    } else if (char === "[" && inKeywordDepth > 0) {
      indentLevel++;
      result += char + "\n" + getIndent();
    } else if (char === ")" || char === "}") {
      inKeywordDepth--;
      indentLevel--;
      if (logMessage[i - 1] === "(" || logMessage[i - 1] === "{") {
        result = result.trimEnd() + char;
      } else {
        result += "\n" + getIndent() + char;
      }
    } else if (char === "]" && inKeywordDepth > 0) {
      indentLevel--;
      if (logMessage[i - 1] === "[") {
        result = result.trimEnd() + char;
      } else {
        result += "\n" + getIndent() + char;
      }
    } else if (char === "," && logMessage[i + 1] === " " && inKeywordDepth > 0) {
      // Found a comma followed by a space inside a keyword: go down a line
      result += ",\n" + getIndent();
      i++; // Skip the trailing space so it doesn't mess up our indentation
    } else {
      // Just a normal character, add it to the string
      result += char;
    }
  }

  return result;
}
