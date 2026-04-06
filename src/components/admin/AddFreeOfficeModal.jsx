import { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Loader2, UserPlus } from "lucide-react";

export default function AddFreeOfficeModal({ open, onClose, onSaved }) {
  const [form, setForm] = useState({
    name: "",
    contact_email: "",
    contact_phone: "",
    office_type: "",
  });
  const [trialDays, setTrialDays] = useState(30);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleCreate = async () => {
    if (!form.name || !form.contact_email) {
      setError("Office name and email are required.");
      return;
    }
    setSaving(true);
    setError("");

    // Create the office
    const office = await base44.entities.Office.create({
      ...form,
      status: "active",
    });

    // Calculate trial end date
    const trialEnd = new Date();
    trialEnd.setDate(trialEnd.getDate() + Number(trialDays));
    const trialEndStr = trialEnd.toISOString().split("T")[0];

    // Create a free trial subscription
    await base44.entities.Subscription.create({
      office_id: office.id,
      plan_type: "Free Trial",
      status: "trialing",
      billing_interval: "monthly",
      amount: 0,
      trial_start: new Date().toISOString().split("T")[0],
      trial_end: trialEndStr,
    });

    setSaving(false);
    // Reset form
    setForm({ name: "", contact_email: "", contact_phone: "", office_type: "" });
    setTrialDays(30);
    onSaved();
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-blue-600" />
            Add Free Trial Office
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div>
            <Label>Office / Practice Name *</Label>
            <Input className="mt-1" placeholder="Dr. Smith's Dental" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
          </div>
          <div>
            <Label>Contact Email *</Label>
            <Input className="mt-1" type="email" placeholder="admin@office.com" value={form.contact_email} onChange={e => setForm({ ...form, contact_email: e.target.value })} />
          </div>
          <div>
            <Label>Contact Phone</Label>
            <Input className="mt-1" type="tel" placeholder="(555) 123-4567" value={form.contact_phone} onChange={e => setForm({ ...form, contact_phone: e.target.value })} />
          </div>
          <div>
            <Label>Office Type</Label>
            <Select value={form.office_type} onValueChange={v => setForm({ ...form, office_type: v })}>
              <SelectTrigger className="mt-1"><SelectValue placeholder="Select type" /></SelectTrigger>
              <SelectContent>
                {["Medical", "Dental", "Legal", "Physical Therapy", "Mental Health", "Veterinary", "General Office", "Other"].map(t => (
                  <SelectItem key={t} value={t}>{t}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Free Trial Duration (days)</Label>
            <Input className="mt-1" type="number" min={1} value={trialDays} onChange={e => setTrialDays(e.target.value)} />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleCreate} disabled={saving} className="bg-blue-600 hover:bg-blue-700 text-white">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : "Create Free Trial"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}