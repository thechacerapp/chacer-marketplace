import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Loader2, Search, Users, CreditCard, TrendingUp, Building2, ExternalLink, Plus, Pencil, RefreshCw } from "lucide-react";
import { Link } from "react-router-dom";
import OfficeEditDrawer from "@/components/admin/OfficeEditDrawer";
import AddFreeOfficeModal from "@/components/admin/AddFreeOfficeModal";

const statusColors = {
  active: "bg-green-100 text-green-700",
  trialing: "bg-blue-100 text-blue-700",
  past_due: "bg-yellow-100 text-yellow-700",
  canceled: "bg-red-100 text-red-700",
  pending: "bg-gray-100 text-gray-700",
  suspended: "bg-orange-100 text-orange-700"
};

export default function AdminDashboard() {
  const [user, setUser] = useState(null);
  const [offices, setOffices] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [unauthorized, setUnauthorized] = useState(false);
  const [editingOffice, setEditingOffice] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [syncResult, setSyncResult] = useState(null);

  useEffect(() => {
    init();
  }, []);

  const init = async () => {
    const me = await base44.auth.me();
    setUser(me);
    if (me?.role !== "admin") {
      setUnauthorized(true);
      setLoading(false);
      return;
    }
    const [allOffices, allSubs] = await Promise.all([
      base44.entities.Office.list(),
      base44.entities.Subscription.list()
    ]);
    setOffices(allOffices);
    setSubscriptions(allSubs);
    setLoading(false);
  };

  const getSubscription = (officeId) => subscriptions.find(s => s.office_id === officeId);

  const handleSyncToChacerApp = async () => {
    setSyncing(true);
    setSyncResult(null);
    const res = await base44.functions.invoke('pushAllOfficesToChacer', {});
    setSyncing(false);
    setSyncResult(res.data);
  };

  const filteredOffices = offices.filter(o =>
    o.name?.toLowerCase().includes(search.toLowerCase()) ||
    o.contact_email?.toLowerCase().includes(search.toLowerCase())
  );

  const stats = {
    total: offices.length,
    active: subscriptions.filter(s => s.status === "active").length,
    trialing: subscriptions.filter(s => s.status === "trialing").length,
    mrr: subscriptions.filter(s => s.status === "active").reduce((sum, s) => sum + (s.amount || 0), 0)
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (unauthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-xl font-bold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-500">This page is for admins only.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-500 mt-1">Manage all Chacer offices and subscriptions</p>
          </div>
          <div className="flex items-center gap-3">
            <Button onClick={() => setShowAddModal(true)} className="bg-blue-600 hover:bg-blue-700 text-white">
              <Plus className="w-4 h-4 mr-2" /> Add Free Trial Office
            </Button>
            <Button onClick={handleSyncToChacerApp} disabled={syncing} variant="outline" className="border-indigo-300 text-indigo-700 hover:bg-indigo-50">
              {syncing ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <RefreshCw className="w-4 h-4 mr-2" />}
              Sync to ChacerApp
            </Button>
          </div>
        </div>

        {/* Sync result */}
        {syncResult && (
          <div className={`mb-6 px-4 py-3 rounded-lg text-sm flex items-center gap-3 ${syncResult.ok ? 'bg-green-50 border border-green-200 text-green-700' : 'bg-red-50 border border-red-200 text-red-700'}`}>
            {syncResult.ok
              ? `✅ Synced ${syncResult.total} offices to ChacerApp — ${syncResult.created} created, ${syncResult.updated} updated${syncResult.errors?.length ? ` (${syncResult.errors.length} errors)` : ''}`
              : `❌ Sync failed: ${syncResult.error}`}
            <button onClick={() => setSyncResult(null)} className="ml-auto text-gray-400 hover:text-gray-600">✕</button>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total Offices", value: stats.total, icon: Building2, color: "text-blue-600 bg-blue-100" },
            { label: "Active Subscriptions", value: stats.active, icon: CreditCard, color: "text-green-600 bg-green-100" },
            { label: "In Trial", value: stats.trialing, icon: Users, color: "text-purple-600 bg-purple-100" },
            { label: "Monthly Revenue", value: `$${stats.mrr.toFixed(0)}`, icon: TrendingUp, color: "text-yellow-600 bg-yellow-100" }
          ].map(({ label, value, icon: Icon, color }) => (
            <Card key={label}>
              <CardContent className="p-5 flex items-center gap-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">{label}</p>
                  <p className="text-xl font-bold text-gray-900">{value}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Table */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">All Offices</CardTitle>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search offices..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead>Office</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Plan</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Trial Ends</TableHead>
                  <TableHead>App</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOffices.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-gray-400 py-10">No offices found</TableCell>
                  </TableRow>
                ) : filteredOffices.map(office => {
                  const sub = getSubscription(office.id);
                  return (
                    <TableRow key={office.id} className="hover:bg-gray-50">
                      <TableCell>
                        <div>
                          <p className="font-medium text-gray-900">{office.name}</p>
                          <p className="text-xs text-gray-400">{office.contact_email}</p>
                          {office.contact_phone && <p className="text-xs text-gray-400">{office.contact_phone}</p>}
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-gray-600">{office.office_type || "—"}</TableCell>
                      <TableCell className="text-sm text-gray-600">{sub?.plan_type || "—"}</TableCell>
                      <TableCell>
                        <Badge className={statusColors[sub?.status || office.status] || "bg-gray-100 text-gray-600"}>
                          {sub?.status || office.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-gray-500">
                        {sub?.trial_end ? new Date(sub.trial_end).toLocaleDateString() : "—"}
                      </TableCell>
                      <TableCell>
                        {office.chacer_app_url && (
                          <a href={office.chacer_app_url} target="_blank" rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 inline-flex items-center gap-1 text-sm">
                            Open <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </TableCell>
                      <TableCell>
                        <Button size="sm" variant="ghost" onClick={() => setEditingOffice(office)}>
                          <Pencil className="w-4 h-4 text-gray-400" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <AddFreeOfficeModal
        open={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSaved={() => { init(); handleSyncToChacerApp(); }}
      />

      {editingOffice && (
        <OfficeEditDrawer
          office={editingOffice}
          subscription={getSubscription(editingOffice.id)}
          open={!!editingOffice}
          onClose={() => setEditingOffice(null)}
          onSaved={() => { init(); handleSyncToChacerApp(); }}
        />
      )}
    </div>
  );
}