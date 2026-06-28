type Props = {
  text: string;
  query?: string;
};
export default function HighlightText({ text, query }: Props) {
  if (!query) return <>{text}</>;
  const parts = String(text).split(new RegExp(`(${query})`, "gi"));

  return (
    <>
      {parts.map((part, i) =>
        part.toLowerCase() === query.toLowerCase() ? (
          <mark
            key={i}
            className="bg-yellow-200 [html.dark_&]:bg-yellow-200/90 text-white [html.dark_&]:text-foreground rounded-sm"
          >
            {part}
          </mark>
        ) : (
          part
        ),
      )}
    </>
  );
}
