const steps = [
  { step: "1", title: "Sign Up & Install", desc: "Create your account, receive your Chacer devices, and place them throughout your office. Setup takes under 30 minutes." },
  { step: "2", title: "Press a Button", desc: "A patient or staff member presses the call button in any room. The request is sent instantly to your team." },
  { step: "3", title: "Staff Responds", desc: "The right staff member receives an alert on their device and responds — tracked automatically in the dashboard." },
  { step: "4", title: "Review & Improve", desc: "Use the analytics dashboard to identify bottlenecks, improve response times, and delight your clients." }
];

export default function HowItWorksSection() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">How Chacer Works</h2>
          <p className="text-gray-500 text-lg">Up and running in under an hour.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map(({ step, title, desc }) => (
            <div key={step} className="text-center">
              <div className="w-14 h-14 rounded-full bg-blue-600 text-white text-xl font-bold flex items-center justify-center mx-auto mb-4">
                {step}
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}