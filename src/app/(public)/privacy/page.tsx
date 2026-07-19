export default function PrivacyPage() {
  return (
    <main className="px-4 py-16 sm:py-24">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-3xl font-extrabold sm:text-5xl text-neutral-900 dark:text-white">Privacy Policy</h1>
        <p className="mt-2 text-neutral-500">Last updated: July 2026</p>

        <div className="mt-8 space-y-6">
          <section><h2 className="text-xl font-bold text-neutral-900 dark:text-white">1. Information We Collect</h2>
          <p className="mt-2 text-neutral-600 dark:text-neutral-400">We collect information you provide: name, email, phone, school details, and assessment responses. We also collect usage data: pages visited, time spent, device information.</p></section>

          <section><h2 className="text-xl font-bold text-neutral-900 dark:text-white">2. How We Use Your Data</h2>
          <p className="mt-2 text-neutral-600 dark:text-neutral-400">Your assessment data is used to generate reports, calculate mastery scores, and provide recommendations. We do not sell your personal data to third parties. Aggregated, anonymized data may be used for research.</p></section>

          <section><h2 className="text-xl font-bold text-neutral-900 dark:text-white">3. Data Retention</h2>
          <p className="mt-2 text-neutral-600 dark:text-neutral-400">Assessment data is retained for the duration of your account. You may request deletion of your data at any time. School data is retained per the school&apos;s agreement.</p></section>

          <section><h2 className="text-xl font-bold text-neutral-900 dark:text-white">4. AI & Automated Processing</h2>
          <p className="mt-2 text-neutral-600 dark:text-neutral-400">We use AI (via OpenRouter) to generate personalized study recommendations. No assessment responses are used to train AI models. All processing is done on a per-request basis.</p></section>

          <section><h2 className="text-xl font-bold text-neutral-900 dark:text-white">5. Third-Party Services</h2>
          <p className="mt-2 text-neutral-600 dark:text-neutral-400">We use Neon (database), Vercel (hosting), Paystack (payments), and OpenRouter (AI). Each provider has its own privacy policy. Data is processed in accordance with NDPR (Nigeria Data Protection Regulation).</p></section>

          <section><h2 className="text-xl font-bold text-neutral-900 dark:text-white">6. Your Rights</h2>
          <p className="mt-2 text-neutral-600 dark:text-neutral-400">You have the right to access, correct, or delete your data. You may export your assessment history. Contact privacy@deepcheck.app to exercise these rights.</p></section>

          <section><h2 className="text-xl font-bold text-neutral-900 dark:text-white">7. Children&apos;s Privacy</h2>
          <p className="mt-2 text-neutral-600 dark:text-neutral-400">For users under 18, we require parental or school consent. Schools are responsible for obtaining consent for students using their accounts.</p></section>
        </div>
      </div>
    </main>
  );
}
