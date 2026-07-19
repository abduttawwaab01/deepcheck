import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function AboutPage() {
  return (
    <main className="px-4 py-16 sm:py-24">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-3xl font-extrabold sm:text-5xl text-neutral-900 dark:text-white">About Deep Check</h1>
        <p className="mt-4 text-lg text-neutral-500">Empowering Nigerian students with AI-powered assessment analytics that reveal hidden learning gaps.</p>

        <div className="mt-12 space-y-12">
          <section>
            <h2 className="text-xl font-bold sm:text-2xl text-neutral-900 dark:text-white">Our Mission</h2>
            <p className="mt-3 text-neutral-600 dark:text-neutral-400 leading-relaxed">
              Deep Check exists to transform how Nigerian students understand their own learning. Every year, millions of students sit for WASSCE, NECO, and JAMB exams without knowing where their true gaps lie. We use adaptive assessments powered by Item Response Theory — not just AI — to pinpoint exactly what each student doesn&apos;t know, and deliver personalized study plans that work.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold sm:text-2xl text-neutral-900 dark:text-white">Why We&apos;re Different</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {[
                { title: "IRT-Based, Not Just AI", desc: "Our core engine uses Item Response Theory (psychometrics), not black-box AI. That means every score is statistically valid." },
                { title: "Built for Nigeria", desc: "WASSCE, NECO, and JAMB-aligned content. Questions mapped to Bloom's Taxonomy. Pricing in Naira." },
                { title: "Deep, Not Surface", desc: "We measure concept-level mastery, cognitive skills, and learning trajectories. Not just a percentage." },
                { title: "Free to Start", desc: "Every student gets a free basic assessment and report card. Deep Reports cost just ₦3,000." },
              ].map((item) => (
                <div key={item.title} className="glass rounded-2xl p-5">
                  <h3 className="font-bold text-neutral-900 dark:text-white">{item.title}</h3>
                  <p className="mt-2 text-sm text-neutral-500">{item.desc}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="text-center">
            <h2 className="text-xl font-bold sm:text-2xl text-neutral-900 dark:text-white">Ready to start learning?</h2>
            <p className="mt-2 text-neutral-500">Join thousands of Nigerian students discovering their true potential.</p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link href="/auth/register"><Button size="lg">Get Started Free</Button></Link>
              <Link href="/for-schools"><Button variant="outline" size="lg">For Schools</Button></Link>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
