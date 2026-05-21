interface ArtworkAttributesProps {
  category:    string;
  material:    string;
  size:        string;
  orientation: string | null;
}

export default function ArtworkAttributes({
  category,
  material,
  size,
  orientation,
}: ArtworkAttributesProps) {
  const rows = [
    category    ? { label: "Category",    value: category    } : null,
    material    ? { label: "Material",    value: material    } : null,
    size        ? { label: "Size",        value: size        } : null,
    orientation ? { label: "Orientation", value: orientation } : null,
  ].filter(Boolean) as { label: string; value: string }[];

  return (
    <div className="text-sm text-gray-700 space-y-0.5">
      {rows.map(({ label, value }) => (
        <div key={label} className="flex gap-2">
          <span className="text-gray-400 w-24 shrink-0">{label} :</span>
          <span className="font-medium text-gray-800">{value}</span>
        </div>
      ))}
    </div>
  );
}