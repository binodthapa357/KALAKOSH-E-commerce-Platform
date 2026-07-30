"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Mail, Phone, MapPin, Send, CheckCircle2, MessageSquare } from "lucide-react";
import { FaFacebookF, FaInstagram } from "react-icons/fa6";
import { toast } from "sonner";

export default function ContactPage() {
  useEffect(() => {
    document.title = "Contact | KALAKOSH";
  }, []);

  // Form State
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !subject || !message) {
      toast.error("Please fill in all form fields");
      return;
    }

    setSubmitting(true);

    // Simulate sending message
    setTimeout(() => {
      setSubmitting(false);
      setSuccess(true);
      toast.success("Message sent successfully!");
      setName("");
      setEmail("");
      setSubject("");
      setMessage("");
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#FBF8F3] py-12 font-sans">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        


        {/* Hero Header */}
        <div className="text-center max-w-xl mx-auto mb-16">
          <p className="text-secondary-600 uppercase tracking-[0.25em] text-xs sm:text-sm font-semibold mb-3">
            — GET IN TOUCH —
          </p>
          <h1 className="text-3xl sm:text-4xl lg:text-[48px] font-serif font-medium text-primary-700 tracking-wide leading-tight mb-4">
            Contact Us
          </h1>
          <p className="font-serif italic text-muted-foreground text-sm sm:text-base md:text-lg leading-relaxed">
            We&apos;d love to hear from you — about products, partnerships, or just to say नमस्ते.
          </p>
        </div>

        {/* Contact Quick Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <div className="bg-white border border-border rounded-2xl p-6 shadow-xs flex items-start gap-4">
            <div className="w-10 h-10 bg-primary-50 text-primary-700 rounded-xl flex items-center justify-center flex-shrink-0">
              <Phone className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-foreground text-sm">Call Our Support Line</h3>
              <p className="text-xs text-muted-foreground mt-1">Mon - Fri, 9:00 AM - 6:00 PM</p>
              <a href="tel:+9771234567" className="text-sm font-bold text-primary-700 hover:underline block mt-2">
                +977 1 234567
              </a>
            </div>
          </div>

          <div className="bg-white border border-border rounded-2xl p-6 shadow-xs flex items-start gap-4">
            <div className="w-10 h-10 bg-primary-50 text-primary-700 rounded-xl flex items-center justify-center flex-shrink-0">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-foreground text-sm">Email Support Team</h3>
              <p className="text-xs text-muted-foreground mt-1">Get replies within 24 hours</p>
              <a href="mailto:hello@kalakosh.com" className="text-sm font-bold text-primary-700 hover:underline block mt-2">
                hello@kalakosh.com
              </a>
            </div>
          </div>

          <div className="bg-white border border-border rounded-2xl p-6 shadow-xs flex items-start gap-4">
            <div className="w-10 h-10 bg-primary-50 text-primary-700 rounded-xl flex items-center justify-center flex-shrink-0">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-foreground text-sm">Artisan Central Office</h3>
              <p className="text-xs text-muted-foreground mt-1">Visit us in Thamel</p>
              <span className="text-sm font-bold text-foreground block mt-2">
                Thamel, Kathmandu, Nepal 44600
              </span>
            </div>
          </div>
        </div>

        {/* Split Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Map and Socials column */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white border border-border rounded-3xl p-6 sm:p-8 shadow-sm">
              <h2 className="text-2xl font-serif font-bold text-primary-800 mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-primary-700" />
                Find Us in Thamel
              </h2>
              <p className="text-sm text-muted-foreground mb-6">
                Visit us in Thamel, the cultural heart of Kathmandu.
              </p>

              <div className="w-full h-80 rounded-2xl overflow-hidden border border-border relative">
                <iframe
                  src="https://maps.google.com/maps?q=thamel%20kathmandu&t=&z=13&ie=UTF8&iwloc=&output=embed"
                  title="Map"
                  className="w-full h-full border-none"
                  allowFullScreen
                  loading="lazy"
                ></iframe>
              </div>

              {/* Socials card */}
              <div className="mt-8 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <h4 className="font-bold text-foreground text-sm">Follow our artisan journey</h4>
                  <p className="text-xs text-muted-foreground">Keep updated with new designs & exhibitions</p>
                </div>
                <div className="flex gap-4">
                  <a
                    href="https://facebook.com"
                    target="_blank"
                    rel="noreferrer"
                    className="w-10 h-10 bg-[#efe5d8] text-primary-700 rounded-full flex items-center justify-center hover:bg-primary-50 transition-colors"
                  >
                    <FaFacebookF className="w-5 h-5" />
                  </a>
                  <a
                    href="https://instagram.com"
                    target="_blank"
                    rel="noreferrer"
                    className="w-10 h-10 bg-[#efe5d8] text-primary-700 rounded-full flex items-center justify-center hover:bg-primary-50 transition-colors"
                  >
                    <FaInstagram className="w-5 h-5" />
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Message Form */}
          <div className="lg:col-span-5">
            <div className="bg-white border border-border rounded-3xl p-6 sm:p-8 shadow-sm">
              <h2 className="text-2xl font-serif font-bold text-[#5C2E2E] mb-6 flex items-center gap-2">
                <Send className="w-5 h-5 text-primary-700" />
                Send a Message
              </h2>

              {success ? (
                <div className="text-center py-8 space-y-4 animate-fade-in">
                  <div className="w-14 h-14 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-lg font-bold text-foreground font-serif">Message Sent!</h3>
                  <p className="text-xs text-muted-foreground max-w-[280px] mx-auto leading-relaxed">
                    Thank you for reaching out. We have received your message and will respond within 24 hours.
                  </p>
                  <button
                    onClick={() => setSuccess(false)}
                    className="text-xs font-semibold text-primary-700 hover:underline cursor-pointer"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleFormSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-[#5C2E2E] uppercase tracking-wide mb-1.5">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Maya Shrestha"
                      className="w-full border border-border bg-[#FDFBF7] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#5C2E2E] uppercase tracking-wide mb-1.5">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. maya@domain.com"
                      className="w-full border border-border bg-[#FDFBF7] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#5C2E2E] uppercase tracking-wide mb-1.5">
                      Subject *
                    </label>
                    <input
                      type="text"
                      required
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      placeholder="e.g. Question about Thangka paintings"
                      className="w-full border border-border bg-[#FDFBF7] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#5C2E2E] uppercase tracking-wide mb-1.5">
                      Message *
                    </label>
                    <textarea
                      required
                      rows={5}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Your message details..."
                      className="w-full border border-border bg-[#FDFBF7] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300 resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-primary-700 hover:bg-primary-800 text-white font-semibold py-3 rounded-xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                  >
                    {submitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Sending...
                      </>
                    ) : (
                      "Send Message"
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}