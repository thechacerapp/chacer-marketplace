import { useState } from "react";
import { MessageCircle, X, Send, Loader2 } from "lucide-react";
import { base44 } from "@/api/base44Client";

export default function ContactButton() {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    await base44.integrations.Core.SendEmail({
      to: "admin@thechacerapp.com",
      from_name: "Chacer Website",
      subject: `Contact Request from ${form.name}`,
      body: `Name: ${form.name}\nEmail: ${form.email}\n\nMessage:\n${form.message}`,
    });
    setSending(false);
    setSent(true);
    setTimeout(() => {
      setSent(false);
      setOpen(false);
      setForm({ name: "", email: "", message: "" });
    }, 2500);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {open && (
        <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 w-80 overflow-hidden">
          <div className="bg-blue-600 px-4 py-3 flex items-center justify-between">
            <span className="text-white font-semibold text-sm">Contact Us</span>
            <button onClick={() => setOpen(false)} className="text-white/80 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>

          {sent ? (
            <div className="p-6 text-center">
              <div className="text-green-500 text-3xl mb-2">✓</div>
              <p className="text-gray-700 font-medium">Message sent!</p>
              <p className="text-gray-500 text-sm mt-1">We'll get back to you shortly.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="p-4 space-y-3">
              <input
                required
                placeholder="Your name"
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                required
                type="email"
                placeholder="Your email"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <textarea
                required
                placeholder="How can we help?"
                rows={3}
                value={form.message}
                onChange={e => setForm({ ...form, message: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
              <button
                type="submit"
                disabled={sending}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg py-2 text-sm font-medium flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                {sending ? "Sending..." : "Send Message"}
              </button>
            </form>
          )}
        </div>
      )}

      <button
        onClick={() => setOpen(!open)}
        className="bg-blue-600 hover:bg-blue-700 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg transition-transform hover:scale-105"
      >
        {open ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </button>
    </div>
  );
}