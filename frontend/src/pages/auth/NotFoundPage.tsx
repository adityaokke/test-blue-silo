import { useNavigate } from "react-router-dom";

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center">
      <div className="text-center">
        <p className="text-6xl font-bold text-slate-700">404</p>
        <p className="text-slate-400 mt-2 mb-6">Page not found</p>
        <button onClick={() => navigate("/tickets")}>
          Back to Tickets
        </button>
      </div>
    </div>
  );
}