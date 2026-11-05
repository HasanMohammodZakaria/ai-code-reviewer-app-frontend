import { ClipboardPaste, FolderGit2 } from "lucide-react";
import { Card, CardContent } from "../ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { GithubImportForm } from "./github-import-form";
import { PasteProjectForm } from "./paste-project-form";

/** New project: two ways to add code, as tabs (Paste code and GitHub repository) */
export function NewProjectView() {
  return (
    <Card className="max-w-3xl">
      <CardContent className="pt-4 sm:pt-6">
        <Tabs defaultValue="paste">
          <TabsList className="grid w-full grid-cols-2 sm:inline-grid sm:w-auto">
            <TabsTrigger value="paste">
              <ClipboardPaste />
              Paste code
            </TabsTrigger>
            <TabsTrigger value="github">
              <FolderGit2 />
              <span className="sm:hidden">GitHub</span>
              <span className="hidden sm:inline">GitHub repository</span>
            </TabsTrigger>
          </TabsList>

          {/* forceMount keeps both forms alive, so switching tabs never loses what was typed */}
          <TabsContent value="paste" forceMount>
            <PasteProjectForm />
          </TabsContent>
          <TabsContent value="github" forceMount>
            <GithubImportForm />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
