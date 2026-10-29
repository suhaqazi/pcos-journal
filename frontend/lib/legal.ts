// Privacy and Terms text. Written to match what Ask Orchid actually does.

import type { Section } from "@/components/layout/ArticleShell";

export const CONTACT_EMAIL = "askmyorchid@gmail.com";
export const LAST_UPDATED = "October 2026";

export const PRIVACY: Section[] = [
  {
    heading: "The short version",
    paragraphs: [
      "Your journal and your question history are private to you. Ask Orchid only collects what it needs to work, never sells your information, shows no ads and uses no tracking.",
    ],
  },
  {
    heading: "What we collect",
    paragraphs: [
      "Your account: your email address, your name, and your date of birth if you choose to add it.",
      "Your journal: what you write, and the moods, period days and symptoms you pick.",
      "Your questions: if you're signed in, the questions you ask and their answers are saved to your private history.",
      "If you use Ask without an account, your questions aren't saved. To keep the daily question limit fair, we store a scrambled code made from your internet address, along with a count. The code can't be turned back into your address.",
      "If you use the contact form: your name, email address and message.",
    ],
  },
  {
    heading: "How your questions are answered",
    paragraphs: [
      "To create an answer, your question is sent to Google's Gemini service along with passages from the international PCOS guideline. Ask Orchid uses Google's paid service, under which Google doesn't use your questions to improve its products.",
      "Even so, it's best not to include your name or other details that identify you in a question.",
    ],
  },
  {
    heading: "Who can see your information",
    paragraphs: [
      "Only you. Your journal, questions and insights are protected so that each person can only ever see their own.",
      "As the person running Ask Orchid, I can technically access the database to keep it working. I don't read journals or questions, and would only look at your data to fix a problem you ask me to help with.",
      "Ask Orchid isn't a healthcare provider, and nothing you write is shared with a doctor or anyone else unless you choose to show it yourself.",
    ],
  },
  {
    heading: "Where it's stored",
    paragraphs: [
      "Your account and data are stored with Supabase, a cloud database provider, and questions are answered using Google. Contact form messages are delivered to my inbox by Resend, an email service. These services may store or process data outside Canada.",
    ],
  },
  {
    heading: "Keeping and deleting your data",
    paragraphs: [
      "Your data is kept for as long as you have an account. You can delete any journal page at any time from the journal.",
      `To delete your whole account and everything in it, email ${CONTACT_EMAIL} from the email address you signed up with. It will be deleted within 30 days.`,
    ],
  },
  {
    heading: "Changes and questions",
    paragraphs: [
      "If this policy changes, the date at the top of this page will change too. For any privacy question, use the contact form or email " + CONTACT_EMAIL + ".",
    ],
  },
];

export const TERMS: Section[] = [
  {
    heading: "Ask Orchid is not medical advice",
    paragraphs: [
      "Ask Orchid shares general information based on the international PCOS guideline, to help you understand your body and prepare for conversations with your healthcare provider. It can't diagnose you, and it's no substitute for a doctor who knows your full picture.",
      "Always talk with a healthcare provider before making decisions about your health or treatment.",
    ],
  },
  {
    heading: "In an emergency",
    paragraphs: [
      "Don't use Ask Orchid for urgent or emergency help. If you're in danger, call 911 or your local emergency number. If you're thinking about harming yourself, you can call or text 988 in Canada and the US.",
    ],
  },
  {
    heading: "Who can use Ask Orchid",
    paragraphs: [
      "You need to be at least 16 years old to create an account. If you're younger, you can still use Ask without an account, because nothing personal is saved for guests.",
      "If you're under 18, we encourage you to use Ask Orchid alongside a parent, guardian or another adult you trust, and to talk with a doctor about anything that worries you.",
    ],
  },
  {
    heading: "Your account and your content",
    paragraphs: [
      "Keep your password private, and let us know if you think someone else has accessed your account.",
      "What you write in your journal belongs to you. You give Ask Orchid permission only to store it and show it back to you.",
    ],
  },
  {
    heading: "Using it fairly",
    paragraphs: [
      "Please don't try to get around the daily question limits, access other people's information, overload the service, or collect content from it automatically.",
    ],
  },
  {
    heading: "About the service",
    paragraphs: [
      "Ask Orchid is an independent project, offered as it is. Features may change, and it may sometimes be unavailable. Answers can be incomplete or wrong, which is another reason to check anything important with your healthcare provider.",
    ],
  },
  {
    heading: "Changes and questions",
    paragraphs: [
      "If these terms change, the date at the top of this page will change too. For any question, use the contact form or email " + CONTACT_EMAIL + ".",
    ],
  },
];