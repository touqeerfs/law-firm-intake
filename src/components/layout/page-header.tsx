type PageHeaderProps = {
  title: string;
};

export function PageHeader({ title }: PageHeaderProps) {
  return (
    <header className="mb-4.5">
      <h1 className="font-display text-2xl font-semibold tracking-tight desktop:text-3xl">
        {title}
      </h1>
    </header>
  );
}
