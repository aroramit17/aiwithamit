import { useRef, useState } from 'react';
import { motion, useInView, useScroll, useTransform, type MotionValue } from 'framer-motion';
import { ArrowRight, Check, X } from 'lucide-react';

/* ------------------------------------------------------------------ */
/* Shared animation components                                          */
/* ------------------------------------------------------------------ */

type WordsPullUpProps = {
  text: string;
  className?: string;
  style?: React.CSSProperties;
  showAsterisk?: boolean;
};

function WordsPullUp({ text, className = '', style, showAsterisk = false }: WordsPullUpProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { once: true });
  const words = text.split(' ');

  return (
    <div ref={ref} className={`inline-flex flex-wrap ${className}`} style={style}>
      {words.map((word, i) => {
        const isLast = i === words.length - 1;
        return (
          <motion.span
            key={`${word}-${i}`}
            initial={{ y: 20, opacity: 0 }}
            animate={inView ? { y: 0, opacity: 1 } : {}}
            transition={{ delay: i * 0.08, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="relative inline-block mr-[0.2em] last:mr-0"
          >
            {word}
            {showAsterisk && isLast && (
              <span className="absolute top-[0.65em] -right-[0.3em] text-[0.31em]">*</span>
            )}
          </motion.span>
        );
      })}
    </div>
  );
}

type Segment = { text: string; className?: string };

function WordsPullUpMultiStyle({
  segments,
  className = '',
}: {
  segments: Segment[];
  className?: string;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { once: true });

  const flat: { word: string; className?: string }[] = [];
  segments.forEach((seg) => {
    seg.text.split(' ').forEach((w) => {
      if (w.length) flat.push({ word: w, className: seg.className });
    });
  });

  return (
    <div ref={ref} className={`inline-flex flex-wrap justify-center ${className}`}>
      {flat.map((item, i) => (
        <motion.span
          key={`${item.word}-${i}`}
          initial={{ y: 20, opacity: 0 }}
          animate={inView ? { y: 0, opacity: 1 } : {}}
          transition={{ delay: i * 0.08, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className={`inline-block mr-[0.25em] ${item.className ?? ''}`}
        >
          {item.word}
        </motion.span>
      ))}
    </div>
  );
}

function AnimatedLetter({
  char,
  index,
  total,
  progress,
}: {
  char: string;
  index: number;
  total: number;
  progress: MotionValue<number>;
}) {
  const charProgress = index / total;
  const opacity = useTransform(
    progress,
    [charProgress - 0.1, charProgress + 0.05],
    [0.2, 1]
  );
  return (
    <motion.span style={{ opacity }} className="inline">
      {char}
    </motion.span>
  );
}

/* ------------------------------------------------------------------ */
/* Waitlist Modal                                                       */
/* ------------------------------------------------------------------ */

// Replace this with your Formspree (or other email-capture) endpoint.
// e.g. 'https://formspree.io/f/abcd1234'
const WAITLIST_ENDPOINT = 'https://formspree.io/f/your-id-here';

function WaitlistModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setStatus('submitting');
    try {
      const res = await fetch(WAITLIST_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ email, name, source: 'aiwithamit-landing' }),
      });
      if (res.ok) {
        setStatus('success');
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-md rounded-2xl bg-[#101010] p-8 md:p-10"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 text-primary/60 hover:text-primary"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>

        {status === 'success' ? (
          <div className="text-center">
            <h3 className="text-2xl font-medium text-primary md:text-3xl">You're in.</h3>
            <p className="mt-3 text-sm text-primary/70">
              Check your inbox — I'll send the first lesson when we launch.
            </p>
          </div>
        ) : (
          <>
            <p className="text-[10px] uppercase tracking-widest text-primary sm:text-xs">
              Waitlist
            </p>
            <h3 className="mt-2 text-2xl font-medium text-primary md:text-3xl">
              Build websites with Claude.
            </h3>
            <p className="mt-3 text-sm text-primary/70">
              Join the waitlist for the cohort. Early seats and conference perks go out first.
            </p>

            <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-3">
              <input
                type="text"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="rounded-full border border-primary/20 bg-black px-5 py-3 text-sm text-primary placeholder-primary/40 outline-none focus:border-primary/50"
              />
              <input
                type="email"
                required
                placeholder="you@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="rounded-full border border-primary/20 bg-black px-5 py-3 text-sm text-primary placeholder-primary/40 outline-none focus:border-primary/50"
              />
              <button
                type="submit"
                disabled={status === 'submitting'}
                className="group mt-2 flex items-center justify-center gap-2 rounded-full bg-primary py-3 text-sm font-medium text-black transition-all hover:gap-3 disabled:opacity-60"
              >
                {status === 'submitting' ? 'Joining…' : 'Join the waitlist'}
                <ArrowRight className="h-4 w-4" />
              </button>
              {status === 'error' && (
                <p className="text-center text-xs text-red-400">
                  Something went wrong. Email amit directly and I'll add you.
                </p>
              )}
            </form>
          </>
        )}
      </motion.div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Sections                                                             */
/* ------------------------------------------------------------------ */

const NAV = ['Curriculum', 'Demos', 'Workshops', 'Speaking', 'Contact'];

function Hero({ onJoin }: { onJoin: () => void }) {
  return (
    <section className="h-screen w-full p-4 md:p-6">
      <div className="relative h-full w-full overflow-hidden rounded-2xl md:rounded-[2rem]">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 h-full w-full object-cover"
          src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260405_170732_8a9ccda6-5cff-4628-b164-059c500a2b41.mp4"
        />
        <div className="noise-overlay pointer-events-none absolute inset-0 opacity-[0.7] mix-blend-overlay" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/60" />

        {/* Navbar */}
        <nav className="absolute left-1/2 top-0 z-10 -translate-x-1/2">
          <div className="flex items-center gap-3 rounded-b-2xl bg-black px-4 py-2 sm:gap-6 md:gap-12 md:rounded-b-3xl md:px-8 lg:gap-14">
            {NAV.map((item) => (
              <a
                key={item}
                href="#"
                className="text-[10px] transition-colors sm:text-xs md:text-sm"
                style={{ color: 'rgba(225, 224, 204, 0.8)' }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#E1E0CC')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(225, 224, 204, 0.8)')}
              >
                {item}
              </a>
            ))}
          </div>
        </nav>

        {/* Hero content */}
        <div className="absolute bottom-0 left-0 right-0 px-4 pb-6 sm:px-8 sm:pb-8 md:px-12 md:pb-10">
          <div className="grid grid-cols-1 items-end gap-6 md:grid-cols-12">
            <div className="md:col-span-8">
              <WordsPullUp
                text="aiwithamit"
                showAsterisk
                className="text-[26vw] font-medium leading-[0.85] tracking-[-0.07em] sm:text-[24vw] md:text-[22vw] lg:text-[20vw] xl:text-[19vw] 2xl:text-[20vw]"
                style={{ color: '#E1E0CC' }}
              />
            </div>
            <div className="flex flex-col gap-5 md:col-span-4 md:items-start">
              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="text-xs text-primary/70 sm:text-sm md:text-base"
                style={{ lineHeight: 1.2 }}
              >
                Learn to design and ship beautiful, production-grade websites using Claude as your
                pair-programmer — no framework gymnastics, no boilerplate, just the prompts and
                workflows that actually work.
              </motion.p>
              <motion.button
                onClick={onJoin}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.7, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="group flex items-center gap-2 rounded-full bg-primary py-1.5 pl-5 pr-1.5 text-sm font-medium text-black transition-all hover:gap-3 sm:text-base"
              >
                Join the waitlist
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-black transition-transform group-hover:scale-110 sm:h-10 sm:w-10">
                  <ArrowRight className="h-4 w-4 text-primary sm:h-5 sm:w-5" />
                </span>
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function About() {
  const ref = useRef<HTMLParagraphElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 0.8', 'end 0.2'],
  });

  const bodyText =
    'Over the last several years I have shipped dozens of websites using Claude — landing pages, marketing sites, full-stack apps, and the demos I show on stage. Here I break down the prompts, the design choices, and the engineering decisions in plain English, so you can build sites that look hand-crafted in a fraction of the time.';
  const chars = bodyText.split('');

  return (
    <section className="bg-black px-4 py-24 sm:px-8 md:py-32">
      <div className="mx-auto max-w-6xl rounded-2xl bg-[#101010] px-6 py-16 text-center sm:px-10 md:py-24">
        <p className="mb-6 text-[10px] text-primary sm:text-xs">Build websites with Claude</p>

        <WordsPullUpMultiStyle
          className="mx-auto max-w-3xl text-3xl leading-[0.95] sm:text-4xl sm:leading-[0.9] md:text-5xl lg:text-6xl xl:text-7xl"
          segments={[
            { text: 'I am Amit,', className: 'font-normal' },
            { text: 'a self-taught builder.', className: 'italic font-serif' },
            {
              text: 'I teach engineers, designers, and founders how to ship stunning websites using Claude.',
              className: 'font-normal',
            },
          ]}
        />

        <p
          ref={ref}
          className="mx-auto mt-10 max-w-3xl text-xs sm:text-sm md:text-base"
          style={{ color: '#DEDBC8' }}
        >
          {chars.map((c, i) => (
            <AnimatedLetter
              key={i}
              char={c}
              index={i}
              total={chars.length}
              progress={scrollYProgress}
            />
          ))}
        </p>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Features                                                             */
/* ------------------------------------------------------------------ */

type FeatureCard = {
  number: string;
  title: string;
  icon: string;
  items: { title: string; desc: string }[];
};

const FEATURE_CARDS: FeatureCard[] = [
  {
    number: '01',
    title: 'Prompt Playbooks.',
    icon: 'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260405_171918_4a5edc79-d78f-4637-ac8b-53c43c220606.png&w=1280&q=85',
    items: [
      { title: 'Hero & landing prompts', desc: 'Copy-paste briefs that spec a polished hero in one shot.' },
      { title: 'Design-system prompts', desc: 'Get Claude to ship tokens, colors, and type scales.' },
      { title: 'Component libraries', desc: 'Generate reusable React + Tailwind blocks on demand.' },
      { title: 'Iteration loops', desc: 'The follow-up prompts that turn drafts into ship-ready code.' },
    ],
  },
  {
    number: '02',
    title: 'Design Critiques.',
    icon: 'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260405_171741_ed9845ab-f5b2-4018-8ce7-07cc01823522.png&w=1280&q=85',
    items: [
      { title: 'Layout reviews', desc: 'Have Claude critique your spacing, hierarchy, and rhythm.' },
      { title: 'Brand-voice rewrites', desc: 'Turn flat marketing copy into something that sounds like you.' },
      { title: 'Tool integrations', desc: 'Wire Claude into Cursor, Figma, and your deploy pipeline.' },
    ],
  },
  {
    number: '03',
    title: 'Ship Capsule.',
    icon: 'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260405_171809_f56666dc-c099-4778-ad82-9ad4f209567b.png&w=1280&q=85',
    items: [
      { title: 'Vercel & Netlify deploys', desc: 'Push from prompt to live URL in under five minutes.' },
      { title: 'Performance passes', desc: 'Claude-driven audits for Lighthouse and Core Web Vitals.' },
      { title: 'Analytics wiring', desc: 'Auto-instrument GA, Plausible, or PostHog without copy-paste.' },
    ],
  },
];

function Features({ onJoin }: { onJoin: () => void }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section className="relative min-h-screen bg-black px-4 py-20 sm:px-6 md:py-28">
      <div className="bg-noise pointer-events-none absolute inset-0 opacity-[0.15]" />
      <div className="relative mx-auto max-w-7xl">
        <div className="mb-12 text-center md:mb-16">
          <WordsPullUpMultiStyle
            className="text-xl font-normal sm:text-2xl md:text-3xl lg:text-4xl"
            segments={[
              { text: 'Studio-grade websites, prompted into existence.', className: '' },
            ]}
          />
          <div className="mt-2">
            <WordsPullUpMultiStyle
              className="text-xl font-normal text-gray-500 sm:text-2xl md:text-3xl lg:text-4xl"
              segments={[{ text: 'Built with taste. Powered by Claude.', className: '' }]}
            />
          </div>
        </div>

        <div
          ref={ref}
          className="grid grid-cols-1 gap-3 sm:gap-2 md:grid-cols-2 md:gap-1 lg:h-[480px] lg:grid-cols-4"
        >
          {/* Card 1 - video */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={inView ? { scale: 1, opacity: 1 } : {}}
            transition={{ delay: 0, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="relative h-[420px] overflow-hidden rounded-xl lg:h-full"
          >
            <video
              autoPlay
              loop
              muted
              playsInline
              className="absolute inset-0 h-full w-full object-cover"
              src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260406_133058_0504132a-0cf3-4450-a370-8ea3b05c95d4.mp4"
            />
            <div className="absolute bottom-0 left-0 p-5 md:p-6">
              <p className="text-lg font-medium md:text-xl" style={{ color: '#E1E0CC' }}>
                Your prompt. Your site.
              </p>
            </div>
          </motion.div>

          {/* Cards 2-4 */}
          {FEATURE_CARDS.map((card, i) => (
            <motion.div
              key={card.title}
              initial={{ scale: 0.95, opacity: 0 }}
              animate={inView ? { scale: 1, opacity: 1 } : {}}
              transition={{ delay: (i + 1) * 0.15, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="flex h-[420px] flex-col rounded-xl bg-[#212121] p-5 md:p-6 lg:h-full"
            >
              <img
                src={card.icon}
                alt=""
                className="h-10 w-10 rounded sm:h-12 sm:w-12"
                loading="lazy"
              />
              <h3 className="mt-5 text-base font-medium text-primary sm:text-lg">
                {card.title} <span className="text-gray-500">({card.number})</span>
              </h3>
              <ul className="mt-4 flex flex-1 flex-col gap-3">
                {card.items.map((item) => (
                  <li key={item.title} className="flex gap-2">
                    <Check className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-primary" />
                    <div>
                      <p className="text-xs font-medium text-primary sm:text-sm">{item.title}</p>
                      <p className="text-[11px] text-gray-400 sm:text-xs">{item.desc}</p>
                    </div>
                  </li>
                ))}
              </ul>
              <a
                href="#"
                className="mt-5 inline-flex items-center gap-1.5 text-xs text-primary transition-opacity hover:opacity-70 sm:text-sm"
              >
                Learn more
                <ArrowRight className="h-3.5 w-3.5" style={{ transform: 'rotate(-45deg)' }} />
              </a>
            </motion.div>
          ))}
        </div>

        {/* Bottom waitlist CTA */}
        <div className="mt-16 flex flex-col items-center gap-5 text-center md:mt-24">
          <h3 className="max-w-2xl text-2xl font-normal text-primary sm:text-3xl md:text-4xl">
            Ready to build your next website with Claude?
          </h3>
          <p className="max-w-xl text-sm text-primary/70 md:text-base">
            Join the waitlist. Conference attendees get early access and a private prompt pack.
          </p>
          <button
            onClick={onJoin}
            className="group flex items-center gap-2 rounded-full bg-primary py-1.5 pl-5 pr-1.5 text-sm font-medium text-black transition-all hover:gap-3 sm:text-base"
          >
            Join the waitlist
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-black transition-transform group-hover:scale-110 sm:h-10 sm:w-10">
              <ArrowRight className="h-4 w-4 text-primary sm:h-5 sm:w-5" />
            </span>
          </button>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */

export default function App() {
  const [waitlistOpen, setWaitlistOpen] = useState(false);
  const open = () => setWaitlistOpen(true);
  const close = () => setWaitlistOpen(false);

  return (
    <main className="min-h-screen bg-black">
      <Hero onJoin={open} />
      <About />
      <Features onJoin={open} />
      <WaitlistModal open={waitlistOpen} onClose={close} />
    </main>
  );
}
