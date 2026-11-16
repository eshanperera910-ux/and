
import { buildMenu } from "../lib/menu.js";

function formatDuration(seconds) {
  let remaining = Math.max(0, Math.floor(Number(seconds) || 0));
  const days = Math.floor(remaining / 86400);
  remaining %= 86400;
  const hours = Math.floor(remaining / 3600);
  remaining %= 3600;
  const minutes = Math.floor(remaining / 60);
  const secs = remaining % 60;
  const parts = [];
  if (days) parts.push(days + "d");
  if (hours) parts.push(hours + "h");
  if (minutes) parts.push(minutes + "m");
  if (secs || !parts.length) parts.push(secs + "s");
  return parts.join(" ");
}

function messageTimestampMs(message) {
  const raw = message && message.messageTimestamp;
  const value = raw && typeof raw.toNumber === "function" ? raw.toNumber() : Number(raw);
  if (!Number.isFinite(value) || value <= 0) return null;
  return value > 1000000000000 ? value : value * 1000;
}

function ownerNumber(config) {
  const owners = Array.isArray(config.ownerNumbers) ? config.ownerNumbers : [];
  return String(owners[0] || "").replace(/\D/g, "");
}

const commands = [
  {
    name: "menu",
    aliases: ["helpme"],
    category: "General",
    description: "Show the branded PANDA-MD menu and available command sections.",
    run: async ctx => {
      const menu = buildMenu({ commands: ctx.commands, config: ctx.config, theme: ctx.theme });
      if (ctx.config.imageUrl) {
        try {
          await ctx.send({
            image: { url: ctx.config.imageUrl },
            caption: "🤖 *『ＰＡＮＤＡ-ＭＤ』*\n" +
              "✦ Official WhatsApp Bot\n" +
              "⚡ Powered by PANDA HOLDING'S (PVT) LTD"
          });
        } catch (error) {
          console.warn("PANDA-MD menu artwork could not be sent; using the text menu:", error?.message || error);
        }
      }
      await ctx.reply(menu);
    }
  },
  {
    name: "help",
    category: "General",
    description: "List registered commands and their descriptions.",
    run: async ctx => {
      const rows = (ctx.commands || [])
        .filter(command => !command.hidden)
        .slice()
        .sort((a, b) => a.name.localeCompare(b.name))
        .map(command => ctx.config.prefix + command.name + (command.description ? " — " + command.description : ""));
      const header = "╭━━⦿ ＰＡＮＤＡ-ＭＤ ＨＥＬＰ ⦿━━━┈✦\n" +
        "┃ ❖ " + rows.length + " registered commands\n\n";
      const chunks = [];
      let current = header;
      for (const row of rows) {
        if (current.length + row.length + 1 > 3300) {
          chunks.push(current.trimEnd());
          current = "╭━━⦿ ＨＥＬＰ (ᴄᴏɴᴛɪɴᴜᴇᴅ) ⦿━━━┈✦\n\n";
        }
        current += "┃ ➥│ " + row + "\n";
      }
      if (current.trim()) chunks.push(current.trimEnd());
      for (const chunk of chunks) {
        await ctx.reply(chunk + "\n╰━━━━━━━━━━━━┈✦");
      }
    }
  },
  {
    name: "ping",
    category: "General",
    description: "Check bot responsiveness and estimated message response time.",
    run: async ctx => {
      const timestamp = messageTimestampMs(ctx.msg);
      const responseMs = timestamp === null ? null : Math.max(0, Date.now() - timestamp);
      await ctx.reply([
        "╭━━⦿ 🏓 ＰＡＮＤＡ-ＭＤ · ＰＯＮＧ ⦿━━━┈✦",
        "┃ ❖ Status: " + (ctx.connectionOpen ? "Online 🟢" : "Connecting 🟡"),
        "┃ ❖ Response: " + (responseMs === null ? "Unavailable" : responseMs + " ms"),
        "┃ ❖ Uptime: " + formatDuration(process.uptime()),
        "┃ ❖ Version: " + ctx.config.version,
        "╰━━━━━━━━━━━━━━━━━━━━┈✦"
      ].join("\n"));
    }
  },
  {
    name: "alive",
    aliases: ["uptime"],
    category: "General",
    description: "Show bot status, mode and uptime.",
    run: async ctx => {
      await ctx.reply(
        "╭━━⦿ ＰＡＮＤＡ-ＭＤ ⦿━━━┈✦" +
        "\n┃ ❖ Status: " + (ctx.connectionOpen ? "Online 🟢" : "Connecting 🟡") +
        "\n┃ ❖ Mode: " + String(ctx.mode || "public").toUpperCase() +
        "\n┃ ❖ Uptime: " + formatDuration(process.uptime()) +
        "\n┃ ❖ Powered by PANDA HOLDING'S" +
        "\n╰━━━━━━━━━━━━┈✦"
      );
    }
  },
  {
    name: "owner",
    category: "General",
    description: "Show PANDA-MD owner details.",
    run: async ctx => {
      const number = ownerNumber(ctx.config);
      await ctx.reply(
        "╭━━⦿ 👑 ＯＷＮＥＲ ＩＮＦＯ ⦿━━━┈✦" +
        "\n┃ ❖ Owner: " + ctx.config.ownerName +
        (number ? "\n┃ ❖ Owner number: +" + number : "") +
        "\n┃ ❖ Organization: PANDA HOLDING'S (PVT) LTD" +
        "\n╰━━━━━━━━━━━━┈✦"
      );
    }
  },
  {
    name: "support",
    category: "General",
    description: "Show support guidance for PANDA-MD.",
    run: async ctx => {
      await ctx.reply(
        "╭━━⦿ 🛟 ＰＡＮＤＡ-ＭＤ ＳＵＰＰＯＲＴ ⦿━━━┈✦" +
        "\n┃ ❖ For setup help or bug reports, contact " +
        ctx.config.ownerName + "." +
        "\n┃ ❖ GitHub: https://github.com/Benfeitech/FEI-XMD" +
        "\n╰━━━━━━━━━━━━┈✦"
      );
    }
  },
  {
    name: "time",
    category: "General",
    description: "Show the current server time in Nigeria.",
    run: async ctx => {
      const value = new Intl.DateTimeFormat("en-NG", {
        timeZone: "Africa/Lagos",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true
      }).format(new Date());
      await ctx.reply(
        "╭━━⦿ 🕒 ＳＥＲＶＥＲ ＴＩＭＥ ⦿━━━┈✦" +
        "\n┃ ❖ Nigeria: " + value +
        "\n╰━━━━━━━━━━━━┈✦"
      );
    }
  },
  {
    name: "date",
    category: "General",
    description: "Show the current date in Nigeria.",
    run: async ctx => {
      const value = new Intl.DateTimeFormat("en-NG", {
        timeZone: "Africa/Lagos",
        weekday: "long",
        day: "2-digit",
        month: "long",
        year: "numeric"
      }).format(new Date());
      await ctx.reply(
        "╭━━⦿ 📅 ＳＥＲＶＥＲ ＤＡＴＥ ⦿━━━┈✦" +
        "\n┃ ❖ Nigeria: " + value +
        "\n╰━━━━━━━━━━━━┈✦"
      );
    }
  },
  {
    name: "version",
    category: "General",
    description: "Show PANDA-MD version and connection status.",
    run: async ctx => {
      await ctx.reply(
        "╭━━⦿ 🤖 ＢＯＴ ＩＮＦＯ ⦿━━━┈✦" +
        "\n┃ ❖ Name: " + ctx.config.name +
        "\n┃ ❖ Version: " + ctx.config.version +
        "\n┃ ❖ Status: " + (ctx.connectionOpen ? "Online 🟢" : "Connecting 🟡") +
        "\n┃ ❖ Mode: " + String(ctx.mode || "public").toUpperCase() +
        "\n┃ ❖ Baileys: Official WhiskeySockets npm package" +
        "\n╰━━━━━━━━━━━━┈✦"
      );
    }
  },
  {
    name: "jid",
    aliases: ["id"],
    category: "General",
    description: "Show the current chat and message sender IDs.",
    run: async ctx => {
      await ctx.reply(
        "╭━━⦿ 🆔 ＣＨＡＴ ＩＤ ⦿━━━┈✦" +
        "\n┃ ❖ Chat ID: " + ctx.jid +
        "\n┃ ❖ Sender ID: " + (ctx.senderJid || "Unavailable") +
        "\n╰━━━━━━━━━━━━┈✦"
      );
    }
  },
  {
    name: "whoami",
    category: "General",
    description: "Show your WhatsApp sender information.",
    run: async ctx => {
      await ctx.reply(
        "╭━━⦿ 👤 ＵＳＥＲ ＩＮＦＯ ⦿━━━┈✦" +
        "\n┃ ❖ Name: " + (ctx.msg?.pushName || "Unknown") +
        "\n┃ ❖ Your ID: " + (ctx.senderJid || "Unavailable") +
        "\n┃ ❖ Owner: " + (ctx.owner ? "Yes 👑" : "No") +
        "\n╰━━━━━━━━━━━━┈✦"
      );
    }
  }
];

export default commands;
