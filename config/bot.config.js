const digits = value => String(value || "").replace(/\D/g, "");

const configuredOwnerNumber = digits(process.env.OWNER_NUMBER);
const ownerNumber = configuredOwnerNumber || "2349060715145";
const configuredPrefix = process.env.PREFIX;
const prefix = configuredPrefix === undefined || configuredPrefix === "" ? "." : String(configuredPrefix);

const channel = Object.freeze({
  name: "PANDA - MD",
  jid: "120363415046561807@newsletter"
});

export default Object.freeze({
  name: String(process.env.BOT_NAME || "PANDA - MD").trim() || "PANDA - MD",
  version: String(process.env.BOT_VERSION || "1.0.0").trim() || "1.0.0",
  prefix,
  ownerName: String(process.env.OWNER_NAME || "𝐄ꜱʜᴀɴ 𝐏ᴇʀᴇʀᴀ").trim() || "Benfei Tech",
  ownerNumber,
  ownerNumbers: Object.freeze([ownerNumber]),
  defaultMode: String(process.env.BOT_MODE || "public").toLowerCase() === "private" ? "private" : "public",
  sessionDirectory: String(process.env.FEI_SESSION_DIR || "./auth_info_baileys").trim() || "./auth_info_baileys",
  dataDirectory: String(process.env.FEI_DATA_DIR || "./data").trim() || "./data",
  logLevel: String(process.env.LOG_LEVEL || "info").trim().toLowerCase(),
  browser: "Chrome",
  channel,
  imageUrl: String(
    process.env.BOT_IMAGE_URL ||
    "https://res.cloudinary.com/dqqyvozdw/image/upload/v1794804855/p1dyl845mh2cufewm3ns.png"
  ).trim(),
  botUrl: String(process.env.BOT_URL || "https://pandaadvertising.lovable.app").trim()
});
