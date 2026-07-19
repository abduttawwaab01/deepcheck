"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function ContactPage() {
  return (
    <main className="px-4 py-16 sm:py-24">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-3xl font-extrabold sm:text-5xl text-neutral-900 dark:text-white">Contact Us</h1>
        <p className="mt-4 text-lg text-neutral-500">Have questions? We&apos;d love to hear from you. Send us a message and we&apos;ll respond within 24 hours.</p>

        <div className="mt-12 grid gap-8 lg:grid-cols-2">
          <div className="glass rounded-2xl p-6">
            <h2 className="text-lg font-bold text-neutral-900 dark:text-white">Send a Message</h2>
            <form className="mt-4 space-y-4" onSubmit={(e) => e.preventDefault()}>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-neutral-700 dark:text-neutral-300">Name</label>
                <input type="text" className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-primary-500 dark:border-neutral-700 dark:bg-neutral-950 dark:text-white" placeholder="Your name" />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-neutral-700 dark:text-neutral-300">Email</label>
                <input type="email" className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-primary-500 dark:border-neutral-700 dark:bg-neutral-950 dark:text-white" placeholder="you@email.com" />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-neutral-700 dark:text-neutral-300">Message</label>
                <textarea rows={4} className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-primary-500 dark:border-neutral-700 dark:bg-neutral-950 dark:text-white" placeholder="How can we help?" />
              </div>
              <Button type="submit" className="w-full">Send Message</Button>
            </form>
          </div>

          <div className="space-y-4">
            <div className="glass rounded-2xl p-5">
              <h3 className="font-bold text-neutral-900 dark:text-white">Email</h3>
              <p className="mt-1 text-sm text-neutral-500">hello@deepcheck.app</p>
              <p className="text-sm text-neutral-500">support@deepcheck.app</p>
            </div>
            <div className="glass rounded-2xl p-5">
              <h3 className="font-bold text-neutral-900 dark:text-white">WhatsApp</h3>
              <p className="mt-1 text-sm text-neutral-500">+234 800 DEEP CHECK</p>
            </div>
            <div className="glass rounded-2xl p-5">
              <h3 className="font-bold text-neutral-900 dark:text-white">Office</h3>
              <p className="mt-1 text-sm text-neutral-500">Lagos, Nigeria</p>
              <p className="text-sm text-neutral-500">Remote-first team</p>
            </div>
            <div className="glass rounded-2xl p-5">
              <h3 className="font-bold text-neutral-900 dark:text-white">Response Time</h3>
              <p className="mt-1 text-sm text-neutral-500">We respond within 24 hours, usually faster.</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
