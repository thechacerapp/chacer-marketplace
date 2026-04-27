import { CheckCircle, Monitor, Users, MessageSquare, Image, ChevronRight, Tablet, Timer, AlertTriangle, BatteryCharging, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import ContactButton from "@/components/ContactButton";

const steps = [
  {
    number: "1",
    icon: Tablet,
    title: "Access Your Chacer App",
    color: "bg-sky-600",
    intro: "Before you begin setup, you'll need to open your Chacer app. You can access it on any device using the steps below.",
    instructions: [],
    richInstructions: [
      <span>Desktop version: Go to <a href="https://thechacerapp.com" target="_blank" rel="noopener noreferrer" className="font-bold text-blue-600 underline">thechacerapp.com</a> to access the app from any computer or laptop.</span>,
      <span>Android tablet: Check your email for the install file, or <a href="https://drive.google.com/uc?export=download&id=1-ZRSUQvQjIn2cwEB1AH1LVjUUAR-n7jc" target="_blank" rel="noopener noreferrer" className="font-bold text-blue-600 underline">click here to download the app</a>.</span>,
      "When you log in for the first time, you will be prompted to set a password — make note of it.",
      "Important: Use the same login and password on every device. This is what keeps all your devices connected and communicating with each other.",
      <span>We recommend completing your initial setup on <a href="https://thechacerapp.com" target="_blank" rel="noopener noreferrer" className="font-bold text-blue-600 underline">thechacerapp.com</a> — it's much easier to configure settings from a computer than on a tablet screen.</span>
    ],
    tip: "Do your initial setup on the website — it's much easier than configuring everything on a small tablet screen."
  },
  {
    number: "2",
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
    number: "3",
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
    number: "4",
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
    number: "5",
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
  },
  {
    number: "6",
    icon: Tablet,
    title: "Go Live on Your Devices",
    color: "bg-teal-600",
    intro: "Once your app is built and configured, you can open it on any tablet, phone, or computer in your office. No special installation required — just open your website. We will send you the website link and, if you'd like to use the app on a tablet, a download file as well.",
    instructions: [
      "We will email you your Chacer website link and, if requested, a download file for tablet installation.",
      "To open the app, go to the website link (or open the downloaded app) and log in with the email and password provided to you.",
      "Open your Chacer website or app on each device you plan to use.",
      "Assign the correct room name to each device when prompted.",
      "Set the volume on each device to your preferred level.",
      "You are ready to go — staff can start making and receiving calls immediately.",
      "To make any changes (names, rooms, sounds), go to Settings from any device.",
      "Important: Do not share your Chacer website link publicly. Only give it to people you want to have access to the program."
    ],
    tip: "Bookmark the website on each device so staff can open it with one tap."
  },
  {
    number: "7",
    icon: Timer,
    title: "Using the Timer",
    color: "bg-rose-600",
    intro: "The timer is a hands-free tool built into Chacer, perfect for timing procedures when your hands are busy.",
    instructions: [
      "The timer runs continuously and can be set for the whole office or unique to each room.",
      "It starts at 0:00 and counts up. When it reaches the assigned time, it resets and starts over.",
      "To use it: note the current time and add your desired duration. For example, if the timer reads 4:05 and you need 20 seconds, go until 4:25.",
      "Prefer zero math? Just tap the timer and it resets to zero instantly — then count up from there.",
      "Set your preferred cycle length in Settings (e.g., 5 minutes, 10 minutes).",
      "There are additional timer settings available to customize how it works for your office — explore Settings to find the options that fit your workflow best."
    ],
    subSection: {
      title: "Example Use Case",
      items: [
        "You need to hold bonding agent for 20 seconds with both hands occupied.",
        "Glance at the timer: it reads 4:05.",
        "Wait until it reaches 4:25 — done.",
        "Or tap the timer to reset to 0:00, then wait until it reads 0:20."
      ]
    },
    tip: "The tap-to-reset option is the easiest approach for quick, one-off timings without any math."
  },
  {
    number: "8",
    icon: AlertTriangle,
    title: "Emergency Button",
    color: "bg-red-600",
    intro: "The Emergency Button is a special feature that instantly alerts every team member at once — for those moments when you need all hands on deck.",
    instructions: [
      "The emergency button calls all team members simultaneously, regardless of room or role.",
      "It is activated with a double-tap to prevent accidental triggering.",
      "The emergency alert uses a dedicated sound — we strongly recommend setting it to a siren so it is immediately and unmistakably different from a regular call.",
      "Make sure all devices have their volume turned up so the alert is heard throughout the office.",
      "You can configure the emergency sound in Settings."
    ],
    tip: "A siren-style sound is the best choice — staff will instantly know an emergency alert is different from a normal call, even without looking at the screen."
  },
  {
    number: "9",
    icon: BatteryCharging,
    title: "Tablet Care & Mounting",
    color: "bg-indigo-600",
    intro: "Taking care of your tablets will extend their lifespan and keep Chacer running reliably every day. Here are our top recommendations for setup, placement, and daily habits.",
    instructions: [
      "Turn tablets off at the end of each workday. This extends battery life and gives the device a chance to rest.",
      "Do not leave tablets plugged in and charging 24/7 — this degrades the battery over time. Use a timer outlet or smart plug to limit charging to a few hours per night.",
      "Set screen brightness to a moderate level (around 50–70%) to reduce battery drain and extend screen life.",
      "Set the screen timeout to a long interval (or never) so the app stays visible without staff needing to tap to wake it.",
      "Use Wi-Fi only mode and disable cellular data if the tablet supports it, to conserve battery.",
      "Schedule software updates to run overnight so they never interrupt the workday.",
      "For wall mounting, we strongly recommend 3M Command Strips (velcro-style hangers). They hold tablets securely, require no drilling, and make it easy to remove or reposition the tablet whenever needed."
    ],
    subSection: {
      title: "Smart Charging Solutions & Battery Saver Settings",
      items: [
        "Never leave tablets plugged in 24/7 — constant charging causes battery swelling and significantly shortens lifespan. The goal is to keep the battery between 20% and 80%.",
        "Android Built-In Option: Many Android tablets have a built-in charging protection feature. Go to Settings → Battery → Charge Optimization, then turn on Charging Protection. This automatically limits charging to protect the battery long-term.",
        "Enable Battery Saver Mode: On Android, go to Settings → Battery → Battery Saver and turn it on (or set it to activate automatically below 20%). On iPad, go to Settings → Battery and enable Low Power Mode. This reduces background activity and extends daily battery life.",
        "Reduce Screen Brightness: Lowering brightness to 40–60% is one of the biggest battery savers. Go to Settings → Display → Brightness on both Android and iPad.",
        "Disable Wi-Fi Scanning & Bluetooth when not needed: Go to Settings → Connections and turn off Bluetooth if unused. On Android, go to Settings → Location → Improve Accuracy and disable Wi-Fi and Bluetooth scanning.",
        "Turn Off Background App Refresh: On iPad, go to Settings → General → Background App Refresh and set it to Off or Wi-Fi only. On Android, go to Settings → Apps → (select app) → Battery → Restrict background activity.",
        "Smart Plug + Automation: Use a Kasa Smart Plug or Sonoff S31 paired with Alexa or Home Assistant to automatically turn charging on and off on a schedule.",
        "Dedicated Timer: The Charge-O-Matic is designed specifically for this — set exact on/off hours to prevent overcharging without any smart home setup.",
        "In-Wall Option: Lumary Smart Outlets or Bseed USB wall plates with built-in smart functionality offer a clean, permanent solution.",
        "A simple mechanical timer outlet works too — set it to charge for 3–4 hours overnight and cut off automatically."
      ]
    },
    tip: "3M Command velcro strips are ideal for mounting tablets — no holes, no damage to walls, and easy to move if you rearrange rooms. If you need to use the tablet while gloved, loosely apply a barrier film over the screen before the visit (leave the top and bottom edges loose for easy removal) — the tablet can then be used with gloves on during procedures."
  },
  {
    number: "10",
    icon: AlertTriangle,
    title: "Troubleshooting: Not Receiving or Sending Pages",
    color: "bg-yellow-600",
    intro: "If pages (calls/alerts) are not being sent or received on a device, there are two common causes: no internet connection or no room selected. Work through the steps below to identify and fix the issue.",
    instructions: [
      "Check Internet Connection: Make sure the tablet or device is connected to Wi-Fi. Open a browser and try loading any website. If it doesn't load, reconnect to your Wi-Fi network in Settings → Wi-Fi.",
      "Restart Wi-Fi if needed: Toggle Wi-Fi off and back on in the device's Settings, then reconnect to your office network.",
      "Check that the app is open and visible on the screen — the device must be active (not asleep or locked) to receive pages.",
      "Make sure a Room is selected: Open the Chacer app and look for a room name displayed on the screen. If no room is shown or it says 'Select Room', tap it and choose the correct room for that device.",
      "Every device must have a room assigned — without a room selected, the device cannot send or receive calls.",
      "If the issue persists, close the app completely and reopen it, then verify the room is still selected.",
      "Restart the device if none of the above steps work — a full reboot often resolves connectivity or app state issues.",
      "If you are still having trouble after trying all of these steps, contact Chacer support and we will help you resolve it."
    ],
    subSection: {
      title: "Quick Checklist",
      items: [
        "✅ Device is connected to Wi-Fi and internet is working",
        "✅ Chacer app is open and the screen is not asleep",
        "✅ A room name is selected in the app",
        "✅ Volume is turned up on the receiving device",
        "✅ The correct team member or group is assigned to receive calls"
      ]
    },
    tip: "The two most common issues are: (1) the device lost its Wi-Fi connection, or (2) the room was never selected or got reset. Always check these two things first."
  }
];

export default function SetupGuide() {
  return (
    <div className="min-h-screen bg-gray-50">
      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { background: white !important; }
          .print-card { break-inside: avoid; box-shadow: none !important; border: 1px solid #e5e7eb !important; }
        }
      `}</style>
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
          <Button variant="outline" className="mt-6 no-print" onClick={() => window.print()}>
            <Printer className="w-4 h-4 mr-2" /> Print Guide
          </Button>
        </div>

        {/* Steps */}
        <div className="space-y-8">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div key={step.number} className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden print-card">
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
                    {(step.richInstructions || step.instructions).map((instruction, i) => (
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
      <ContactButton />
    </div>
  );
}