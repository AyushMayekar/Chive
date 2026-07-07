const ACCEPTED_HOSTS = [
  "chatgpt.com",
  "chat.openai.com",
  "claude.ai",
  "gemini.google.com",
  "g.co",
  "perplexity.ai",
  "chat.deepseek.com",
];

const BLOCKED_SHORTENER_HOSTS = ["bit.ly", "tinyurl.com", "t.co", "goo.gl", "is.gd"];

export const TITLE_MIN = 6;
export const TITLE_MAX = 120;
export const SUMMARY_MIN = 40;
export const SUMMARY_MAX = 600;

export function validateShareUrl(raw: string): string | null {
  const value = raw.trim();
  if (!value) return "Share URL is required.";

  let url: URL;
  try {
    url = new URL(value);
  } catch {
    return "Enter a valid URL, including https://";
  }

  if (url.protocol !== "https:") {
    return "Share links must use HTTPS.";
  }

  const host = url.hostname.replace(/^www\./, "");

  if (BLOCKED_SHORTENER_HOSTS.includes(host)) {
    return "Shortened links aren't accepted — paste the original share URL.";
  }

  const isAccepted = ACCEPTED_HOSTS.some((accepted) => host === accepted || host.endsWith(`.${accepted}`));
  if (!isAccepted) {
    return "This domain isn't a supported AI platform share link.";
  }

  return null;
}

export function validateTitle(raw: string): string | null {
  const value = raw.trim();
  if (!value) return "Title is required.";
  if (/\s{2,}/.test(value)) return "Remove duplicate spaces in the title.";
  if (value.length < TITLE_MIN) return `Title must be at least ${TITLE_MIN} characters.`;
  if (value.length > TITLE_MAX) return `Title must be under ${TITLE_MAX} characters.`;
  return null;
}

export function validateSummary(raw: string): string | null {
  const value = raw.trim();
  if (!value) return "Summary is required.";
  if (value.length < SUMMARY_MIN) return `Summary must be at least ${SUMMARY_MIN} characters.`;
  if (value.length > SUMMARY_MAX) return `Summary must be under ${SUMMARY_MAX} characters.`;
  return null;
}

export function validateEmail(raw: string): string | null {
  const value = raw.trim();
  if (!value) return null; // optional
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!re.test(value)) return "Enter a valid email address.";
  return null;
}

export function validateRequired(raw: string, label: string): string | null {
  if (!raw.trim()) return `${label} is required.`;
  return null;
}
