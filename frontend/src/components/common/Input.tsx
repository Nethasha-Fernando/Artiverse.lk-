interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

export default function Input({ error, className, ...rest }: InputProps) {
  return (
    <input
      {...rest}
      className={`w-full rounded-xl border bg-white px-3 py-2 text-sm text-gray-800 outline-none transition
        focus:ring-1 focus:ring-red-300
        ${error ? "border-red-400" : "border-gray-200"}
        ${className ?? ""}`}
    />
  );
}