import { useState } from "react";
import { HelpCircle, X, Send, Loader2 } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export default function NeedHelpButton() {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    try {
      await base44.functions.invoke("sendContactEmail", {
        name: form.name,
        email: form.email,
        message: form.message,
      });
    } catch (err) {
      // Save directly to DB as fallback if function fails
      await base44.entities.ContactMessage.create({
        name: form.name,
        email: form.email,
        message: form.message,
      });
    }
    setSending(false);
    setSent(true);
    setTimeout(() => {
      setSent(false);
      setOpen(false);
      setForm({ name: "", email: "", message: "" });
    }, 2500);
  };

  return (
    <>
      <Button
        size="sm"
        variant="outline"
        onClick={() => setOpen(true)}
        className="border-white/40 text-white hover:bg-white hover:text-blue-900 bg-white/10 gap-2"
      >
        <HelpCircle className="w-4 h-4" /> Need Help? Contact Us
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Contact Us</DialogTitle>
          </DialogHeader>
          {sent ? (
            <div className="py-8 text-center">
              <div className="text-green-500 text-4xl mb-3">✓</div>
              <p className="text-gray-700 font-medium">Message sent!</p>
              <p className="text-gray-500 text-sm mt-1">We'll get back to you shortly.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 mt-2">
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
                rows={4}
                value={form.message}
                onChange={e => setForm({ ...form, message: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
              <Button type="submit" disabled={sending} className="w-full gap-2">
                {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                {sending ? "Sending..." : "Send Message"}
              </Button>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}