import crypto from 'crypto'

// Configuration
const MASTER_WALLET = process.env.TRON_MASTER_WALLET || ''
const USDT_TRC20_CONTRACT = 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t'
const TRONGRID_API = 'https://api.trongrid.io'
const MONTHLY_PRICE_USDT = 29 // $29 in USDT

interface PaymentAddress {
  address: string
  privateKey: string
  userId: string
  amount: number
  expiresAt: Date
}

/**
 * Generate a unique payment address for a user
 * In production, you'd use TronWeb to generate real addresses
 * For now, we'll use a simplified approach
 */
export function generatePaymentAddress(userId: string): PaymentAddress {
  // Generate a unique identifier
  const uniqueId = crypto.randomBytes(16).toString('hex')

  // In production, use TronWeb to generate a real Tron address
  // For this demo, we'll create a mock address
  const mockAddress = `T${uniqueId.substring(0, 33)}`
  const mockPrivateKey = crypto.randomBytes(32).toString('hex')

  return {
    address: mockAddress,
    privateKey: mockPrivateKey,
    userId,
    amount: MONTHLY_PRICE_USDT,
    expiresAt: new Date(Date.now() + 30 * 60 * 1000), // 30 minutes
  }
}

/**
 * Check if a payment has been received
 * Polls TronGrid API for USDT TRC20 transactions
 */
export async function checkPayment(address: string, expectedAmount: number): Promise<boolean> {
  try {
    // Query TronGrid for TRC20 transfers to this address
    const response = await fetch(
      `${TRONGRID_API}/v1/accounts/${address}/transactions/trc20?limit=10&contract_address=${USDT_TRC20_CONTRACT}`
    )

    if (!response.ok) {
      return false
    }

    const data = await response.json()

    // Check if any transaction matches our expected amount
    if (data.data && Array.isArray(data.data)) {
      for (const tx of data.data) {
        const value = parseInt(tx.value) / 1000000 // USDT has 6 decimals
        if (value >= expectedAmount) {
          return true
        }
      }
    }

    return false
  } catch (error) {
    console.error('Payment check error:', error)
    return false
  }
}

/**
 * Get USDT TRC20 balance of an address
 */
export async function getUSDTBalance(address: string): Promise<number> {
  try {
    const response = await fetch(
      `${TRONGRID_API}/v1/accounts/${address}/transactions/trc20?limit=1&contract_address=${USDT_TRC20_CONTRACT}`
    )

    if (!response.ok) {
      return 0
    }

    const data = await response.json()

    if (data.data && data.data.length > 0) {
      return parseInt(data.data[0].value) / 1000000
    }

    return 0
  } catch (error) {
    console.error('Balance check error:', error)
    return 0
  }
}

/**
 * Verify payment and activate subscription
 */
export async function verifyAndActivatePayment(
  userId: string,
  paymentAddress: string,
  expectedAmount: number
): Promise<{ success: boolean; message: string }> {
  try {
    const isPaid = await checkPayment(paymentAddress, expectedAmount)

    if (!isPaid) {
      return {
        success: false,
        message: 'Payment not found. Please ensure you sent the correct amount.',
      }
    }

    return {
      success: true,
      message: 'Payment verified! Your subscription is now active.',
    }
  } catch (error) {
    console.error('Payment verification error:', error)
    return {
      success: false,
      message: 'Failed to verify payment. Please try again.',
    }
  }
}

/**
 * Get current USDT price (for display purposes)
 */
export function getUSDTPrice(): number {
  return MONTHLY_PRICE_USDT
}

/**
 * Format USDT amount for display
 */
export function formatUSDT(amount: number): string {
  return `${amount.toFixed(2)} USDT`
}
