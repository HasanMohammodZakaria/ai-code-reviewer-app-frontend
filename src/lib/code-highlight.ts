import type { PrismTheme } from "prism-react-renderer";
import type { ProjectLanguage } from "../types/project";

/**
 * Syntax colors for code blocks. Every color is a CSS variable from
 * src/styles/code-theme.css, so the code follows dark and light mode
 * without any re-render and no hex value lives in a component.
 */
export const codeTheme: PrismTheme = {
  plain: {
    color: "var(--code-plain)",
    backgroundColor: "transparent",
  },
  styles: [
    {
      types: ["comment", "prolog", "doctype", "cdata"],
      style: { color: "var(--code-comment)", fontStyle: "italic" },
    },
    {
      types: ["punctuation", "operator"],
      style: { color: "var(--code-operator)" },
    },
    {
      types: ["keyword", "boolean", "important", "atrule"],
      style: { color: "var(--code-keyword)" },
    },
    {
      types: [
        "string",
        "char",
        "attr-value",
        "template-string",
        "regex",
        "url",
      ],
      style: { color: "var(--code-string)" },
    },
    {
      types: ["number", "constant", "symbol"],
      style: { color: "var(--code-number)" },
    },
    {
      types: ["function", "method"],
      style: { color: "var(--code-function)" },
    },
    {
      types: ["class-name", "builtin", "type"],
      style: { color: "var(--code-class)" },
    },
    {
      types: ["tag", "deleted"],
      style: { color: "var(--code-tag)" },
    },
    {
      types: ["attr-name", "property", "inserted"],
      style: { color: "var(--code-attr)" },
    },
  ],
};

/** Grammars that prism-react-renderer bundles by default, plus two fallbacks */
export type PrismLanguage =
  | "javascript"
  | "typescript"
  | "python"
  | "go"
  | "c"
  | "cpp"
  | "clike"
  | "plain";

/**
 * Java, C#, Rust and PHP have no bundled grammar, so they use "clike"
 * (comments, strings, numbers and braces get colors). Ruby and unknown
 * languages stay plain: the text is always readable, only without colors.
 */
const PRISM_LANGUAGES: Record<ProjectLanguage, PrismLanguage> = {
  javascript: "javascript",
  typescript: "typescript",
  python: "python",
  go: "go",
  c: "c",
  cpp: "cpp",
  java: "clike",
  csharp: "clike",
  rust: "clike",
  php: "clike",
  ruby: "plain",
  unknown: "plain",
};

/** The Prism language for a project file's language. Anything unexpected becomes "plain" */
export function getPrismLanguage(language: string): PrismLanguage {
  return PRISM_LANGUAGES[language as ProjectLanguage] ?? "plain";
}
