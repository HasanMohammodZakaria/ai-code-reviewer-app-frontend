import type { ProjectLanguage } from "../types/project";

/** Languages the Paste code form offers ("unknown" is only ever set by the server) */
export type PasteLanguage = Exclude<ProjectLanguage, "unknown">;

export type LanguageOption = {
  value: PasteLanguage;
  label: string;
  /** With the leading dot, as the backend brief lists it */
  extension: string;
};

export const LANGUAGE_OPTIONS: readonly LanguageOption[] = [
  { value: "javascript", label: "JavaScript", extension: ".js" },
  { value: "typescript", label: "TypeScript", extension: ".ts" },
  { value: "python", label: "Python", extension: ".py" },
  { value: "java", label: "Java", extension: ".java" },
  { value: "go", label: "Go", extension: ".go" },
  { value: "ruby", label: "Ruby", extension: ".rb" },
  { value: "php", label: "PHP", extension: ".php" },
  { value: "c", label: "C", extension: ".c" },
  { value: "cpp", label: "C++", extension: ".cpp" },
  { value: "csharp", label: "C#", extension: ".cs" },
  { value: "rust", label: "Rust", extension: ".rs" },
];

export const DEFAULT_PASTE_LANGUAGE: PasteLanguage = "javascript";

const KNOWN_EXTENSIONS: readonly string[] = LANGUAGE_OPTIONS.map(
  (option) => option.extension,
);

export function isPasteLanguage(value: string): value is PasteLanguage {
  return LANGUAGE_OPTIONS.some((option) => option.value === value);
}

/** "JavaScript", "C++"... or "Unknown" for a language the form does not offer */
export function getLanguageLabel(language: ProjectLanguage): string {
  return (
    LANGUAGE_OPTIONS.find((option) => option.value === language)?.label ??
    "Unknown"
  );
}

export function getLanguageExtension(language: PasteLanguage): string {
  return (
    LANGUAGE_OPTIONS.find((option) => option.value === language)?.extension ??
    ""
  );
}

/** "main.py" for the first file, "file-2.py", "file-3.py"... for the others */
export function defaultFileName(
  language: PasteLanguage,
  index: number,
): string {
  const extension = getLanguageExtension(language);
  return index === 0 ? `main${extension}` : `file-${index + 1}${extension}`;
}

/**
 * The `path` sent to the API for a pasted file, always ending with the
 * selected language's extension (the server detects the language from it).
 *
 * - empty name: "main.py" for the first file, "file-2.py" for the second...
 * - "app" with Python selected: "app.py"
 * - "app.py" with Python selected: unchanged
 * - "app.js" with Python selected: "app.py" (a known extension of another
 *   language is replaced, so the path always matches the selected language)
 * - "utils.test" with JavaScript selected: "utils.test.js" (other dots stay)
 */
export function buildFilePath(
  name: string,
  language: PasteLanguage,
  index = 0,
): string {
  const trimmed = name.trim().replace(/\.+$/, "");
  const lower = trimmed.toLowerCase();
  const extension = getLanguageExtension(language);

  // Nothing typed, or only an extension such as ".py"
  if (trimmed === "" || KNOWN_EXTENSIONS.includes(lower)) {
    return defaultFileName(language, index);
  }

  if (lower.endsWith(extension)) return trimmed;

  const other = KNOWN_EXTENSIONS.find((known) => lower.endsWith(known));
  const stem = other
    ? trimmed.slice(0, trimmed.length - other.length)
    : trimmed;
  return `${stem}${extension}`;
}
