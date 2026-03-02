import { Bell, Wifi, BarChart2, Shield, Clock, Smartphone } from "lucide-react";

const features = [
  {
    icon: Bell,
    title: "One-Press Calling",
    desc: "Patients and staff press a single button to alert the right team member — no shouting, no overhead paging.",
    color: "bg-blue-100 text-blue-600"
  },
  {
    icon: Wifi,
    title: "Wireless & Easy Setup",
    desc: "No wiring required. Place buttons anywhere in minutes. Works on your existing WiFi network.",
    color: "bg-indigo-100 text-indigo-600"
  },
  {
    icon: Smartphone,
    title: "Real-Time Alerts",
    desc: "Staff receive instant notifications on their devices the moment a button is pressed.",
    color: "bg-purple-100 text-purple-600"
  },
  {
    icon: BarChart2,
    title: "Response Analytics",
    desc: "Track response times, busiest rooms, and staff performance to optimize your workflow.",
    color: "bg-green-100 text-green-600"
  },
  {
    icon: Clock,
    title: "Reduce Wait Times",
    desc: "Cut patient wait times and improve satisfaction scores with faster staff response.",
    color: "bg-yellow-100 text-yellow-600"
  },
  {
    icon: Shield,
    title: "HIPAA Friendly",
    desc: "Built with privacy in mind. No patient data transmitted through the call system.",
    color: "bg-red-100 text-red-600"
  }
];

export default function FeaturesSection() {
  return (
    <section className="py-24 bg-gray-50">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Everything Your Office Needs</h2>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">From medical clinics to law firms — Chacer works in any environment where communication matters.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map(({ icon: Icon, title, desc, color }) => (
            <div key={title} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${color}`}>
                <Icon className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
              <p className="text-gray-500 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}