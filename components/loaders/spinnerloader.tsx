export function SpinnerLoader({ description }: { description?: string }) {
  return (
    <div className="py-8 text-center">
      <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      {description && (
        <p className="mt-2 text-muted-foreground">
          {description || 'Loading...'}
        </p>
      )}
    </div>
  );
}
