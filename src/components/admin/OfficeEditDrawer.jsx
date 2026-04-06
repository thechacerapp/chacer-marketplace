import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from "@/components/ui/sheet";
import { Loader2, Save } from "lucide-react";

export default function OfficeEditDrawer({ office, subscription, open, onClose, onSaved }) {
  const [officeForm, setOfficeForm] = useState({});
  const [subForm, setSubForm] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (office) {
      setOfficeForm({
        name: office.name || "",
        contact_email: office.contact_email || "",
        contact_phone: office.contact_phone || "",
        office_type: office.office_type || "",
        status: office.status || "pending",
        chacer_app_url: office.chacer_app_url || "",
        chacer_app_id: office.chacer_app_id || "",
      });
    }
    if (subscription) {
      setSubForm({
        plan_type: subscription.plan_type || "",
        status: subscription.status || "trialing",
        billing_interval: subscription.billing_interval || "monthly",
        trial_end: subscription.trial_end || "",
        ends_on_date: subscription.ends_on_date || "",
        amount: subscription.amount || "",
      });
    } else {
      setSubForm({ plan_type: "", status: "trialing", billing_interval: "monthly", trial_end: "", ends_on_date: "", amount: "" });
    }
  }, [office, subscription]);

  const handleSave = async () => {
    setSaving(true);
    await base44.entities.Office.update(office.id, officeForm);
    if (subscription) {
      await base44.entities.Subscription.update(subscription.id, subForm);
    } else if (subForm.plan_type) {
      await base44.entities.Subscription.create({ ...subForm, office_id: office.id });
    }
    setSaving(false);
    onSaved();
    onClose();
  };

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Edit Office — {office?.name}</SheetTitle>
        </SheetHeader>

        <div className="space-y-5 py-6">
          <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Office Details</h3>

          <div className="space-y-3">
            <div>
              <Label>Office Name</Label>
              <Input className="mt-1" value={officeForm.name || ""} onChange={e => setOfficeForm({ ...officeForm, name: e.target.value })} />
            </div>
            <div>
              <Label>Contact Email</Label>
              <Input className="mt-1" value={officeForm.contact_email || ""} onChange={e => setOfficeForm({ ...officeForm, contact_email: e.target.value })} />
            </div>
            <div>
              <Label>Contact Phone</Label>
              <Input className="mt-1" value={officeForm.contact_phone || ""} onChange={e => setOfficeForm({ ...officeForm, contact_phone: e.target.value })} />
            </div>
            <div>
              <Label>Office Type</Label>
              <Select value={officeForm.office_type || ""} onValueChange={v => setOfficeForm({ ...officeForm, office_type: v })}>
                <SelectTrigger className="mt-1"><SelectValue placeholder="Select type" /></SelectTrigger>
                <SelectContent>
                  {["Medical", "Dental", "Legal", "Physical Therapy", "Mental Health", "Veterinary", "General Office", "Other"].map(t => (
                    <SelectItem key={t} value={t}>{t}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Office Status</Label>
              <Select value={officeForm.status || "pending"} onValueChange={v => setOfficeForm({ ...officeForm, status: v })}>
                <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {["pending", "active", "suspended", "cancelled"].map(s => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Chacer App URL</Label>
              <Input className="mt-1" placeholder="https://..." value={officeForm.chacer_app_url || ""} onChange={e => setOfficeForm({ ...officeForm, chacer_app_url: e.target.value })} />
            </div>
            <div>
              <Label>Chacer App ID</Label>
              <Input className="mt-1" value={officeForm.chacer_app_id || ""} onChange={e => setOfficeForm({ ...officeForm, chacer_app_id: e.target.value })} />
            </div>
          </div>

          <hr className="my-2" />
          <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Subscription</h3>

          <div className="space-y-3">
            <div>
              <Label>Plan</Label>
              <Select value={subForm.plan_type || ""} onValueChange={v => setSubForm({ ...subForm, plan_type: v })}>
                <SelectTrigger className="mt-1"><SelectValue placeholder="Select plan" /></SelectTrigger>
                <SelectContent>
                  {["Basic Monthly", "Basic Annual", "Premium Monthly", "Premium Annual", "Free Trial"].map(p => (
                    <SelectItem key={p} value={p}>{p}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Subscription Status</Label>
              <Select value={subForm.status || "trialing"} onValueChange={v => setSubForm({ ...subForm, status: v })}>
                <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {["trialing", "active", "past_due", "canceled", "unpaid"].map(s => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Billing Interval</Label>
              <Select value={subForm.billing_interval || "monthly"} onValueChange={v => setSubForm({ ...subForm, billing_interval: v })}>
                <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="annual">Annual</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Trial End Date</Label>
              <Input className="mt-1" type="date" value={subForm.trial_end || ""} onChange={e => setSubForm({ ...subForm, trial_end: e.target.value })} />
            </div>
            <div>
              <Label>Subscription End Date</Label>
              <Input className="mt-1" type="date" value={subForm.ends_on_date || ""} onChange={e => setSubForm({ ...subForm, ends_on_date: e.target.value })} />
            </div>
            <div>
              <Label>Monthly Amount ($)</Label>
              <Input className="mt-1" type="number" value={subForm.amount || ""} onChange={e => setSubForm({ ...subForm, amount: parseFloat(e.target.value) || "" })} />
            </div>
          </div>
        </div>

        <SheetFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave} disabled={saving} className="bg-blue-600 hover:bg-blue-700 text-white">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Save className="w-4 h-4 mr-2" />Save Changes</>}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}