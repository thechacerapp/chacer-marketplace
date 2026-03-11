export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-6 py-16">
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 md:p-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Privacy Policy</h1>
          <p className="text-sm text-gray-400 mb-8">Last updated: March 11, 2026</p>

          <p className="text-gray-600 leading-relaxed mb-8">
            Chacer ("we," "our," or "us") operates the Chacer web application and mobile application (the "Service"). This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our Service. Please read this policy carefully. If you disagree with its terms, please discontinue use of the Service.
          </p>

          <Section title="1. Information We Collect">
            <p>We collect the following types of information:</p>
            <SubSection title="a) Information You Provide Directly">
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>Account Information:</strong> Name, email address, phone number, and office/practice name when you register.</li>
                <li><strong>Payment Information:</strong> Billing details processed securely through Stripe. We do not store full credit card numbers on our servers.</li>
                <li><strong>Office Configuration:</strong> Room names, team member names, call reasons, and other settings you configure within the app.</li>
              </ul>
            </SubSection>
            <SubSection title="b) Information Collected Automatically">
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>Usage Data:</strong> Pages visited, features used, call logs (room-to-room only), and response times within the app.</li>
                <li><strong>Device Information:</strong> Device type, operating system, browser type, and IP address.</li>
                <li><strong>Log Data:</strong> Server logs including access times and error reports.</li>
              </ul>
            </SubSection>
          </Section>

          <Section title="2. How We Use Your Information">
            <p>We use the information we collect to:</p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li>Provide, operate, and maintain the Chacer Service</li>
              <li>Process transactions and manage your subscription via Stripe</li>
              <li>Send you account-related emails (receipts, trial reminders, support)</li>
              <li>Respond to your comments and questions</li>
              <li>Monitor and analyze usage to improve the Service</li>
              <li>Detect and prevent fraudulent or unauthorized activity</li>
              <li>Comply with applicable laws and regulations</li>
            </ul>
            <p className="mt-3 text-gray-600">We do <strong>not</strong> sell your personal information to third parties.</p>
          </Section>

          <Section title="3. Patient Data & HIPAA">
            <p>
              Chacer is designed as an internal staff communication tool. <strong>No patient names, medical records, diagnoses, or protected health information (PHI) are transmitted through Chacer.</strong> Call buttons and alerts contain only room names and call reasons defined by your office staff — no patient-identifiable information.
            </p>
            <p className="mt-3">
              If your practice is subject to HIPAA, you are responsible for ensuring that no PHI is entered into Chacer's configurable fields (room names, team names, call reasons).
            </p>
          </Section>

          <Section title="4. Sharing Your Information">
            <p>We may share your information only in the following circumstances:</p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li><strong>Service Providers:</strong> Trusted third parties that assist in operating the Service, including Stripe (payment processing) and cloud hosting providers. These parties are bound by confidentiality obligations.</li>
              <li><strong>Legal Requirements:</strong> If required by law, court order, or governmental authority.</li>
              <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets, your information may be transferred.</li>
              <li><strong>With Your Consent:</strong> For any other purpose with your explicit consent.</li>
            </ul>
          </Section>

          <Section title="5. Data Retention">
            <p>
              We retain your personal information for as long as your account is active or as needed to provide the Service. If you cancel your subscription, we may retain certain data for up to 90 days before deletion, unless a longer retention period is required by law.
            </p>
          </Section>

          <Section title="6. Data Security">
            <p>
              We implement commercially reasonable technical and organizational measures to protect your information against unauthorized access, alteration, disclosure, or destruction. All data is transmitted over HTTPS. Payment data is handled exclusively by Stripe, which is PCI-DSS compliant.
            </p>
            <p className="mt-3">
              However, no method of transmission over the Internet or electronic storage is 100% secure. We cannot guarantee absolute security.
            </p>
          </Section>

          <Section title="7. Your Rights & Choices">
            <p>Depending on your location, you may have the right to:</p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li><strong>Access</strong> the personal data we hold about you</li>
              <li><strong>Correct</strong> inaccurate or incomplete data</li>
              <li><strong>Delete</strong> your account and associated data</li>
              <li><strong>Opt out</strong> of non-essential communications</li>
              <li><strong>Port</strong> your data in a machine-readable format</li>
            </ul>
            <p className="mt-3">To exercise any of these rights, contact us at <a href="mailto:thechacerapp@gmail.com" className="text-blue-600 underline">thechacerapp@gmail.com</a>.</p>
          </Section>

          <Section title="8. Children's Privacy">
            <p>
              Chacer is not directed to children under the age of 13. We do not knowingly collect personal information from children under 13. If we become aware that we have inadvertently collected such information, we will take steps to delete it promptly.
            </p>
          </Section>

          <Section title="9. Third-Party Services">
            <p>Our Service integrates with the following third-party services, each governed by their own privacy policies:</p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li><strong>Stripe</strong> — Payment processing (<a href="https://stripe.com/privacy" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">stripe.com/privacy</a>)</li>
              <li><strong>Google Play</strong> — Mobile app distribution (<a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">policies.google.com/privacy</a>)</li>
            </ul>
          </Section>

          <Section title="10. Changes to This Policy">
            <p>
              We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the new policy on this page and updating the "Last updated" date. Your continued use of the Service after changes are posted constitutes your acceptance of the updated policy.
            </p>
          </Section>

          <Section title="11. Contact Us">
            <p>If you have any questions or concerns about this Privacy Policy, please contact us:</p>
            <div className="mt-3 bg-gray-50 rounded-xl p-4 border border-gray-100">
              <p className="font-semibold text-gray-800">Chacer</p>
              <p className="text-gray-600">Email: <a href="mailto:thechacerapp@gmail.com" className="text-blue-600 underline">thechacerapp@gmail.com</a></p>
              <p className="text-gray-600">Website: <a href="https://thechacer.com" className="text-blue-600 underline">thechacer.com</a></p>
            </div>
          </Section>
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div className="mb-8">
      <h2 className="text-xl font-bold text-gray-900 mb-3">{title}</h2>
      <div className="text-gray-600 leading-relaxed space-y-2">{children}</div>
    </div>
  );
}

function SubSection({ title, children }) {
  return (
    <div className="mt-3">
      <h3 className="font-semibold text-gray-800 mb-1">{title}</h3>
      <div className="text-gray-600">{children}</div>
    </div>
  );
}