"use client";

import { useState } from "react";
import Link from "next/link";
import { HelpCircle, Mail, Phone, MapPin, Send, CheckCircle2, MessageSquare } from "lucide-react";
import { toast } from "sonner";

// Since @radix-ui/react-accordion might not be installed, we can build a simple custom animated pure React accordion to be 100% robust and self-contained, or we can use custom states!
// Let's create a beautiful custom React accordion with local toggle state to make it robust, visually excellent, and completely self-contained.

interface FAQItem {
  question: string;
  answer: string;
}

export default function HelpPage() {
  // FAQs list
  const faqs: Record<string, FAQItem[]> = {
    ordering: [
      {
        question: "How do I place an order?",
        answer: "Browse our collections, add products to your cart, and click 'Proceed to Checkout'. If you don't have an account, you will be prompted to sign in or create one. Provide your shipping details, select your preferred payment method (COD or eSewa), and place your order.",
      },
      {
        question: "Can I cancel or modify my order after placing it?",
        answer: "Orders can be cancelled before they enter the 'shipped' stage. Please navigate to your Dashboard to cancel active orders, or contact our customer support immediately with your Order Number (e.g., KLK-0001).",
      },
      {
        question: "Where are the products shipped from?",
        answer: "All KALAKOSH products are handcrafted directly by local Nepalese artisans and shipped from their regional workshops (such as Patan, Bhaktapur, Pokhara, or Solukhumbu) or centralized packaging hubs in Kathmandu.",
      },
    ],
    payments: [
      {
        question: "What payment methods do you accept?",
        answer: "We support eSewa mobile wallet payments (which can be completed instantly online) and Cash on Delivery (COD) which allows you to pay offline in cash once the courier hands over the package.",
      },
      {
        question: "Is it safe to pay with eSewa here?",
        answer: "Yes, absolutely! We integrate with eSewa's secure transaction APIs. During checkout, you are redirected to eSewa's official login system where your credentials are encrypted and processed securely.",
      },
      {
        question: "Are there any hidden service charges?",
        answer: "No, all prices listed on product pages are inclusive of government taxes. Shipping charges are added dynamically during checkout based on your delivery district and city.",
      },
    ],
    shipping: [
      {
        question: "How much does shipping cost?",
        answer: "Shipping is FREE for all orders above Rs. 5,000 within Nepal. For orders below Rs. 5,000, shipping is calculated dynamically: Rs. 100 within Kathmandu Valley / Bagmati province, Rs. 150 for major provincial cities (Pokhara, Biratnagar, etc.), Rs. 250 for remote mountainous districts, and Rs. 200 elsewhere.",
      },
      {
        question: "How long will it take to receive my order?",
        answer: "Standard shipping takes 3 to 5 business days for major cities. For remote areas and custom craft designs, it can take up to 7 to 10 business days as some artisan crafts require finishing touches after order placement.",
      },
      {
        question: "How can I track my package?",
        answer: "You can track your order using the 'Track Order' link in the top banner or navbar. Simply input your Order Number (e.g., KLK-0001) and your registered Email Address to view a live visual timeline progress of your shipment.",
      },
    ],
  };

  const [activeTab, setActiveTab] = useState<"ordering" | "payments" | "shipping">("ordering");
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

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
      toast.success("Support ticket created successfully!");
      setName("");
      setEmail("");
      setSubject("");
      setMessage("");
    }, 1500);
  };

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-[#FBF8F3] py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* Breadcrumbs */}
        <nav className="text-sm text-muted-foreground mb-8">
          <Link href="/" className="hover:text-primary-700">
            Home
          </Link>
          <span className="mx-2">/</span>
          <span className="text-foreground font-medium">Help & Support</span>
        </nav>

        {/* Hero Header */}
        <div className="text-center max-w-xl mx-auto mb-16">
          <div className="w-14 h-14 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-4 text-[#5C2E2E]">
            <HelpCircle className="w-8 h-8 text-primary-700" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-primary-800 tracking-wide">
            Help & Support Center
          </h1>
          <p className="text-muted-foreground mt-2 text-sm sm:text-base">
            Have questions about ordering, payments, or artisan heritage crafts? We&apos;re here to help.
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
              <a href="mailto:support@kalakosh.com" className="text-sm font-bold text-primary-700 hover:underline block mt-2">
                support@kalakosh.com
              </a>
            </div>
          </div>

          <div className="bg-white border border-border rounded-2xl p-6 shadow-xs flex items-start gap-4">
            <div className="w-10 h-10 bg-primary-50 text-primary-700 rounded-xl flex items-center justify-center flex-shrink-0">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-foreground text-sm">Artisan Central Office</h3>
              <p className="text-xs text-muted-foreground mt-1">Visit us in the cultural hub</p>
              <span className="text-sm font-bold text-foreground block mt-2">
                Thamel, Kathmandu, Nepal
              </span>
            </div>
          </div>
        </div>

        {/* FAQs and Support Message form split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* FAQs section */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white border border-border rounded-3xl p-6 sm:p-8 shadow-sm">
              <h2 className="text-2xl font-serif font-bold text-primary-800 mb-6 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-primary-700" />
                Frequently Asked Questions
              </h2>

              {/* Accordion categories tab */}
              <div className="flex border-b border-border mb-6 overflow-x-auto gap-4">
                {(["ordering", "payments", "shipping"] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => {
                      setActiveTab(tab);
                      setOpenFaqIndex(null);
                    }}
                    className={`pb-3 font-semibold text-sm capitalize transition-all border-b-2 whitespace-nowrap cursor-pointer ${
                      activeTab === tab
                        ? "border-primary-700 text-primary-700"
                        : "border-transparent text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {tab} questions
                  </button>
                ))}
              </div>

              {/* Custom Accordion Render */}
              <div className="space-y-4">
                {faqs[activeTab].map((faq, idx) => {
                  const isOpen = openFaqIndex === idx;
                  return (
                    <div key={idx} className="border border-border rounded-xl overflow-hidden transition-all bg-[#FDFBF7]">
                      <button
                        onClick={() => toggleFaq(idx)}
                        className="w-full text-left px-5 py-4 font-semibold text-sm text-[#5C2E2E] hover:text-[#8B3232] flex justify-between items-center transition-all bg-white"
                      >
                        <span>{faq.question}</span>
                        <span className={`text-base font-medium transition-transform duration-200 ${isOpen ? "rotate-45" : ""}`}>
                          ＋
                        </span>
                      </button>
                      
                      <div
                        className={`transition-all duration-300 overflow-hidden ${
                          isOpen ? "max-h-[300px] border-t border-border" : "max-h-0"
                        }`}
                      >
                        <p className="p-5 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                          {faq.answer}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Support Ticket Message Form */}
          <div className="lg:col-span-5">
            <div className="bg-white border border-border rounded-3xl p-6 sm:p-8 shadow-sm">
              <h2 className="text-2xl font-serif font-bold text-[#5C2E2E] mb-6 flex items-center gap-2">
                <Send className="w-5 h-5 text-primary-700" />
                Submit a Support Ticket
              </h2>

              {success ? (
                <div className="text-center py-8 space-y-4 animate-fade-in">
                  <div className="w-14 h-14 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-lg font-bold text-foreground font-serif">Message Received!</h3>
                  <p className="text-xs text-muted-foreground max-w-[280px] mx-auto leading-relaxed">
                    Thank you for reaching out. We have logged ticket support details. Our team will review and reply within 24 hours.
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
                      placeholder="e.g. Shipping Delay / Refund Query"
                      className="w-full border border-border bg-[#FDFBF7] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#5C2E2E] uppercase tracking-wide mb-1.5">
                      Message Details *
                    </label>
                    <textarea
                      required
                      rows={5}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Please provide complete order numbers or other relevant details here..."
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
                        Submitting...
                      </>
                    ) : (
                      "Submit Support Ticket"
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
