// Content for the Resources page. 
// Edit text here, not in the components.

// Each topic is one shelf on the Resources page, in this order
export const TOPICS = [
  { id: "understanding", label: "Understanding PCOS", note: "The basics, and the new name" },
  { id: "body-mind", label: "Your body & mind", note: "Cycles, insulin and mood" },
  { id: "care", label: "Your care", note: "Treatments and appointments" },
] as const;

export type TopicId = (typeof TOPICS)[number]["id"];

// A suggested reading order for someone newly diagnosed
export const START_HERE = ["what-is-pcos", "how-pcos-is-diagnosed", "short-appointments"];

export interface Explainer {
  slug: string; // the URL: /resources/<slug>
  topic: TopicId;
  title: string;
  summary: string;
  sections: { heading: string; paragraphs: string[] }[];
}

export interface TrustedLink {
  title: string;
  source: string;
  description: string;
  url: string;
}

export const GUIDELINE_URL = "https://www.monash.edu/medicine/mchri/pcos/guideline";

export const EXPLAINERS: Explainer[] = [
  {
    slug: "pcos-new-name",
    topic: "understanding",
    title: "PCOS has a new name: PMOS",
    summary: "Why the condition is being renamed, and what it means for you.",
    sections: [
      {
        heading: "What changed",
        paragraphs: [
          "In May 2026, an international group of experts, medical organisations and people living with the condition agreed on a new name for polycystic ovary syndrome (PCOS): polyendocrine metabolic ovarian syndrome, or PMOS.",
        ],
      },
      {
        heading: "Why the name changed",
        paragraphs: [
          "The old name made it sound like the condition was about cysts on the ovaries. Research shows people with it don't actually have more abnormal cysts than anyone else, and the name led many people to feel confused or alarmed.",
          "The new name reflects what the condition really involves: several hormone systems (polyendocrine), how your body uses energy and insulin (metabolic), and ovulation (ovarian). It can affect your cycles, skin, hair, weight, mood and long-term health.",
        ],
      },
      {
        heading: "What it means for you",
        paragraphs: [
          "Nothing about your diagnosis or care changes overnight. The new name is being introduced gradually over about three years, so you'll hear both names for a while, from doctors, websites and apps.",
          "Ask Orchid uses PCOS for now, because it's still the name most people and health services recognise. Both names describe the same condition.",
        ],
      },
    ],
  },
  {
    slug: "what-is-pcos",
    topic: "understanding",
    title: "What PCOS actually is",
    summary: "A common hormone condition that affects far more than your ovaries.",
    sections: [
      {
        heading: "The short version",
        paragraphs: [
          "PCOS is a common, long-term hormone condition. About 10 to 13% of women and people with ovaries have it worldwide, and many don't know yet.",
          "It involves higher levels of androgens (hormones like testosterone), how your body responds to insulin, and how regularly you ovulate.",
        ],
      },
      {
        heading: "How it can show up",
        paragraphs: [
          "Everyone's experience is different. Common signs include irregular or missing periods, acne, extra hair on the face or body, thinning hair on the head, weight changes, low mood or anxiety, and difficulty getting pregnant.",
          "You don't need to have all of these. Some people have mostly cycle changes, others mostly skin or hair changes.",
        ],
      },
      {
        heading: "Worth knowing",
        paragraphs: [
          "PCOS often runs in families. It isn't caused by anything you did.",
          "There's no cure, but there are many ways to manage symptoms, and they can change across your life. A good first step is understanding your own patterns, which is what your journal is for.",
        ],
      },
    ],
  },
  {
    slug: "how-pcos-is-diagnosed",
    topic: "understanding",
    title: "How PCOS is diagnosed",
    summary: "The \"two out of three\" rule, and how it's different for teens.",
    sections: [
      {
        heading: "For adults: two out of three",
        paragraphs: [
          "Doctors usually diagnose PCOS when you have at least two of these three things: irregular cycles or ovulation; signs of higher androgens, either physical (like acne or extra hair growth) or on a blood test; and polycystic ovaries on an ultrasound, or a raised AMH hormone level on a blood test instead of the ultrasound.",
          "If you already have irregular cycles and signs of higher androgens, you don't need an ultrasound or AMH test to be diagnosed.",
        ],
      },
      {
        heading: "Ruling other things out",
        paragraphs: [
          "Your doctor will also check that something else, like a thyroid problem or high prolactin, isn't causing your symptoms. That's why you may be asked for a few blood tests.",
        ],
      },
      {
        heading: "For teens",
        paragraphs: [
          "Cycles are often irregular in the first years after periods start, so diagnosis works differently. Teens need both irregular cycles and signs of higher androgens.",
          "Ultrasound isn't recommended until about 8 years after a first period, and AMH testing isn't used for teens.",
        ],
      },
    ],
  },
  {
    slug: "irregular-cycles",
    topic: "body-mind",
    title: "What counts as an irregular cycle",
    summary: "How to count your cycle, and the numbers doctors look for.",
    sections: [
      {
        heading: "How a cycle is counted",
        paragraphs: [
          "A cycle runs from the first day of one period to the first day of the next. The days you bleed are just the first part of it.",
        ],
      },
      {
        heading: "The numbers",
        paragraphs: [
          "For adults, cycles are usually considered irregular if they're often shorter than 21 days or longer than 35 days, or if you have fewer than 8 periods a year. Any single cycle longer than 90 days is worth mentioning to a doctor.",
          "In the first few years after periods start, cycles are often irregular, and doctors use different thresholds.",
        ],
      },
      {
        heading: "Tracking helps",
        paragraphs: [
          "It's hard to remember cycle dates in an appointment. Mark your period days in your journal, and the Insights page will show your cycle lengths over time, ready to share with your doctor.",
        ],
      },
    ],
  },
  {
    slug: "insulin-resistance",
    topic: "body-mind",
    title: "PCOS and insulin resistance",
    summary: "Why insulin matters in PCOS, at any body size.",
    sections: [
      {
        heading: "What insulin resistance is",
        paragraphs: [
          "Insulin helps move sugar from your blood into your cells. With insulin resistance, your body needs more insulin to do the same job.",
          "It's very common in PCOS, at any body size: it affects about 75% of lean people with PCOS and about 95% of those with a higher weight. Higher insulin can also push your body to make more androgens, which can worsen symptoms like acne and irregular cycles.",
        ],
      },
      {
        heading: "Why it matters long term",
        paragraphs: [
          "People with PCOS have a higher chance of developing type 2 diabetes, whatever their age or weight. That's why the guideline recommends checking blood sugar at diagnosis and then every 1 to 3 years, even if you feel well.",
        ],
      },
      {
        heading: "What can help",
        paragraphs: [
          "Regular movement can improve how your body uses insulin, whatever your weight, and there's no single best diet: healthy eating that suits you and that you can keep up matters most. Some adults, especially those with a BMI of 25 or more, are offered metformin to improve their metabolic health. These are good things to talk through with your doctor.",
        ],
      },
    ],
  },
  {
    slug: "pcos-and-mood",
    topic: "body-mind",
    title: "PCOS and your mood",
    summary: "Low mood and anxiety are common with PCOS, and you deserve support.",
    sections: [
      {
        heading: "You're not imagining it",
        paragraphs: [
          "People with PCOS are more likely to experience depression and anxiety. Body image worries and difficult feelings about food are also more common.",
          "This isn't a personal weakness. It's a recognised part of living with PCOS, and the PCOS guidelines recommend that doctors check in on mental health.",
        ],
      },
      {
        heading: "Getting support",
        paragraphs: [
          "If your mood is low or anxiety is getting in the way, tell your doctor. You can ask directly: \"Could my mood be connected to PCOS?\" Support might include talking therapy, practical strategies or medication.",
          "Logging your mood in your journal can help you notice patterns and explain how you've been feeling.",
        ],
      },
      {
        heading: "If you're struggling right now",
        paragraphs: [
          "If you're thinking about harming yourself or don't feel safe, reach out now. In Canada and the US, you can call or text 988. If you're in immediate danger, call your local emergency number.",
        ],
      },
    ],
  },
  {
    slug: "treatment-options",
    topic: "care",
    title: "Treatment options to talk about",
    summary: "An overview of common options, depending on what matters most to you.",
    sections: [
      {
        heading: "It depends on your goals",
        paragraphs: [
          "There's no single PCOS treatment. The right plan depends on what bothers you most: your cycles, skin or hair, mood, long-term health, or getting pregnant. Your goals can change, and so can your plan.",
        ],
      },
      {
        heading: "Common options",
        paragraphs: [
          "Everyday habits like movement, food, sleep and stress support everyone with PCOS, at any weight.",
          "The combined birth control pill is often used to regulate cycles and help with acne and extra hair growth, for people not trying to get pregnant.",
          "Metformin is mainly used to improve metabolic health, like insulin resistance and cholesterol, especially in adults with a BMI of 25 or more.",
          "If you're trying to get pregnant, letrozole is usually the first medicine offered to help you ovulate.",
          "For hair and skin, there are options ranging from hair removal treatments to medicines that block androgens.",
        ],
      },
      {
        heading: "Making a choice",
        paragraphs: [
          "Every option has benefits and possible side effects. Ask your doctor what each one would do for your goals, so you can decide together.",
        ],
      },
    ],
  },
  {
    slug: "short-appointments",
    topic: "care",
    title: "Making the most of a 10-minute appointment",
    summary: "How to prepare, what to ask, and what to do if you feel dismissed.",
    sections: [
      {
        heading: "Before you go",
        paragraphs: [
          "Write down your top three concerns, most important first. Short appointments go fast, and it's easy to forget things.",
          "Bring your cycle dates and symptoms. Your Insights page shows your cycle lengths, moods and most common symptoms in one place.",
          "List any medicines or supplements you take.",
        ],
      },
      {
        heading: "Questions you can ask",
        paragraphs: [
          "\"Could my symptoms be PCOS?\" \"What tests do I need, and why?\" \"What are my options for the things that bother me most?\" \"What should I watch for, and when should I come back?\"",
        ],
      },
      {
        heading: "If you feel brushed off",
        paragraphs: [
          "You're allowed to ask for your concerns to be written down, to book a follow-up, or to see someone else. You can mention the 2023 International PCOS Guideline, which many doctors use.",
        ],
      },
    ],
  },
];

export const TRUSTED_LINKS: TrustedLink[] = [
  {
    title: "International PCOS Guideline and resources",
    source: "Monash University",
    description:
      "The 2023 international guideline Ask Orchid's answers are based on, with free information for patients.",
    url: GUIDELINE_URL,
  },
  {
    title: "Polycystic ovary syndrome",
    source: "NHS",
    description: "A clear overview of symptoms, causes, diagnosis and treatment.",
    url: "https://www.nhs.uk/conditions/polycystic-ovary-syndrome-pcos/",
  },
  {
    title: "Polycystic ovary syndrome",
    source: "Office on Women's Health",
    description: "Plain-language answers to common questions about PCOS.",
    url: "https://www.womenshealth.gov/a-z-topics/polycystic-ovary-syndrome",
  },
  {
    title: "Verity",
    source: "PCOS charity",
    description: "A charity offering information and community for people with PCOS.",
    url: "https://www.verity-pcos.org.uk",
  },
  {
    title: "PCOS renamed PMOS: what to know",
    source: "Healthline",
    description: "News coverage of the 2026 renaming and why it matters.",
    url: "https://www.healthline.com/health-news/pcos-renamed-pmos-improve-diagnosis-care-multisystem-disease",
  },
];

export function getExplainer(slug: string) {
  return EXPLAINERS.find((e) => e.slug === slug);
}

// About 200 words a minute
export function readMinutes(e: Explainer) {
  const words = e.sections
    .flatMap((s) => [s.heading, ...s.paragraphs])
    .join(" ")
    .split(/\s+/).length;
  return Math.max(1, Math.round(words / 200));
}