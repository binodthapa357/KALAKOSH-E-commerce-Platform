'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import AuthLayout from '@/components/AuthLayout';
import Link from 'next/link';
import { User, Mail, Lock, Eye, EyeOff, AlertCircle, ArrowRight, Store, CreditCard } from 'lucide-react';
import { toast } from 'sonner';

export default function SignUpPage() {
  const router = useRouter();
  const [role, setRole] = useState<'user' | 'vendor'>('user');
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    shop_name: '',
    pan_number: '',
    bank_name: '',
    account_name: '',
    account_number: '',
    bank_branch: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [panPhoto, setPanPhoto] = useState<string | null>(null);
  const [panPhotoName, setPanPhotoName] = useState<string>('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size exceeds 5MB limit');
        return;
      }
      setPanPhotoName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPanPhoto(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (form.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    // Additional validations for Vendor
    if (role === 'vendor') {
      if (!form.shop_name.trim()) {
        setError('Shop Name is required for artisan accounts');
        return;
      }
      if (!/^\d{9}$/.test(form.pan_number)) {
        setError('Nepalese PAN must be exactly a 9-digit numeric code');
        return;
      }
      if (!panPhoto) {
        setError('PAN photo upload is required for artisan registration');
        return;
      }
      if (!form.bank_name.trim() || !form.account_name.trim() || !form.account_number.trim()) {
        setError('Complete bank details are required for artisan accounts');
        return;
      }
    }

    setLoading(true);
    try {
      const payload: any = {
        name: form.name,
        email: form.email,
        password: form.password,
        role: role,
      };

      if (role === 'vendor') {
        payload.shop_name = form.shop_name;
        payload.pan_number = form.pan_number;
        payload.pan_photo = panPhoto;
        payload.bank_details = {
          bank_name: form.bank_name,
          account_name: form.account_name,
          account_number: form.account_number,
          branch: form.bank_branch,
        };
      }

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      localStorage.setItem('token', data.token);
      
      // Dispatch storage event to notify other layout parts
      window.dispatchEvent(new Event('storage'));
      
      toast.success(role === 'vendor' ? 'Artisan profile registered successfully!' : 'Account registered successfully!');
      
      if (role === 'vendor') {
        router.push('/vendor/dashboard');
      } else {
        router.push('/');
      }
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      heroImage="/images/auth_signup_hero.png"
      heroTitle="Support Nepal's"
      heroHighlight="local artisans"
      heroSubtitle="Every creation you purchase helps sustain heritage preservation and local communities across Nepal."
      reverse={false}
    >
      <div className="w-full max-h-[85vh] overflow-y-auto pr-2">
        <div className="mb-6">
          <h1 className="text-3xl font-serif font-bold text-[#5C2E2E]">Create an Account</h1>
          <p className="mt-2 text-sm text-stone-500">Join the Kalakosh community to support Nepalese traditional craft.</p>
        </div>

        {/* Role Toggle Tabs */}
        <div className="mb-6 grid grid-cols-2 gap-2 rounded-xl bg-stone-100 p-1">
          <button
            type="button"
            onClick={() => {
              setRole('user');
              setError(null);
            }}
            className={`rounded-lg py-2.5 text-xs font-semibold uppercase tracking-wider transition-colors ${
              role === 'user'
                ? 'bg-white text-[#5C2E2E] shadow-sm'
                : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            Customer
          </button>
          <button
            type="button"
            onClick={() => {
              setRole('vendor');
              setError(null);
            }}
            className={`rounded-lg py-2.5 text-xs font-semibold uppercase tracking-wider transition-colors ${
              role === 'vendor'
                ? 'bg-white text-[#5C2E2E] shadow-sm'
                : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            Artisan / Vendor
          </button>
        </div>

        {error && (
          <div className="mb-6 flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-600">
            <AlertCircle className="h-5 w-5 shrink-0" />
            <div>{error}</div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* General Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-1.5 font-sans">Full Name *</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-stone-400">
                  <User className="h-5 w-5" />
                </span>
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="Arjun Thapa"
                  value={form.name}
                  onChange={handleChange}
                  className="h-11 w-full rounded-xl border border-stone-200 bg-white pl-11 pr-4 text-sm text-stone-800 placeholder-stone-400 outline-none transition focus:border-[#8B3232] focus:ring-4 focus:ring-[#8B3232]/10"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-1.5 font-sans">Email Address *</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-stone-400">
                  <Mail className="h-5 w-5" />
                </span>
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="arjun@example.com"
                  value={form.email}
                  onChange={handleChange}
                  className="h-11 w-full rounded-xl border border-stone-200 bg-white pl-11 pr-4 text-sm text-stone-800 placeholder-stone-400 outline-none transition focus:border-[#8B3232] focus:ring-4 focus:ring-[#8B3232]/10"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-1.5 font-sans">Password *</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-stone-400">
                  <Lock className="h-5 w-5" />
                </span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  required
                  placeholder="••••••••"
                  value={form.password}
                  onChange={handleChange}
                  className="h-11 w-full rounded-xl border border-stone-200 bg-white pl-11 pr-11 text-sm text-stone-800 placeholder-stone-400 outline-none transition focus:border-[#8B3232] focus:ring-4 focus:ring-[#8B3232]/10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-4 text-stone-400 hover:text-stone-600"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-1.5 font-sans">Confirm Password *</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-stone-400">
                  <Lock className="h-5 w-5" />
                </span>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  required
                  placeholder="••••••••"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  className="h-11 w-full rounded-xl border border-stone-200 bg-white pl-11 pr-11 text-sm text-stone-800 placeholder-stone-400 outline-none transition focus:border-[#8B3232] focus:ring-4 focus:ring-[#8B3232]/10"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-4 text-stone-400 hover:text-stone-600"
                >
                  {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>
          </div>

          {/* Vendor Specific Fields */}
          {role === 'vendor' && (
            <div className="space-y-4 pt-4 border-t border-stone-200 animate-fadeIn">
              <h3 className="font-serif text-lg font-bold text-[#5C2E2E]">Artisan Shop details</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-1.5">Shop Name *</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-stone-400">
                      <Store className="h-5 w-5" />
                    </span>
                    <input
                      type="text"
                      name="shop_name"
                      required
                      placeholder="Himalayan Crafts Studio"
                      value={form.shop_name}
                      onChange={handleChange}
                      className="h-11 w-full rounded-xl border border-stone-200 bg-white pl-11 pr-4 text-sm text-stone-800 placeholder-stone-400 outline-none transition focus:border-[#8B3232] focus:ring-4 focus:ring-[#8B3232]/10"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-1.5">9-Digit PAN Number *</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-stone-400">
                      <User className="h-5 w-5" />
                    </span>
                    <input
                      type="text"
                      name="pan_number"
                      required
                      maxLength={9}
                      placeholder="123456789"
                      value={form.pan_number}
                      onChange={handleChange}
                      className="h-11 w-full rounded-xl border border-stone-200 bg-white pl-11 pr-4 text-sm text-stone-800 placeholder-stone-400 outline-none transition focus:border-[#8B3232] focus:ring-4 focus:ring-[#8B3232]/10"
                    />
                  </div>
                </div>
              </div>

              {/* PAN Photo Upload */}
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-1.5">Upload PAN Photo/Document *</label>
                  <div className="flex items-center gap-4">
                    <button
                      type="button"
                      onClick={() => document.getElementById('pan-photo-input')?.click()}
                      className="h-11 px-4 rounded-xl border border-dashed border-[#8B3232] bg-[#8B3232]/5 text-xs font-semibold uppercase tracking-wider text-[#8B3232] transition hover:bg-[#8B3232]/10 flex items-center justify-center gap-2"
                    >
                      <Store className="h-4 w-4" />
                      {panPhotoName ? 'Change Document' : 'Select PAN Image'}
                    </button>
                    <input
                      id="pan-photo-input"
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    {panPhotoName && (
                      <span className="text-xs text-stone-500 truncate max-w-[200px]">
                        {panPhotoName}
                      </span>
                    )}
                  </div>
                  {panPhoto && (
                    <div className="mt-3 relative w-48 h-32 rounded-lg overflow-hidden border border-stone-200 shadow-inner">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={panPhoto} alt="PAN preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>
              </div>

              <h3 className="font-serif text-lg font-bold text-[#5C2E2E] pt-2">Bank Payout Info</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-1.5">Bank Name *</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-stone-400">
                      <CreditCard className="h-5 w-5" />
                    </span>
                    <input
                      type="text"
                      name="bank_name"
                      required
                      placeholder="Nabil Bank"
                      value={form.bank_name}
                      onChange={handleChange}
                      className="h-11 w-full rounded-xl border border-stone-200 bg-white pl-11 pr-4 text-sm text-stone-800 placeholder-stone-400 outline-none transition focus:border-[#8B3232] focus:ring-4 focus:ring-[#8B3232]/10"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-1.5">Account Name *</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-stone-400">
                      <User className="h-5 w-5" />
                    </span>
                    <input
                      type="text"
                      name="account_name"
                      required
                      placeholder="Arjun Thapa"
                      value={form.account_name}
                      onChange={handleChange}
                      className="h-11 w-full rounded-xl border border-stone-200 bg-white pl-11 pr-4 text-sm text-stone-800 placeholder-stone-400 outline-none transition focus:border-[#8B3232] focus:ring-4 focus:ring-[#8B3232]/10"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-1.5">Account Number *</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-stone-400">
                      <CreditCard className="h-5 w-5" />
                    </span>
                    <input
                      type="text"
                      name="account_number"
                      required
                      placeholder="9876543210123"
                      value={form.account_number}
                      onChange={handleChange}
                      className="h-11 w-full rounded-xl border border-stone-200 bg-white pl-11 pr-4 text-sm text-stone-800 placeholder-stone-400 outline-none transition focus:border-[#8B3232] focus:ring-4 focus:ring-[#8B3232]/10"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-1.5">Branch</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-stone-400">
                      <Store className="h-5 w-5" />
                    </span>
                    <input
                      type="text"
                      name="bank_branch"
                      placeholder="Kathmandu Main Branch"
                      value={form.bank_branch}
                      onChange={handleChange}
                      className="h-11 w-full rounded-xl border border-stone-200 bg-white pl-11 pr-4 text-sm text-stone-800 placeholder-stone-400 outline-none transition focus:border-[#8B3232] focus:ring-4 focus:ring-[#8B3232]/10"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#5C2E2E] text-sm font-semibold text-white shadow-lg shadow-[#5C2E2E]/25 transition hover:bg-[#8B3232] active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50"
          >
            {loading ? 'Creating Account...' : role === 'vendor' ? 'Register as Artisan' : 'Sign Up'}
            <ArrowRight className="h-4 w-4" />
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-stone-500">
          Already have an account?{' '}
          <Link href="/signin" className="font-semibold text-[#8B3232] hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}