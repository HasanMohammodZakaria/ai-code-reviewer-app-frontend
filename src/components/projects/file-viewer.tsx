import { useState } from "react";
import { FileCode2, Files } from "lucide-react";
import { getLanguageLabel } from "../../lib/languages";
import { pluralize } from "../../lib/format";
import { cn } from "../../lib/utils";
import type { ProjectFile } from "../../types/project";
import { EmptyState } from "../common/empty-state";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { CodeViewer } from "./code-viewer";

type FileViewerProps = {
  files: readonly ProjectFile[];
  className?: string;
};

function countLines(content: string): number {
  return content.replace(/\n$/, "").split("\n").length;
}

/**
 * A project's files: a list to pick from and the selected file's code.
 * Large screens show the list beside the code, small screens a dropdown above it.
 */
export function FileViewer({ files, className }: FileViewerProps) {
  const [selectedPath, setSelectedPath] = useState<string | null>(null);

  if (files.length === 0) {
    return (
      <EmptyState
        icon={Files}
        title="No files"
        description="This project has no files to show."
        className={className}
      />
    );
  }

  // Selection is kept by path, so it survives an edit; a removed file falls back to the first
  const active = files.find((file) => file.path === selectedPath) ?? files[0];
  const lines = countLines(active.content);

  return (
    <div
      className={cn(
        "grid min-w-0 gap-4 lg:grid-cols-[16rem_minmax(0,1fr)]",
        className,
      )}
    >
      <div className="lg:hidden">
        <Select value={active.path} onValueChange={setSelectedPath}>
          <SelectTrigger aria-label="Choose a file" className="font-mono">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {files.map((file) => (
              <SelectItem
                key={file.path}
                value={file.path}
                className="font-mono"
              >
                {file.path}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <nav aria-label="Project files" className="hidden lg:block">
        <p className="mb-2 px-1 text-xs font-medium text-muted-foreground">
          {pluralize(files.length, "file")}
        </p>
        <ul className="max-h-[70vh] space-y-1 overflow-y-auto">
          {files.map((file) => {
            const isActive = file.path === active.path;

            return (
              <li key={file.path}>
                <button
                  type="button"
                  onClick={() => setSelectedPath(file.path)}
                  aria-current={isActive ? "true" : undefined}
                  title={file.path}
                  className={cn(
                    "flex w-full min-w-0 items-center gap-2 rounded-md px-2.5 py-2 text-left text-sm transition-colors",
                    isActive
                      ? "bg-accent text-accent-foreground"
                      : "text-muted-foreground hover:bg-accent/60 hover:text-accent-foreground",
                  )}
                >
                  <FileCode2 className="size-4 shrink-0" aria-hidden="true" />
                  <span className="min-w-0 flex-1 truncate font-mono text-xs">
                    {file.path}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="min-w-0 space-y-2 lg:col-start-2 lg:row-start-1">
        <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
          <p className="min-w-0 break-all font-mono text-sm font-medium text-foreground">
            {active.path}
          </p>
          <p className="text-xs text-muted-foreground">
            {getLanguageLabel(active.language)} · {pluralize(lines, "line")}
          </p>
        </div>
        <CodeViewer
          key={active.path}
          code={active.content}
          language={active.language}
          label={active.path}
        />
      </div>
    </div>
  );
}
