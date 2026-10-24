/**
 * The "ask me" tab. No model, no API: a fixed set of questions with written answers.
 */

export type ChatEntry = {
  id: string;
  question: string;
  answer: string;
};

export const chatbot = {
  greeting: "Evening, curious visitor. I only know one topic tonight. Pick a question below.",
  disclaimer: "This one is on a strict diet of pre-written questions.",
  entries: [
    {
      id: "who",
      question: "who are you?",
      answer:
        "A full-stack product engineer. I take a fuzzy problem, shape it into something buildable, and ship it end to end: interface, API, data, and the deploy that gets it to people.",
    },
    {
      id: "work",
      question: "what do you actually work on?",
      answer:
        "Lately: approval flows, deploy pipelines, and search. The common thread is products with a lot of moving parts and a small team that needs them to just work.",
    },
    {
      id: "frontend-backend",
      question: "frontend or backend?",
      answer:
        "Both, on purpose. The best fixes usually sit at the seam, and it is hard to find the seam if you only ever stand on one side of it.",
    },
    {
      id: "how",
      question: "how do you work?",
      answer:
        "Frame the problem, cut scope until the first version fits in a week, ship it, measure it, then decide what is next with real numbers.",
    },
    {
      id: "outside",
      question: "what are you like outside work?",
      answer: "Long walks uphill, long drives with the music up, and too many browser tabs open at once.",
    },
    {
      id: "contact",
      question: "how do I reach you?",
      answer: "Email is best. The address is in the footer and in the header, and I reply to real people.",
    },
  ] satisfies ChatEntry[],
};
