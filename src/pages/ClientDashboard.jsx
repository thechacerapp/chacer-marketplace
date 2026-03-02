import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ExternalLink, CreditCard, CheckCircle, Clock, XCircle, Loader2, Bell } from "lucide-react";

const statusColors = {
  active: "bg-green-100 text-green-700",
  trialing: "bg-blue-100 text-blue-700",
  past_due: "bg-yellow-100 text-yellow-700",
  canceled: "bg-red-100 text-red-700",
  pending: "bg-gray-100 text-gray-700"
};

const statusIcons = {
  active: CheckCircle,
  trialing: Clock,
  canceled: XCircle,
  past_due: Clock,
  pending: Clock
};

export default function ClientDashboard() {
  const [user, setUser] = useState(null);
  const [office, setOffice] = useState(null);
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [portalLoading, setPortalLoading] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const me = await base44.auth.me();
    setUser(me);

    const offices = await base44.entities.Office.filter({ created_by: me.email });
    if (offices.length > 0) {
      const o = offices[0];
      setOffice(o);
      const subs = await base44.entities.Subscription.filter({ office_id: o.id });
      if (subs.length > 0) setSubscription(subs[0]);
    }
    setLoading(false);
  };

  const openBillingPortal = async () => {
    setPortalLoading(true);
    const response = await base44.functions.invoke("createStripePortalSession", {
      stripe_customer_id: office?.stripe_customer_id
    });
    if (response.data?.url) {
      window.open(response.data.url, "_blank");
    }
    setPortalLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!office) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center">
          <Bell className="w-12 h-12 text-blue-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">No office found</h2>
          <p className="text-gray-500 mb-6">You don't have an office registered yet.</p>
          <Button onClick={() => window.location.href = "/get-started"} className="bg-blue-600 hover:bg-blue-700 text-white">
            Get Started
          </Button>
        </div>
      </div>
    );
  }

  const StatusIcon = statusIcons[subscription?.status || "pending"];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-6 py-10">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Welcome back, {user?.full_name || office.name}</h1>
          <p className="text-gray-500 mt-1">Manage your Chacer subscription and access your app.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Office Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-semibold">Office Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Name</span>
                <span className="font-medium text-gray-900">{office.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Email</span>
                <span className="font-medium text-gray-900">{office.contact_email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Type</span>
                <span className="font-medium text-gray-900">{office.office_type || "—"}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Status</span>
                <Badge className={statusColors[office.status]}>{office.status}</Badge>
              </div>
            </CardContent>
          </Card>

          {/* Subscription Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-semibold">Subscription</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              {subscription ? (
                <>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Plan</span>
                    <span className="font-medium text-gray-900">{subscription.plan_type}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500">Status</span>
                    <div className="flex items-center gap-1.5">
                      <StatusIcon className="w-4 h-4" />
                      <Badge className={statusColors[subscription.status]}>{subscription.status}</Badge>
                    </div>
                  </div>
                  {subscription.trial_end && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">Trial Ends</span>
                      <span className="font-medium text-gray-900">{new Date(subscription.trial_end).toLocaleDateString()}</span>
                    </div>
                  )}
                  {subscription.amount && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">Billing</span>
                      <span className="font-medium text-gray-900">${subscription.amount}/mo</span>
                    </div>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={openBillingPortal}
                    disabled={portalLoading || !office?.stripe_customer_id}
                    className="w-full mt-2"
                  >
                    {portalLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><CreditCard className="w-4 h-4 mr-2" /> Manage Billing</>}
                  </Button>
                </>
              ) : (
                <p className="text-gray-400">No active subscription found.</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Chacer App Access */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold">Your Chacer App</CardTitle>
          </CardHeader>
          <CardContent>
            {office.chacer_app_url ? (
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Your dedicated Chacer instance is ready.</p>
                  <p className="text-xs text-gray-400 font-mono">{office.chacer_app_url}</p>
                </div>
                <Button
                  onClick={() => window.open(office.chacer_app_url, "_blank")}
                  className="bg-blue-600 hover:bg-blue-700 text-white ml-4"
                >
                  Open App <ExternalLink className="ml-2 w-4 h-4" />
                </Button>
              </div>
            ) : (
              <div className="text-sm text-gray-500 flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-blue-400" />
                Your Chacer app is being provisioned. This usually takes a few minutes after payment confirmation.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}