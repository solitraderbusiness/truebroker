import { Telegraf } from 'telegraf'

let bot: Telegraf | null = null

export function getTelegramBot() {
  const token = process.env.TELEGRAM_BOT_TOKEN

  if (!token) {
    console.warn('Telegram bot token not configured')
    return null
  }

  if (!bot) {
    bot = new Telegraf(token)
  }

  return bot
}

export async function sendSignalToSubscribers(chatIds: string[], signal: any) {
  const bot = getTelegramBot()
  if (!bot) return

  const message = formatSignalMessage(signal)

  for (const chatId of chatIds) {
    try {
      await bot.telegram.sendMessage(chatId, message, { parse_mode: 'HTML' })
    } catch (error) {
      console.error(`Failed to send to ${chatId}:`, error)
    }
  }
}

function formatSignalMessage(signal: any): string {
  const emoji = signal.type === 'BUY' ? '🟢' : '🔴'

  return `
${emoji} <b>${signal.type} ${signal.asset}</b>

💰 Entry Price: ${signal.entryPrice}
${signal.stopLoss ? `🛑 Stop Loss: ${signal.stopLoss}` : ''}
${signal.takeProfit ? `🎯 Take Profit: ${signal.takeProfit}` : ''}
${signal.leverage ? `⚡ Leverage: ${signal.leverage}` : ''}

📊 Market: ${signal.market.toUpperCase()}
${signal.notes ? `\n📝 Notes: ${signal.notes}` : ''}

⏰ ${new Date().toLocaleString()}
  `.trim()
}

export async function startTelegramBot() {
  const bot = getTelegramBot()
  if (!bot) return

  // Handle /start command
  bot.command('start', async (ctx) => {
    const chatId = ctx.chat.id.toString()
    await ctx.reply(
      'Welcome to Premium Trading Signals! 🎯\n\n' +
      'To receive signals, please:\n' +
      '1. Subscribe at our website\n' +
      '2. Link your Telegram account in your dashboard\n' +
      '3. Your chat ID: ' + chatId
    )
  })

  bot.launch()
  console.log('Telegram bot started')
}
