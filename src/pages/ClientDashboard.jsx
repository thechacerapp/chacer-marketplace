import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { ExternalLink, CreditCard, CheckCircle, Clock, XCircle, Loader2, Bell, BookOpen, AlertTriangle } from "lucide-react";

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
  const [cancelLoading, setCancelLoading] = useState(false);
  const [cancelConfirm, setCancelConfirm] = useState(false);
  const [cancelResult, setCancelResult] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const isAuthed = await base44.auth.isAuthenticated();
      if (!isAuthed) {
        base44.auth.redirectToLogin(window.location.href);
        return;
      }

      const me = await base44.auth.me();
      setUser(me);

      // Try multiple ways to find the office (case-insensitive email matching)
      let officeList = await base44.entities.Office.filter({ created_by: me.email });
      if (officeList.length === 0) {
        const allOffices = await base44.entities.Office.list();
        officeList = allOffices.filter(o =>
          o.contact_email?.toLowerCase() === me.email?.toLowerCase()
        );
      }
      if (officeList.length === 0) {
        officeList = await base44.entities.Office.filter({ admin_user_id: me.id });
      }
      if (officeList.length > 0) {
        const o = officeList[0];
        setOffice(o);
        const subs = await base44.entities.Subscription.filter({ office_id: o.id });
        if (subs.length > 0) setSubscription(subs[0]);
      }
    } catch (err) {
      console.error("ClientDashboard loadData error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelSubscription = async () => {
    if (!subscription?.stripe_subscription_id) {
      alert("Unable to cancel: no Stripe subscription ID found. Please contact support.");
      setCancelConfirm(false);
      return;
    }
    setCancelLoading(true);
    try {
      const response = await base44.functions.invoke("cancelStripeSubscription", {
        stripe_subscription_id: subscription.stripe_subscription_id,
        office_id: office?.id
      });
      if (response.data?.success) {
        setCancelResult(response.data.access_until);
        await loadData();
      }
    } catch (err) {
      alert("Cancellation failed. Please contact support at admin@thechacerapp.com.");
    } finally {
      setCancelLoading(false);
      setCancelConfirm(false);
    }
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
        <div className="mb-8 flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Welcome back, {user?.full_name || office.name}</h1>
            <p className="text-gray-500 mt-1">Manage your Chacer subscription and access your app.</p>
          </div>
          <Button variant="outline" size="sm" onClick={() => base44.auth.logout("/")}>
            Log Out
          </Button>
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

                </>
              ) : (
                <p className="text-gray-400">No active subscription found.</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Subscribe Now — for manual trial offices with no Stripe subscription */}
        {subscription && subscription.status === 'trialing' && !subscription.stripe_subscription_id && (
          <Card className="mb-6 border-blue-200 bg-blue-50">
            <CardContent className="py-5 flex items-center justify-between gap-4">
              <div>
                <p className="font-semibold text-gray-900 text-sm">Ready to subscribe?</p>
                <p className="text-gray-500 text-xs mt-1">
                  Your trial {subscription.trial_end ? `ends on ${new Date(subscription.trial_end).toLocaleDateString()}` : "is active"}. Set up a payment method to keep your Chacer app running after the trial.
                </p>
              </div>
              <Button
                className="bg-blue-600 hover:bg-blue-700 text-white whitespace-nowrap"
                onClick={() => {
                  const params = new URLSearchParams({
                    existing_office_id: office.id,
                    email: office.contact_email,
                    name: office.name,
                  });
                  window.location.href = `/GetStartedPage?${params.toString()}`;
                }}
              >
                <CreditCard className="w-4 h-4 mr-2" /> Subscribe Now
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Manage Subscription */}
        {subscription && subscription.status !== 'canceled' && subscription.stripe_subscription_id && (
          <Card className="mb-6 border-gray-200">
            <CardHeader>
              <CardTitle className="text-base font-semibold">Manage Subscription</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              {cancelResult ? (
                <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-green-700">
                  <CheckCircle className="w-5 h-5 mb-1" />
                  <p className="font-semibold">Subscription Cancelled</p>
                  <p className="text-sm mt-1">Your Chacer app will remain fully active until <strong>{cancelResult}</strong>. After that date, your access will end.</p>
                </div>
              ) : (
                <>
                  <div className="text-gray-500 space-y-1">
                    <p>
                      Current plan: <span className="font-semibold text-gray-800">{subscription.plan_type}</span>
                      {subscription.status === 'trialing' && subscription.trial_end && (
                        <span className="ml-2 text-blue-600">(Trial ends {new Date(subscription.trial_end).toLocaleDateString()})</span>
                      )}
                    </p>
                    <p className="text-xs text-gray-400">
                      {subscription.billing_interval === 'annual'
                        ? "If you cancel, your app will stay active through the end of your paid year."
                        : subscription.status === 'trialing'
                        ? "If you cancel during your trial, your access will end immediately with no charge."
                        : "If you cancel, your app will stay active through the end of your current month."}
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={openBillingPortal}
                      disabled={portalLoading || !office?.stripe_customer_id}
                      className="flex-1"
                    >
                      {portalLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><CreditCard className="w-4 h-4 mr-2" /> Change Plan / Manage Billing</>}
                    </Button>

                    {!cancelConfirm ? (
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 text-red-600 border-red-200 hover:bg-red-50"
                        onClick={() => setCancelConfirm(true)}
                      >
                        <XCircle className="w-4 h-4 mr-2" /> Cancel Subscription
                      </Button>
                    ) : (
                      <div className="flex-1 bg-red-50 border border-red-200 rounded-lg p-3 space-y-2">
                        <div className="flex items-start gap-2 text-red-700">
                          <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                          <p className="text-xs">
                            Are you sure? {subscription.billing_interval === 'annual'
                              ? "You'll keep access until the end of your paid year."
                              : subscription.status === 'trialing'
                              ? "Your access will end immediately with no charge."
                              : "You'll keep access until the end of your current billing month."}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" className="flex-1 text-xs" onClick={() => setCancelConfirm(false)}>Keep Plan</Button>
                          <Button size="sm" className="flex-1 text-xs bg-red-600 hover:bg-red-700 text-white" onClick={handleCancelSubscription} disabled={cancelLoading}>
                            {cancelLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : "Yes, Cancel"}
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        )}

        {/* Setup Guide */}
        <Card className="mb-6 border-blue-100 bg-blue-50">
          <CardContent className="py-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <BookOpen className="w-5 h-5 text-blue-600 flex-shrink-0" />
              <div>
                <p className="font-semibold text-gray-900 text-sm">Getting Started Guide</p>
                <p className="text-gray-500 text-xs">Step-by-step setup instructions for your Chacer app.</p>
              </div>
            </div>
            <Link to={createPageUrl("SetupGuide")}>
              <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">View Guide</Button>
            </Link>
          </CardContent>
        </Card>

        {/* Chacer App Access */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold">Your Chacer App</CardTitle>
          </CardHeader>
          <CardContent>
            {(() => {
              const isAccessAllowed = ["active", "trialing"].includes(subscription?.status) && office.status !== "suspended" && office.status !== "cancelled";
              if (!isAccessAllowed) {
                return (
                  <div className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-lg p-4">
                    <XCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-semibold text-red-700">Access Suspended</p>
                      <p className="text-xs text-red-500 mt-0.5">Your subscription is no longer active. Please renew to regain access to your Chacer app.</p>
                    </div>
                    <Button size="sm" className="ml-auto bg-blue-600 hover:bg-blue-700 text-white" onClick={() => window.location.href = "/get-started"}>
                      Resubscribe
                    </Button>
                  </div>
                );
              }
              if (office.chacer_app_url) {
                return (
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
                );
              }
              return (
                <div className="text-sm text-gray-500 space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                    <span className="font-medium text-gray-700">Your Chacer app is ready!</span>
                  </div>
                  <ul className="list-disc list-inside space-y-1 text-xs text-gray-500 ml-6">
                    <li><strong>Desktop:</strong> Visit <a href="https://thechacerapp.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">thechacerapp.com</a> to access the desktop version.</li>
                    <li><strong>Android Tablet:</strong> Check your email for the file to install the app on any Android tablet.</li>
                  </ul>
                </div>
              );
            })()}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}