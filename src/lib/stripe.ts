import Stripe from 'stripe'
import { loadStripe, type Stripe as StripeClient } from '@stripe/stripe-js'

let _stripe: Stripe | null = null

export const getServerStripe = () => {
  if (!_stripe) {
    _stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
      apiVersion: '2026-03-25.dahlia',
    })
  }
  return _stripe
}

// Keep backward compat export
export const stripe = {
  get checkout() {
    return getServerStripe().checkout
  },
}

let stripePromise: Promise<StripeClient | null> | null = null

export const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '')
  }
  return stripePromise
}
