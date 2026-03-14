// import { useEffect, useState } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import { useAuthStore } from "../../store/auth";
// import type { ITicket } from "../../types/ticket";
// import { ticketService } from "../../services/ticket";

// export default function UpdateTicketPage() {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const user = useAuthStore((state) => state.user);

//   const [ticket, setTicket] = useState<ITicket | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [submitting, setSubmitting] = useState(false);
//   const [error, setError] = useState("");

//   // ─── L1 fields ───────────────────────────────────────────────────
//   const [status, setStatus] = useState("");

//   // ─── L2 fields ───────────────────────────────────────────────────
//   const [criticalValue, setCriticalValue] = useState("");
//   const [note, setNote] = useState("");

//   // ─── L3 fields ───────────────────────────────────────────────────
//   const [resolveNote, setResolveNote] = useState("");

//   // ─── Escalate ─────────────────────────────────────────────────────
//   const [escalateNote, setEscalateNote] = useState("");

//   useEffect(() => {
//     if (id) fetchTicket(id);
//   }, [id]);

//   const fetchTicket = async (ticketId: string) => {
//     setLoading(true);
//     try {
//       const res = await ticketService.getById(ticketId);
//       setTicket(res.data);
//       setStatus(res.data.status);
//       setCriticalValue(res.data.criticalValue ?? "");
//     } catch {
//       setError("Failed to load ticket.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleUpdateStatus = async () => {
//     if (!id) return;
//     setSubmitting(true);
//     try {
//       await ticketService.updateStatus(id, { status: status as any });
//       navigate(`/tickets/${id}`);
//     } catch {
//       setError("Failed to update status.");
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   const handleAssignCritical = async () => {
//     if (!id || !criticalValue) return;
//     setSubmitting(true);
//     try {
//       await ticketService.assignCriticalValue(id, {
//         criticalValue: criticalValue as any,
//         note,
//       });
//       navigate(`/tickets/${id}`);
//     } catch {
//       setError("Failed to assign critical value.");
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   const handleEscalate = async () => {
//     if (!id || !escalateNote) return;
//     setSubmitting(true);
//     try {
//       await ticketService.escalate(id, { note: escalateNote });
//       navigate(`/tickets/${id}`);
//     } catch {
//       setError("Failed to escalate ticket.");
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   const handleResolve = async () => {
//     if (!id || !resolveNote) return;
//     setSubmitting(true);
//     try {
//       await ticketService.resolve(id, { note: resolveNote });
//       navigate(`/tickets/${id}`);
//     } catch {
//       setError("Failed to resolve ticket.");
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-slate-950 flex items-center justify-center">
//         <p className="text-slate-500 text-sm">Loading...</p>
//       </div>
//     );
//   }

//   if (!ticket) {
//     return (
//       <div className="min-h-screen bg-slate-950 flex items-center justify-center">
//         <p className="text-red-400 text-sm">Ticket not found.</p>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-slate-950 text-slate-200">

//       {/* Topbar */}
//       <header className="border-b border-slate-800 px-6 py-4 flex items-center gap-3">
//         <button
//           onClick={() => navigate(`/tickets/${id}`)}
//           className="text-slate-500 hover:text-slate-300 transition-colors text-sm"
//         >
//           ← Back
//         </button>
//         <span className="text-slate-700">|</span>
//         <span className="text-xs text-slate-500 font-mono">{ticket.id}</span>
//         <span className="text-slate-700">|</span>
//         <span className="text-xs text-slate-400">Update Ticket</span>
//       </header>

//       <main className="max-w-xl mx-auto px-6 py-8 space-y-5">

//         {error && (
//           <div className="px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
//             {error}
//           </div>
//         )}

//         {/* Ticket summary */}
//         <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
//           <p className="text-xs text-slate-500 uppercase tracking-widest mb-1">Ticket</p>
//           <p className="text-white font-semibold">{ticket.title}</p>
//           <p className="text-slate-500 text-xs mt-1">
//             Level: {ticket.currentLevel} · Status: {ticket.status}
//           </p>
//         </div>

//         {/* ── L1: Update Status ── */}
//         {user?.role.level === "L1" && (
//           <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
//             <p className="text-xs text-slate-400 uppercase tracking-widest font-medium">
//               Update Status
//             </p>
//             <select
//               value={status}
//               onChange={(e) => setStatus(e.target.value)}
//               className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-sky-500 transition-colors"
//             >
//               <option value="New">New</option>
//               <option value="Attending">Attending</option>
//               <option value="Completed">Completed</option>
//             </select>
//             <button
//               onClick={handleUpdateStatus}
//               disabled={submitting}
//               className="w-full bg-sky-500 hover:bg-sky-400 disabled:opacity-50 text-white text-sm font-semibold py-2.5 rounded-lg transition-colors"
//             >
//               {submitting ? "Updating..." : "Update Status"}
//             </button>
//           </div>
//         )}

//         {/* ── L1: Escalate to L2 ── */}
//         {user?.role.level === "L1" && ticket.currentLevel === "L1" && (
//           <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
//             <p className="text-xs text-slate-400 uppercase tracking-widest font-medium">
//               Escalate to L2
//             </p>
//             <textarea
//               value={escalateNote}
//               onChange={(e) => setEscalateNote(e.target.value)}
//               placeholder="Reason for escalation..."
//               rows={3}
//               className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-sky-500 transition-colors resize-none"
//             />
//             <button
//               onClick={handleEscalate}
//               disabled={submitting || !escalateNote}
//               className="w-full bg-orange-500 hover:bg-orange-400 disabled:opacity-50 text-white text-sm font-semibold py-2.5 rounded-lg transition-colors"
//             >
//               {submitting ? "Escalating..." : "Escalate to L2"}
//             </button>
//           </div>
//         )}

//         {/* ── L2: Assign Critical Value ── */}
//         {user?.role.level === "L2" && (
//           <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
//             <p className="text-xs text-slate-400 uppercase tracking-widest font-medium">
//               Assign Critical Value
//             </p>
//             <select
//               value={criticalValue}
//               onChange={(e) => setCriticalValue(e.target.value)}
//               className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-sky-500 transition-colors"
//             >
//               <option value="" disabled>Select...</option>
//               <option value="C1">C1 — System Down</option>
//               <option value="C2">C2 — Partial Issue</option>
//               <option value="C3">C3 — Minor Problem</option>
//             </select>
//             <textarea
//               value={note}
//               onChange={(e) => setNote(e.target.value)}
//               placeholder="Optional note..."
//               rows={2}
//               className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-sky-500 transition-colors resize-none"
//             />
//             <button
//               onClick={handleAssignCritical}
//               disabled={submitting || !criticalValue}
//               className="w-full bg-sky-500 hover:bg-sky-400 disabled:opacity-50 text-white text-sm font-semibold py-2.5 rounded-lg transition-colors"
//             >
//               {submitting ? "Assigning..." : "Assign Critical Value"}
//             </button>
//           </div>
//         )}

//         {/* ── L2: Escalate to L3 ── */}
//         {user?.role.level === "L2" &&
//           ticket.currentLevel === "L2" &&
//           (ticket.criticalValue === "C1" || ticket.criticalValue === "C2") && (
//           <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
//             <p className="text-xs text-slate-400 uppercase tracking-widest font-medium">
//               Escalate to L3
//             </p>
//             <textarea
//               value={escalateNote}
//               onChange={(e) => setEscalateNote(e.target.value)}
//               placeholder="Reason for escalation..."
//               rows={3}
//               className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-sky-500 transition-colors resize-none"
//             />
//             <button
//               onClick={handleEscalate}
//               disabled={submitting || !escalateNote}
//               className="w-full bg-orange-500 hover:bg-orange-400 disabled:opacity-50 text-white text-sm font-semibold py-2.5 rounded-lg transition-colors"
//             >
//               {submitting ? "Escalating..." : "Escalate to L3"}
//             </button>
//           </div>
//         )}

//         {/* ── L3: Resolve Ticket ── */}
//         {user?.role.level === "L3" && ticket.currentLevel === "L3" && (
//           <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
//             <p className="text-xs text-slate-400 uppercase tracking-widest font-medium">
//               Resolve Ticket
//             </p>
//             <textarea
//               value={resolveNote}
//               onChange={(e) => setResolveNote(e.target.value)}
//               placeholder="Describe the resolution..."
//               rows={3}
//               className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-sky-500 transition-colors resize-none"
//             />
//             <button
//               onClick={handleResolve}
//               disabled={submitting || !resolveNote}
//               className="w-full bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-white text-sm font-semibold py-2.5 rounded-lg transition-colors"
//             >
//               {submitting ? "Resolving..." : "Resolve Ticket"}
//             </button>
//           </div>
//         )}

//       </main>
//     </div>
//   );
// }