import { startTelegramBot } from '../lib/telegram'

console.log('Starting Telegram bot...')

startTelegramBot()

console.log('Telegram bot is running!')

// Keep the process alive
process.on('SIGINT', () => {
  console.log('Stopping bot...')
  process.exit()
})
