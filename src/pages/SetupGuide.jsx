import { CheckCircle, Monitor, Users, MessageSquare, Image, ChevronRight, Tablet, Timer } from "lucide-react";

const steps = [
  {
    number: "1",
    icon: Monitor,
    title: "Set Up Your Rooms",
    color: "bg-blue-600",
    intro: "Start by deciding how many computers, tablets, and phones you plan to use. Each device will be given a room name so you always know exactly where a call is coming from.",
    instructions: [
      "Go into Settings in your Chacer app.",
      "Enter the name for each room or station (e.g., Room 1, Hygiene A, Front Desk, X-Ray).",
      "Each device you install the app on will be assigned one of these room names.",
      "You can add, edit, or remove room names at any time."
    ],
    tip: "Use short, clear names that your team will instantly recognize."
  },
  {
    number: "2",
    icon: Users,
    title: "Add Your Team",
    color: "bg-purple-600",
    intro: "Decide who will be called most often and enter your team members. These are the people who can receive calls and alerts.",
    instructions: [
      "Go to the Team section in Settings.",
      "Add each team member by name (e.g., Dr. A, Dr. B, A-RDH, B-RDH, Any Assistant, Office Manager, Reception, Insurance).",
      "Names can be full names or short abbreviations — whatever fits your workflow.",
      "If the app feels crowded, shorten names (e.g., 'Dr. Anderson' \u2192 'Dr. A').",
      "You can edit team names at any time without losing any history."
    ],
    subSection: {
      title: "Sound Alerts",
      items: [
        "Choose a notification sound for each team member or group.",
        "We recommend using one sound for Doctors, another for Hygienists, and another for Assistants — so staff instantly know who's being called.",
        "Choose from the built-in sound library, or upload your own custom sound file.",
        "Adjust the volume per device to suit your office environment."
      ]
    },
    tip: "Grouping sounds by role (Doctors / Hygiene / Assistants) helps staff react faster without needing to look at the screen."
  },
  {
    number: "3",
    icon: MessageSquare,
    title: "Add Call Reasons",
    color: "bg-green-600",
    intro: "Enter the most common reasons staff use to call team members. These appear as quick-select buttons so calls can be made in seconds.",
    instructions: [
      "Go to Call Reasons in Settings.",
      "Add your most-used reasons (e.g., Patient Ready, Need Anesthesia, Need Something, Check Patient, Urgent).",
      "Reasons are optional — a call can be sent without selecting one.",
      "Staff can also type a custom reason directly on the call screen for unusual situations.",
      "If you notice a reason coming up often, add it to the list for faster access."
    ],
    tip: "Keep reasons short and action-oriented. The goal is one tap, not a paragraph."
  },
  {
    number: "4",
    icon: Image,
    title: "Add Your Logo (Optional)",
    color: "bg-orange-500",
    intro: "Personalize your Chacer app with your office logo. It appears at the top of the app on all devices.",
    instructions: [
      "Go to Branding or Appearance in Settings.",
      "Upload your logo image (PNG or JPG recommended).",
      "Your logo will appear at the top of the call screen on all devices.",
      "You can update or remove your logo at any time."
    ],
    tip: "A logo makes the app feel like your own and helps staff recognize it instantly on shared devices."
  }
];

export default function SetupGuide() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-6 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 text-sm font-medium px-4 py-2 rounded-full mb-4">
            <CheckCircle className="w-4 h-4" />
            Welcome to Chacer
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-3">Getting Started Guide</h1>
          <p className="text-gray-500 text-lg">
            Follow these steps to get your Chacer app fully set up and ready for your team.
            You'll be up and running in under an hour.
          </p>
        </div>

        {/* Steps */}
        <div className="space-y-8">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div key={step.number} className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                {/* Step Header */}
                <div className={`${step.color} px-8 py-5 flex items-center gap-4`}>
                  <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="text-white/70 text-xs font-semibold uppercase tracking-widest">Step {step.number}</div>
                    <h2 className="text-white text-xl font-bold">{step.title}</h2>
                  </div>
                </div>

                {/* Step Content */}
                <div className="px-8 py-6">
                  <p className="text-gray-600 mb-5 leading-relaxed">{step.intro}</p>

                  <ul className="space-y-2.5 mb-5">
                    {step.instructions.map((instruction, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <ChevronRight className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700 text-sm leading-relaxed">{instruction}</span>
                      </li>
                    ))}
                  </ul>

                  {step.subSection && (
                    <div className="bg-gray-50 rounded-xl p-4 mb-5 border border-gray-100">
                      <h3 className="font-semibold text-gray-800 text-sm mb-2">{step.subSection.title}</h3>
                      <ul className="space-y-2">
                        {step.subSection.items.map((item, i) => (
                          <li key={i} className="flex items-start gap-3">
                            <ChevronRight className="w-4 h-4 text-purple-400 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-600 text-sm leading-relaxed">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {step.tip && (
                    <div className="flex items-start gap-3 bg-blue-50 rounded-xl px-4 py-3 border border-blue-100">
                      <CheckCircle className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                      <p className="text-blue-700 text-sm leading-relaxed">
                        <span className="font-semibold">Tip: </span>{step.tip}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer note */}
        <div className="mt-10 text-center">
          <p className="text-gray-400 text-sm">
            Need help? Contact our support team and we'll walk you through setup.
          </p>
        </div>
      </div>
    </div>
  );
}