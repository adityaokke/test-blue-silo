export default function PageError({ message = "Something went wrong." }: { message?: string }) {
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center">
      <p className="text-red-400 text-sm">{message}</p>
    </div>
  );
}
