import { FormEvent, useState } from 'react';
import {
  Calendar,
  Check,
  CheckCircle2,
  Copy,
  ExternalLink,
  Mail,
  MapPin,
  Send,
} from 'lucide-react';

interface ContactDrawerProps {
  onClose: () => void;
}

type InquiryPurpose = 'Project Inquiry' | 'Role Opportunity' | 'Say Hello';

const PURPOSES: InquiryPurpose[] = ['Project Inquiry', 'Role Opportunity', 'Say Hello'];

export function ContactDrawer({ onClose }: ContactDrawerProps) {
  const [copied, setCopied] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [purpose, setPurpose] = useState<InquiryPurpose>('Project Inquiry');
  const [message, setMessage] = useState('');
  const [submittedReceipt, setSubmittedReceipt] = useState<{
    id: string;
    sender: string;
    purpose: InquiryPurpose;
  } | null>(null);

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText('hello@virak.world');
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) return;
    const id = `TX-${Math.floor(1000 + Math.random() * 9000)}`;
    setSubmittedReceipt({
      id,
      sender: name.trim(),
      purpose,
    });
    setName('');
    setEmail('');
    setMessage('');
  };

  return (
    <div
      className="fixed inset-0 z-30 flex items-center justify-center p-4 sm:p-6 md:p-8 bg-[#25170d]/45 backdrop-blur-[4px]"
      onClick={onClose}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-label="Contact"
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-4xl max-h-[86dvh] flex flex-col paper-texture rounded-2xl sm:rounded-3xl border-2 border-[#dfcbb4] craft-shadow-lg overflow-hidden touch-auto"
      >
        {/* Top Terracotta Header Bar — Identical to Job Experience Template */}
        <div className="w-full bg-gradient-to-r from-[#a6341d] via-[#c8533d] to-[#9e3722] px-6 py-2.5 flex items-center justify-between border-b-2 border-[#751f0f] text-white shrink-0">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-white/15 text-[11px] font-mono tracking-widest uppercase font-bold text-[#fff5ea] border border-white/25">
              <Mail className="w-3 h-3 text-[#ffe29a]" />
              CONTACT // TELEGRAPH OUTPOST
            </span>
            <span className="hidden sm:inline text-xs font-mono text-white/75 tracking-wider">
              SOUTH POINT : SECTOR 03
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-[#ffeedb]">
            <span className="w-2 h-2 rounded-full bg-amber-300 animate-pulse" />
            <span className="font-bold text-[11px] tracking-wide">OPEN FOR ROLES</span>
          </div>
        </div>

        {/* Scrollable Content — Identical Card Template to Job Experience */}
        <div className="flex-1 overflow-y-auto craft-scroll px-6 py-5 sm:px-8 sm:py-6 space-y-5">
          <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#dfcbb4]">
            <div>
              <span className="text-xs font-mono font-bold tracking-wider text-[#a6341d] uppercase">
                Direct Channels &amp; Message Dispatch
              </span>
              <h2 className="text-2xl sm:text-3xl font-headline font-extrabold text-[#2c1d11] tracking-tight mt-0.5">
                Contact
              </h2>
              <p className="mt-1 text-sm text-[#58413d] max-w-xl leading-relaxed">
                Available for interactive 3D web projects, full-stack engineering roles, and
                creative collaborations.
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="self-start sm:self-center keycap-close flex items-center gap-2 px-3 py-1.5 rounded-xl cursor-pointer shrink-0"
            >
              <span className="px-1.5 h-6 rounded bg-[#fff8ed] border border-[#d6ba99] flex items-center justify-center font-mono font-bold text-[11px] text-[#2c1d11]">
                ESC
              </span>
              <span className="text-xs font-mono font-bold text-[#443224]">CLOSE</span>
            </button>
          </header>

          {/* Card 01: Direct Channels (Exact Job Experience Card Anatomy) */}
          <article className="linen-card rounded-2xl border-2 border-[#e2d1b8] hover:border-[#d3543a]/60 craft-shadow p-5 transition-colors space-y-3">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <span className="px-2 py-0.5 rounded bg-[#2c1d11] text-[#f7e8ce] font-mono font-bold text-[10px] tracking-wider">
                    CHANNEL // 01
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-[#d3543a]/12 border border-[#d3543a]/30 text-[#a6341d] font-mono font-bold text-[10px] uppercase">
                    AVAILABLE
                  </span>
                </div>
                <h3 className="text-lg sm:text-xl font-headline font-bold text-[#2c1d11]">
                  Direct Inbox &amp; Social Profiles
                </h3>
                <div className="flex flex-wrap items-center gap-3 text-xs font-mono font-bold text-[#2d587b] mt-0.5">
                  <span>hello@virak.world</span>
                  <span className="text-[#cbb395]">•</span>
                  <span className="inline-flex items-center gap-1 text-[#58413d]">
                    <MapPin className="w-3 h-3 text-[#d3543a]" />
                    Phnom Penh, Cambodia · UTC+7
                  </span>
                </div>
              </div>

              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#faedd8] border border-[#dfcbb4] font-mono font-bold text-xs text-[#2c1d11] self-start">
                <Calendar className="w-3.5 h-3.5 text-[#a6341d]" />
                <span>REPLY &lt; 24 HOURS</span>
              </div>
            </div>

            <p className="text-sm text-[#443224] leading-relaxed">
              Connect directly via email, review open-source repositories on GitHub, or request my
              latest engineering resume dossier.
            </p>

            <ul className="space-y-1.5">
              <li className="flex items-start gap-2 text-[13px] text-[#58413d] leading-relaxed">
                <CheckCircle2 className="w-4 h-4 text-[#2b4c3f] shrink-0 mt-0.5" />
                <span>Open to full-time, contract, and remote 3D / Full-Stack opportunities.</span>
              </li>
              <li className="flex items-start gap-2 text-[13px] text-[#58413d] leading-relaxed">
                <CheckCircle2 className="w-4 h-4 text-[#2b4c3f] shrink-0 mt-0.5" />
                <span>Fast asynchronous communication across APAC, EU, and US time zones.</span>
              </li>
            </ul>

            <div className="flex flex-wrap gap-2 pt-1">
              <button
                type="button"
                onClick={handleCopyEmail}
                className="px-3 py-1 rounded-md bg-[#faf3e4] hover:bg-[#faedd8] border border-[#dfcbb4] text-[11px] font-mono font-bold text-[#2c1d11] inline-flex items-center gap-1.5 transition cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-[#2b4c3f]" />
                    <span>Copied: hello@virak.world</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-[#a6341d]" />
                    <span>Copy Email</span>
                  </>
                )}
              </button>

              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1 rounded-md bg-[#faf3e4] hover:bg-[#faedd8] border border-[#dfcbb4] text-[11px] font-mono font-bold text-[#2c1d11] inline-flex items-center gap-1.5 transition"
              >
                <span>GitHub</span>
                <ExternalLink className="w-3 h-3 text-[#58413d]" />
              </a>

              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1 rounded-md bg-[#faf3e4] hover:bg-[#faedd8] border border-[#dfcbb4] text-[11px] font-mono font-bold text-[#2c1d11] inline-flex items-center gap-1.5 transition"
              >
                <span>LinkedIn</span>
                <ExternalLink className="w-3 h-3 text-[#58413d]" />
              </a>

              <a
                href="mailto:hello@virak.world?subject=Resume%20Dossier%20Request"
                className="px-3 py-1 rounded-md bg-[#faf3e4] hover:bg-[#faedd8] border border-[#dfcbb4] text-[11px] font-mono font-bold text-[#2c1d11] inline-flex items-center gap-1.5 transition"
              >
                <span>Resume / CV</span>
                <ExternalLink className="w-3 h-3 text-[#58413d]" />
              </a>
            </div>
          </article>

          {/* Card 02: Send a Message (Exact Job Experience Card Anatomy) */}
          <article className="linen-card rounded-2xl border-2 border-[#e2d1b8] hover:border-[#d3543a]/60 craft-shadow p-5 transition-colors space-y-3.5">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <span className="px-2 py-0.5 rounded bg-[#2c1d11] text-[#f7e8ce] font-mono font-bold text-[10px] tracking-wider">
                    DISPATCH // 02
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-[#d3543a]/12 border border-[#d3543a]/30 text-[#a6341d] font-mono font-bold text-[10px] uppercase">
                    DIRECT FORM
                  </span>
                </div>
                <h3 className="text-lg sm:text-xl font-headline font-bold text-[#2c1d11]">
                  Send a Message
                </h3>
                <div className="flex flex-wrap items-center gap-3 text-xs font-mono font-bold text-[#2d587b] mt-0.5">
                  <span>Telegraph Outpost</span>
                  <span className="text-[#cbb395]">•</span>
                  <span className="text-[#58413d]">Direct Workshop Dispatch</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-1.5 self-start">
                {PURPOSES.map((item) => {
                  const selected = purpose === item;
                  return (
                    <button
                      key={item}
                      type="button"
                      onClick={() => setPurpose(item)}
                      className={`px-2.5 py-1 rounded-md font-mono font-bold text-[10px] transition cursor-pointer ${
                        selected
                          ? 'bg-[#2c1d11] text-[#f7e8ce]'
                          : 'bg-[#faf3e4] text-[#58413d] border border-[#dfcbb4] hover:text-[#2c1d11]'
                      }`}
                    >
                      {item}
                    </button>
                  );
                })}
              </div>
            </div>

            {submittedReceipt ? (
              <div className="p-4 rounded-xl bg-[#faedd8] border border-[#dfcbb4] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded bg-[#2c1d11] text-[#f7e8ce] font-mono font-bold text-[10px]">
                    SENT // {submittedReceipt.id}
                  </span>
                  <span className="font-mono text-[11px] text-[#2b4c3f] font-bold">DELIVERED</span>
                </div>
                <p className="text-sm font-headline font-bold text-[#2c1d11]">
                  Thank you, {submittedReceipt.sender} — your message has been logged!
                </p>
                <p className="text-xs text-[#58413d]">
                  Topic: <strong>{submittedReceipt.purpose}</strong>. I will reply within 24 hours.
                </p>
                <button
                  type="button"
                  onClick={() => setSubmittedReceipt(null)}
                  className="px-3 py-1 rounded-md bg-[#faf3e4] border border-[#dfcbb4] font-mono font-bold text-xs text-[#2c1d11] cursor-pointer"
                >
                  Write Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label
                      htmlFor="sender-name"
                      className="block font-mono font-bold text-[11px] text-[#58413d] uppercase"
                    >
                      Your Name
                    </label>
                    <input
                      id="sender-name"
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Sarah Chen"
                      className="w-full px-3.5 py-2 rounded-xl bg-[#faf3e4] border border-[#dfcbb4] focus:outline-none focus:ring-2 focus:ring-[#d3543a] text-sm text-[#2c1d11] placeholder:text-[#8c716b]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label
                      htmlFor="sender-email"
                      className="block font-mono font-bold text-[11px] text-[#58413d] uppercase"
                    >
                      Your Email
                    </label>
                    <input
                      id="sender-email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="sarah@studio.design"
                      className="w-full px-3.5 py-2 rounded-xl bg-[#faf3e4] border border-[#dfcbb4] focus:outline-none focus:ring-2 focus:ring-[#d3543a] text-sm text-[#2c1d11] placeholder:text-[#8c716b]"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label
                    htmlFor="dispatch-message"
                    className="block font-mono font-bold text-[11px] text-[#58413d] uppercase"
                  >
                    Message
                  </label>
                  <textarea
                    id="dispatch-message"
                    rows={3}
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Share details about your project, timeline, or role..."
                    className="w-full px-3.5 py-2 rounded-xl bg-[#faf3e4] border border-[#dfcbb4] focus:outline-none focus:ring-2 focus:ring-[#d3543a] text-sm text-[#2c1d11] placeholder:text-[#8c716b] resize-none"
                  />
                </div>

                <div className="flex justify-end pt-1">
                  <button
                    type="submit"
                    className="btn-terracotta-3d px-4 py-1.5 rounded-xl font-mono font-bold text-xs inline-flex items-center gap-1.5 cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Send Message ›</span>
                  </button>
                </div>
              </form>
            )}
          </article>
        </div>

        {/* Modal Footer — Identical to Job Experience Template */}
        <footer className="px-6 py-3.5 bg-[#f3e8d2]/85 border-t border-[#dfcbb4] flex flex-col sm:flex-row items-center justify-between gap-2 text-xs font-mono text-[#58413d] shrink-0">
          <span>Press [ESC] or click outside to resume island roaming</span>
          <button
            type="button"
            onClick={onClose}
            className="btn-terracotta-3d px-4 py-1.5 rounded-xl font-mono font-bold text-xs cursor-pointer"
          >
            Resume Island Roaming ›
          </button>
        </footer>
      </section>
    </div>
  );
}
