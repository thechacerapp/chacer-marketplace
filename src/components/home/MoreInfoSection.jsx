import { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CheckCircle, Loader2 } from "lucide-react";

export default function MoreInfoSection() {
  const [form, setForm] = useState({ name: "", email: "" });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email) {
      setError("Please enter your name and email.");
      return;
    }
    setLoading(true);
    setError("");

    await base44.functions.invoke("sendContactEmail", {
      name: form.name,
      email: form.email,
      message: "This person is requesting more information about Chacer.",
    });

    setLoading(false);
    setSubmitted(true);
  };

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-md mx-auto px-6 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Want More Info?</h2>
        <p className="text-gray-500 mb-8 text-sm">
          Leave your name and email and we'll reach out to you personally.
        </p>

        {submitted ? (
          <div className="flex flex-col items-center gap-3 text-green-600">
            <CheckCircle className="w-10 h-10" />
            <p className="font-semibold text-lg">Got it! We'll be in touch soon.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              placeholder="Your Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            <Input
              type="email"
              placeholder="Your Email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <Button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold h-11">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Send My Info"}
            </Button>
          </form>
        )}
      </div>
    </section>
  );
}