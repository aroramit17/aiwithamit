import { useEffect, useRef, useState } from 'react';
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
/* Checkout Modal (ThriveCart embed)                                    */
/* ------------------------------------------------------------------ */

const THRIVECART_SCRIPT_ID = 'tc-webpay-58-6B52AP';
const THRIVECART_SCRIPT_SRC = '//tinder.thrivecart.com/embed/v2/thrivecart.js';

function CheckoutModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  useEffect(() => {
    if (!open) return;
    // Lock body scroll while the checkout is open
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // Inject the ThriveCart embed script the first time the modal opens.
    // ThriveCart looks for .tc-v2-embeddable-target elements and hydrates them.
    if (!document.getElementById(THRIVECART_SCRIPT_ID)) {
      const s = document.createElement('script');
      s.async = true;
      s.src = THRIVECART_SCRIPT_SRC;
      s.id = THRIVECART_SCRIPT_ID;
      document.body.appendChild(s);
    }

    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/80 p-2 backdrop-blur-sm sm:p-4 sm:items-center"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.96, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        onClick={(e) => e.stopPropagation()}
        className="relative my-4 w-full max-w-5xl overflow-hidden rounded-2xl bg-white sm:my-8"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-black/80 text-white shadow-lg transition-colors hover:bg-black"
          aria-label="Close checkout"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="max-h-[90vh] overflow-y-auto">
          <div
            className="tc-v2-embeddable-target"
            data-thrivecart-account="webpay"
            data-thrivecart-tpl="v2"
            data-thrivecart-product="58"
            data-thrivecart-embeddable="tc-webpay-58-6B52AP"
          />
        </div>
      </motion.div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Sections                                                             */
/* ------------------------------------------------------------------ */

const NAV: { label: string; id: string }[] = [
  { label: 'Home', id: 'home' },
  { label: 'About', id: 'about' },
  { label: 'Curriculum', id: 'curriculum' },
  { label: 'Waitlist', id: 'waitlist' },
];

function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function Hero({ onJoin }: { onJoin: () => void }) {
  return (
    <section id="home" className="h-screen w-full p-4 md:p-6">
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
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  if (item.id === 'waitlist') onJoin();
                  else scrollToId(item.id);
                }}
                className="text-[10px] transition-colors sm:text-xs md:text-sm"
                style={{ color: 'rgba(225, 224, 204, 0.8)' }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#E1E0CC')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(225, 224, 204, 0.8)')}
              >
                {item.label}
              </button>
            ))}
          </div>
        </nav>

        {/* Hero content */}
        <div className="absolute bottom-0 left-0 right-0 px-3 pb-3 sm:px-8 sm:pb-6 md:px-12 md:pb-8">
          {/* Description + CTA sit ABOVE the giant headline so the wide word can take full width */}
          <div className="mb-4 flex flex-col items-start gap-3 sm:mb-8 sm:gap-4 md:mb-10 md:flex-row md:items-end md:justify-end md:gap-10">
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="max-w-[80%] text-[11px] text-primary/80 sm:max-w-sm sm:text-sm md:max-w-md md:text-base"
              style={{ lineHeight: 1.3, textShadow: '0 1px 8px rgba(0,0,0,0.6)' }}
            >
              Learn to design and ship beautiful, production-grade websites using Claude as your
              pair-programmer — no framework gymnastics, just the prompts and workflows that
              actually work.
            </motion.p>
            <motion.button
              onClick={onJoin}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="group flex flex-shrink-0 items-center gap-2 rounded-full bg-primary py-1 pl-4 pr-1 text-xs font-medium text-black transition-all hover:gap-3 sm:py-1.5 sm:pl-5 sm:pr-1.5 sm:text-sm md:text-base"
            >
              Join the waitlist
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-black transition-transform group-hover:scale-110 sm:h-9 sm:w-9 md:h-10 md:w-10">
                <ArrowRight className="h-3 w-3 text-primary sm:h-4 sm:w-4 md:h-5 md:w-5" />
              </span>
            </motion.button>
          </div>

          {/* Full-bleed brand word */}
          <WordsPullUp
            text="aiwithamit"
            showAsterisk
            className="block text-[22vw] font-medium leading-[0.85] tracking-[-0.07em] sm:text-[20vw] md:text-[16vw] lg:text-[15vw] xl:text-[14vw]"
            style={{ color: '#E1E0CC' }}
          />
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
    <section id="about" className="bg-black px-4 py-24 sm:px-8 md:py-32">
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
/* Sales: Problem · Agitate · Solution (PAS)                            */
/* ------------------------------------------------------------------ */

function ProblemAgitateSolution() {
  const beats: { label: string; headline: React.ReactNode; body: string }[] = [
    {
      label: 'The problem',
      headline: (
        <>
          Your sales page is <span className="italic font-serif">leaking money.</span>
        </>
      ),
      body: 'You shipped the page. Two weeks of fighting Tailwind classes. Two days of writing copy that sounds like every other SaaS landing. It went live. Conversion: under 1%. Founders, makers, and agencies are all stuck in the same loop.',
    },
    {
      label: 'The cost',
      headline: <>Every bounce is a customer your competitor just closed.</>,
      body: 'Every hour wrestling with hero sections is an hour your product isn’t shipping. The AI website builders everyone hyped? They produce templates that look exactly like every other template. Agencies want $25k for a single landing page. So most founders ship sad pages — or no page at all.',
    },
    {
      label: 'The fix',
      headline: (
        <>
          There is a <span className="italic font-serif">better way.</span>
        </>
      ),
      body: 'You can prompt Claude to ship pages that look hand-crafted, write copy that closes, and deploy in a day — if you know the exact briefs, copywriting frameworks, and iteration loops to feed it. That’s the entire workshop.',
    },
  ];

  return (
    <section className="bg-black px-4 py-24 sm:px-8 md:py-32">
      <div className="mx-auto flex max-w-5xl flex-col gap-16 md:gap-24">
        {beats.map((b) => (
          <div key={b.label} className="grid grid-cols-1 gap-6 md:grid-cols-12 md:gap-10">
            <p className="text-[10px] uppercase tracking-[0.2em] text-primary/60 sm:text-xs md:col-span-3 md:pt-3">
              {b.label}
            </p>
            <div className="md:col-span-9">
              <h3 className="text-3xl font-normal leading-[1.05] text-primary sm:text-4xl md:text-5xl lg:text-6xl">
                {b.headline}
              </h3>
              <p className="mt-5 max-w-2xl text-sm text-primary/70 md:text-base">{b.body}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Sales: Before · After · Bridge (BAB)                                 */
/* ------------------------------------------------------------------ */

function BeforeAfterBridge() {
  const before = [
    'Generic templated hero',
    'Stock-photography vibes',
    'Copy that reads like ChatGPT wrote it',
    '0.8% conversion on a good day',
    'Two weeks per page',
    '$25k agency invoices',
  ];
  const after = [
    'Hand-crafted, on-brand design',
    'Imagery that actually fits the offer',
    'Copy that closes the sale',
    '4–6% conversion across 12 client launches',
    'One afternoon per page',
    'Built by you, on demand, for free',
  ];

  return (
    <section className="bg-black px-4 py-24 sm:px-8 md:py-32">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 text-center md:mb-16">
          <p className="mb-4 text-[10px] uppercase tracking-[0.2em] text-primary/60 sm:text-xs">
            Before · After · Bridge
          </p>
          <h2 className="mx-auto max-w-3xl text-3xl font-normal leading-[1.05] text-primary sm:text-4xl md:text-5xl">
            The same offer. <span className="italic font-serif">Two very different pages.</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <div className="rounded-2xl bg-[#101010] p-6 md:p-8">
            <p className="text-[10px] uppercase tracking-[0.2em] text-primary/40 sm:text-xs">
              Before Claude
            </p>
            <h3 className="mt-2 text-xl font-normal text-primary/70 md:text-2xl">
              You're shipping pages like everyone else.
            </h3>
            <ul className="mt-6 flex flex-col gap-3">
              {before.map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-primary/50 md:text-base">
                  <span className="mt-2 h-1 w-1 flex-shrink-0 rounded-full bg-primary/40" />
                  <span className="line-through decoration-primary/30">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl bg-[#212121] p-6 md:p-8">
            <p className="text-[10px] uppercase tracking-[0.2em] text-primary sm:text-xs">
              After this workshop
            </p>
            <h3 className="mt-2 text-xl font-normal text-primary md:text-2xl">
              You're shipping pages that close.
            </h3>
            <ul className="mt-6 flex flex-col gap-3">
              {after.map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-primary md:text-base">
                  <Check className="mt-1 h-3.5 w-3.5 flex-shrink-0 text-primary" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 rounded-2xl border border-primary/15 bg-black p-6 text-center md:mt-12 md:p-10">
          <p className="text-[10px] uppercase tracking-[0.2em] text-primary/60 sm:text-xs">
            The bridge
          </p>
          <p className="mx-auto mt-3 max-w-3xl text-base text-primary md:text-lg">
            A system of prompts, copywriting frameworks, and a build process I've used to ship
            <span className="italic font-serif"> 40+ pages</span> for paying clients. You get the
            entire kit in the workshop.
          </p>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Curriculum (6 modules)                                               */
/* ------------------------------------------------------------------ */

type Module = {
  number: string;
  title: string;
  outcome: string;
  bullets: string[];
};

const MODULES: Module[] = [
  {
    number: '01',
    title: 'Deconstruct.',
    outcome: 'See why pages convert before you build yours.',
    bullets: [
      'Tear-downs of 5 high-converting pages',
      'The 6 ingredients every one of them shares',
      'The Claude prompt to do this on any page',
    ],
  },
  {
    number: '02',
    title: 'Brief.',
    outcome: 'Turn your offer into a Claude-ready spec.',
    bullets: [
      'The offer-to-brief template',
      'How to encode brand voice in 200 words',
      'The "single source of truth" prompt pattern',
    ],
  },
  {
    number: '03',
    title: 'Design.',
    outcome: 'Prompt taste, hierarchy, and emotion.',
    bullets: [
      'Hero prompts that don’t look templated',
      'Color, type, and spacing systems on demand',
      'How to direct Claude when you’re not a designer',
    ],
  },
  {
    number: '04',
    title: 'Copy.',
    outcome: 'PAS, BAB, PAPA — fed to Claude with proof.',
    bullets: [
      'The 3 copywriting frameworks that close',
      'How to feed proof and avoid AI-mush',
      'Headline, subhead, and CTA prompt stacks',
    ],
  },
  {
    number: '05',
    title: 'Build.',
    outcome: 'From prompt to deployed Vercel URL in one afternoon.',
    bullets: [
      'The exact Claude Code workflow',
      'React + Tailwind scaffolds that ship',
      'Wiring a real waitlist and database (this very page)',
    ],
  },
  {
    number: '06',
    title: 'Convert.',
    outcome: 'A/B prompts, micro-iterations, conversion math.',
    bullets: [
      'The "rewrite this for clarity" prompt loop',
      'Lifting conversion 2–6× with iteration',
      'Instrumenting analytics in 10 minutes',
    ],
  },
];

function Curriculum() {
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="curriculum" className="relative bg-black px-4 py-24 sm:px-6 md:py-32">
      <div className="bg-noise pointer-events-none absolute inset-0 opacity-[0.15]" />
      <div className="relative mx-auto max-w-7xl">
        <div className="mb-12 text-center md:mb-16">
          <p className="mb-4 text-[10px] uppercase tracking-[0.2em] text-primary/60 sm:text-xs">
            The workshop
          </p>
          <WordsPullUpMultiStyle
            className="mx-auto max-w-4xl text-2xl font-normal leading-[1.05] sm:text-3xl md:text-4xl lg:text-5xl"
            segments={[
              { text: 'Six modules. One working sales page.', className: '' },
              { text: 'Built live, with Claude.', className: 'italic font-serif' },
            ]}
          />
          <p className="mx-auto mt-5 max-w-2xl text-sm text-primary/70 md:text-base">
            Step-by-step instructions on how to create sales pages that convert — using Claude as
            your designer, copywriter, and engineer.
          </p>
        </div>

        <div ref={ref} className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
          {MODULES.map((mod, i) => (
            <motion.div
              key={mod.number}
              initial={{ scale: 0.96, opacity: 0 }}
              animate={inView ? { scale: 1, opacity: 1 } : {}}
              transition={{ delay: i * 0.08, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col rounded-xl bg-[#212121] p-6 md:p-7"
            >
              <p className="text-[10px] tracking-[0.2em] text-primary/50 sm:text-xs">
                MODULE {mod.number}
              </p>
              <h3 className="mt-2 text-xl font-medium text-primary md:text-2xl">{mod.title}</h3>
              <p className="mt-2 text-sm text-primary/80 md:text-base">{mod.outcome}</p>
              <ul className="mt-5 flex flex-1 flex-col gap-2.5">
                {mod.bullets.map((b) => (
                  <li key={b} className="flex items-start gap-2">
                    <Check className="mt-1 h-3.5 w-3.5 flex-shrink-0 text-primary" />
                    <span className="text-xs text-primary/70 sm:text-sm">{b}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Benefits                                                             */
/* ------------------------------------------------------------------ */

const BENEFITS = [
  { title: 'Ship in a day.', desc: 'A real, deployed sales page — in one afternoon instead of two weeks.' },
  { title: '4–6× conversion lift.', desc: 'Averaged across 12 client launches vs. their previous template builders.' },
  { title: 'A prompt library you keep.', desc: 'Every prompt I use, ready to copy-paste into your projects forever.' },
  { title: 'Designs that don’t scream AI.', desc: 'Hand-crafted aesthetic, not "ChatGPT made this" templated mush.' },
  { title: 'Copy that sounds like you.', desc: 'Brand-voice prompts that turn Claude into your in-house copywriter.' },
  { title: 'A repeatable system.', desc: 'Use this for every product launch, course, or client engagement going forward.' },
];

function Benefits() {
  return (
    <section className="bg-black px-4 py-24 sm:px-8 md:py-32">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 max-w-3xl md:mb-16">
          <p className="mb-4 text-[10px] uppercase tracking-[0.2em] text-primary/60 sm:text-xs">
            What you walk away with
          </p>
          <h2 className="text-3xl font-normal leading-[1.05] text-primary sm:text-4xl md:text-5xl">
            Skills you'll use on <span className="italic font-serif">every launch</span> from this
            week forward.
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-x-10 gap-y-8 md:grid-cols-2 md:gap-y-10">
          {BENEFITS.map((b) => (
            <div key={b.title} className="flex items-start gap-3">
              <Check className="mt-1.5 h-4 w-4 flex-shrink-0 text-primary" />
              <div>
                <h3 className="text-lg font-medium text-primary md:text-xl">{b.title}</h3>
                <p className="mt-1 text-sm text-primary/70 md:text-base">{b.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Product showcase                                                     */
/* ------------------------------------------------------------------ */

function ProductShowcase({ onJoin }: { onJoin: () => void }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section className="bg-black px-4 py-24 sm:px-8 md:py-32">
      <div ref={ref} className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 md:grid-cols-2 md:gap-16">
        <motion.div
          initial={{ scale: 0.92, opacity: 0, rotate: -3 }}
          animate={inView ? { scale: 1, opacity: 1, rotate: 0 } : {}}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="flex justify-center md:justify-start"
        >
          <img
            src="/product-box.png"
            alt="Build websites with Claude — the complete workshop"
            className="w-full max-w-md drop-shadow-[0_25px_60px_rgba(125,90,255,0.25)]"
            loading="lazy"
          />
        </motion.div>

        <div>
          <p className="mb-4 text-[10px] uppercase tracking-[0.2em] text-primary/60 sm:text-xs">
            What you're getting
          </p>
          <h2 className="text-3xl font-normal leading-[1.05] text-primary sm:text-4xl md:text-5xl">
            One complete workshop. <span className="italic font-serif">Everything you need.</span>
          </h2>
          <p className="mt-5 max-w-lg text-sm text-primary/70 md:text-base">
            Six modules. The full prompt library. The copywriting playbook with PAS, BAB, and PAPA
            templates. The React + Tailwind build kit. Lifetime replay access. One price, locked in
            as a Zenler AI Summit attendee.
          </p>
          <button
            onClick={onJoin}
            className="group mt-8 flex items-center gap-2 rounded-full bg-primary py-1.5 pl-5 pr-1.5 text-sm font-medium text-black transition-all hover:gap-3 sm:py-2 sm:pl-6 sm:pr-2 sm:text-base"
          >
            Lock in my seat
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-black transition-transform group-hover:scale-110 sm:h-11 sm:w-11">
              <ArrowRight className="h-4 w-4 text-primary sm:h-5 sm:w-5" />
            </span>
          </button>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* PAPA closer (Problem · Agitate · Promise · Action) + final CTA       */
/* ------------------------------------------------------------------ */

function PapaCloser({ onJoin }: { onJoin: () => void }) {
  return (
    <section className="relative bg-black px-4 py-24 sm:px-8 md:py-32">
      <div className="bg-noise pointer-events-none absolute inset-0 opacity-[0.15]" />
      <div className="relative mx-auto max-w-5xl">
        <div className="rounded-3xl bg-[#101010] px-6 py-16 text-center sm:px-10 md:px-16 md:py-24">
          <p className="mb-5 text-[10px] uppercase tracking-[0.2em] text-primary/60 sm:text-xs">
            The AI Summit workshop
          </p>

          {/* Problem + Agitate (compressed) */}
          <p className="mx-auto mb-8 max-w-2xl text-sm text-primary/60 md:text-base">
            You don't have two weeks. You don't have $25k. And the AI page builders keep producing
            the same generic template everyone else is shipping.
          </p>

          {/* Promise */}
          <h2 className="mx-auto max-w-3xl text-3xl font-normal leading-[1.05] text-primary sm:text-4xl md:text-5xl lg:text-6xl">
            Build a converting sales page —{' '}
            <span className="italic font-serif">live, in 90 minutes,</span> with Claude.
          </h2>

          {/* Amplify (with proof) */}
          <p className="mx-auto mt-6 max-w-2xl text-sm text-primary/80 md:text-base">
            Summit attendees get the live workshop, the full prompt library, my copywriting
            playbook, and a private launch invite. The same system has produced six-figure launches
            for clients who'd previously paid $25k for pages that flopped. Limited to the first 100
            seats.
          </p>

          {/* Action */}
          <div className="mt-10 flex flex-col items-center gap-3">
            <button
              onClick={onJoin}
              className="group flex items-center gap-2 rounded-full bg-primary py-1.5 pl-5 pr-1.5 text-sm font-medium text-black transition-all hover:gap-3 sm:py-2 sm:pl-6 sm:pr-2 sm:text-base"
            >
              Join the waitlist
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-black transition-transform group-hover:scale-110 sm:h-11 sm:w-11">
                <ArrowRight className="h-4 w-4 text-primary sm:h-5 sm:w-5" />
              </span>
            </button>
            <p className="text-[11px] text-primary/50 sm:text-xs">
              No spam. One email when seats open.
            </p>
          </div>
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
      <ProblemAgitateSolution />
      <BeforeAfterBridge />
      <Curriculum />
      <Benefits />
      <ProductShowcase onJoin={open} />
      <PapaCloser onJoin={open} />
      <CheckoutModal open={waitlistOpen} onClose={close} />
    </main>
  );
}
