import { Resend } from 'resend'

let _resend: Resend | null = null

export const getResend = () => {
  if (!_resend) {
    _resend = new Resend(process.env.RESEND_API_KEY || '')
  }
  return _resend
}

// backward compat
export const resend = {
  get emails() {
    return getResend().emails
  },
}
