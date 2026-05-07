export default function ArtworkDetails({
  title,
  artist,
  price,
  material,
  size,
  location,
  notFramedNote,
}: {
  title: string;
  artist: string;
  price: number;
  material: string;
  size: string;
  location?: string;
  notFramedNote?: string;
}) {
  return (
    <div>
      <h1 className="text-2xl font-semibold">{title}</h1>
      <p className="text-sm text-gray-500">
        By {artist}
        {location ? ` — ${location}` : ""}
      </p>
      <div className="mt-2">
        <span className="text-red-600 font-bold text-lg">
          LKR {price.toLocaleString("en-LK")}
        </span>{" "}
        <span className="text-sm text-red-500">Price</span>
        <p className="mt-1 text-sm text-gray-600">Material: {material}</p>
        <p className="text-sm text-gray-600">Size: {size}</p>
        {notFramedNote && (
          <p className="text-sm font-medium mt-2">{notFramedNote}</p>
        )}
      </div>
    </div>
  );
}
