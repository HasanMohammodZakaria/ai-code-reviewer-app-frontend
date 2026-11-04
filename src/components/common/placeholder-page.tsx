type PlaceholderPageProps = {
  title: string;
};

/** Temporary. Each use is replaced by a real page in Phase 4 and 5. */
export function PlaceholderPage({ title }: PlaceholderPageProps) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-8">
      <p className="text-lg font-medium text-foreground">{title}</p>
    </div>
  );
}
