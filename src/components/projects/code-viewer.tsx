import { Highlight } from "prism-react-renderer";
import "../../styles/code-theme.css";
import { codeTheme, getPrismLanguage } from "../../lib/code-highlight";
import { cn } from "../../lib/utils";

type CodeViewerProps = {
  code: string;
  /** The file's language from the API, e.g. "python" */
  language: string;
  /** Accessible name of the code area, e.g. the file path */
  label: string;
  className?: string;
};

/**
 * Read-only code with line numbers, in JetBrains Mono. Long lines scroll
 * sideways inside the block, so the page itself never scrolls sideways.
 */
export function CodeViewer({
  code,
  language,
  label,
  className,
}: CodeViewerProps) {
  // A final newline would show as one extra empty numbered line
  const source = code.replace(/\n$/, "");

  return (
    <div
      role="region"
      aria-label={label}
      tabIndex={0}
      className={cn(
        "max-h-[70vh] overflow-auto rounded-lg border border-border bg-background",
        "focus-visible:border-ring focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40",
        className,
      )}
    >
      <Highlight
        theme={codeTheme}
        code={source}
        language={getPrismLanguage(language)}
      >
        {({
          className: preClassName,
          style,
          tokens,
          getLineProps,
          getTokenProps,
        }) => (
          <pre
            className={cn(
              preClassName,
              "m-0 w-max min-w-full py-3 font-mono text-xs leading-6 sm:text-sm",
            )}
            style={style}
          >
            {tokens.map((line, lineIndex) => (
              <div key={lineIndex} {...getLineProps({ line })} className="flex">
                <span
                  aria-hidden="true"
                  className="sticky left-0 w-14 shrink-0 select-none bg-background pr-4 text-right text-muted-foreground"
                >
                  {lineIndex + 1}
                </span>
                <span className="whitespace-pre pr-4">
                  {line.map((token, tokenIndex) => (
                    <span key={tokenIndex} {...getTokenProps({ token })} />
                  ))}
                </span>
              </div>
            ))}
          </pre>
        )}
      </Highlight>
    </div>
  );
}
