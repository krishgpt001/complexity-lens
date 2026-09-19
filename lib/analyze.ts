export type Language = "auto" | "python" | "java" | "c" | "cpp" | "unknown";
export type ComplexityClass =
  | "constant"
  | "logarithmic"
  | "linear"
  | "linearithmic"
  | "quadratic"
  | "cubic"
  | "exponential"
  | "unknown";

export type ComplexityResult = {
  notation: string;
  className: ComplexityClass;
  explanation: string;
  confidence: number;
};

export type AnalysisResult = {
  language: Exclude<Language, "auto">;
  lines: number;
  codeLines: number;
  maxNesting: number;
  recursion: boolean;
  sizedAllocation: boolean;
  time: ComplexityResult;
  space: ComplexityResult;
  memory: {
    label: string;
    detail: string;
    pressure: "low" | "growing";
  };
  warnings: string[];
};

export function stripCommentsAndStrings(source: string): string {
  return source
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/\/\/.*$/gm, "")
    .replace(/^\s*#.*$/gm, "")
    .replace(/(["'`])(?:\\.|(?!\1)[\s\S])*\1/g, '""');
}

export function detectLanguage(source: string): Exclude<Language, "auto"> {
  if (/#include\s*<|std::|cout\s*<</.test(source)) return "cpp";
  if (/\bprintf\s*\(|\bmalloc\s*\(|\bsizeof\s*\(/.test(source)) return "c";
  if (/\b(public\s+static|System\.out|ArrayList)\b/.test(source)) return "java";
  if (/\b(def|elif|self|None|print)\b/.test(source) || /^\s*from\s+\w+\s+import/m.test(source)) return "python";
  return "unknown";
}

export function maxNestingBraces(source: string): number {
  let depth = 0;
  let maximum = 0;
  for (const character of source) {
    if (character === "{") depth += 1;
    if (character === "}") depth = Math.max(0, depth - 1);
    maximum = Math.max(maximum, depth);
  }
  return maximum;
}

export function maxNestingIndent(source: string): number {
  return source.split(/\r?\n/).reduce((maximum, line) => {
    if (!line.trim()) return maximum;
    const indentation = line.match(/^\s*/)?.[0].replace(/\t/g, "    ").length ?? 0;
    return Math.max(maximum, Math.floor(indentation / 4));
  }, 0);
}

export function detectRecursion(source: string): boolean {
  const functionPattern = /(?:def|function)\s+([A-Za-z_]\w*)|(?:int|void|bool|double|float)\s+([A-Za-z_]\w*)\s*\(/g;
  let match: RegExpExecArray | null;
  while ((match = functionPattern.exec(source))) {
    const name = match[1] ?? match[2];
    const body = source.slice(match.index, source.indexOf("\n}", match.index) > 0 ? source.indexOf("\n}", match.index) : match.index + 700);
    if (new RegExp(`\\b${name}\\s*\\(`).test(body.slice(name.length + 1))) return true;
  }
  return /\b(fibonacci|factorial)\s*\([^)]*\)\s*[{:\n][\s\S]{0,600}\b\1\s*\(/i.test(source);
}

export function detectSizedAllocation(source: string): boolean {
  return /\b(new|malloc|calloc|realloc|Array|Map|Set|vector)\b|(?:push|append|add)\s*\(|\[[^\]]+\]/i.test(source);
}

export function loopTimeClass(source: string): ComplexityResult {
  const loops = source.match(/\b(for|while|do)\b/g)?.length ?? 0;
  const nested = /\b(for|while)\b[\s\S]{0,450}\b(for|while)\b/.test(source);
  const halving = /\b(mid|left|right)\b[\s\S]{0,80}(?:\/\s*2|>>\s*1)|(?:\/\s*2|>>\s*1)[\s\S]{0,80}\b(mid|left|right)\b/.test(source);
  if (/\b(?:2\s*\*\*|pow\s*\(\s*2|Math\.pow\s*\(\s*2|fib(?:onacci)?)\b/i.test(source)) {
    return { notation: "O(2^n)", className: "exponential", explanation: "Branching growth or recursive doubling dominates runtime.", confidence: 74 };
  }
  if (nested && loops >= 3) return { notation: "O(n^3)", className: "cubic", explanation: "Three loop levels multiply the work for each input item.", confidence: 78 };
  if (nested) return { notation: "O(n^2)", className: "quadratic", explanation: "Nested iteration revisits the input for each outer item.", confidence: 88 };
  if (halving) return { notation: "O(log n)", className: "logarithmic", explanation: "The search range is repeatedly divided.", confidence: 82 };
  if (loops) return { notation: "O(n)", className: "linear", explanation: "A pass through the input scales with its size.", confidence: 91 };
  return { notation: "O(1)", className: "constant", explanation: "No input-scaled iteration was detected.", confidence: 79 };
}

function result(notation: string, className: ComplexityClass, explanation: string, confidence: number): ComplexityResult {
  return { notation, className, explanation, confidence };
}

export function analyze(source: string, selectedLanguage: Language = "auto"): AnalysisResult {
  const clean = stripCommentsAndStrings(source);
  const language = selectedLanguage === "auto" || selectedLanguage === "unknown" ? detectLanguage(source) : selectedLanguage;
  const lines = source ? source.split(/\r?\n/).length : 0;
  const codeLines = clean.split(/\r?\n/).filter((line) => line.trim()).length;
  const recursion = detectRecursion(clean);
  const sizedAllocation = detectSizedAllocation(clean);
  const time = loopTimeClass(clean);
  const maxNesting = Math.max(maxNestingBraces(clean), maxNestingIndent(clean));
  const warnings: string[] = [];
  if (recursion) warnings.push("Recursion detected: call-stack depth may grow with n.");
  if (sizedAllocation) warnings.push("A collection or sized allocation may grow with the input.");
  if (time.className === "unknown") warnings.push("The pattern is ambiguous; treat this estimate as a lower bound.");
  const space = recursion
    ? result("O(n)", "linear", "Recursive calls consume stack space proportional to depth.", 80)
    : sizedAllocation
      ? result("O(n)", "linear", "A growing collection or allocation tracks input size.", 83)
      : result("O(1)", "constant", "No input-sized auxiliary storage was detected.", 84);
  const memory = recursion || sizedAllocation
    ? {
        label: "grows with n",
        detail: recursion ? "stack frames scale with recursive depth" : "collection or allocation scales with input",
        pressure: "growing" as const,
      }
    : {
        label: "constant",
        detail: "no input-sized auxiliary storage detected",
        pressure: "low" as const,
      };
  return { language, lines, codeLines, maxNesting, recursion, sizedAllocation, time, space, memory, warnings };
}

export const classify = analyze;
