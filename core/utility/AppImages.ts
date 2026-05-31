// Import all images using ES6 imports
import logo from '@/presentation/assets/images/logo.svg'
import pesapalLogo from '@/presentation/assets/images/pesapal-logo-with-text.svg'
import pesapalLogoPng from '@/presentation/assets/images/pesapal-logo-with-text.png'
import pesapalMobileIcon from '@/presentation/assets/images/pesapal-mobile-icon.svg'
import pesapalTips from '@/presentation/assets/images/pesapal-tips.svg'
import pesapalSabi from '@/presentation/assets/images/pesapal.sabi.svg'
import merchantLogo from '@/presentation/assets/images/merchant-logo.svg'
import loginPos from '@/presentation/assets/images/LoginPos.png'
import preloader from '@/presentation/assets/images/preloader.svg'
import bell from '@/presentation/assets/images/bell.svg'
import search from '@/presentation/assets/images/search.svg'
import calendar from '@/presentation/assets/images/calendar.svg'
import chat from '@/presentation/assets/images/chat.svg'
import code from '@/presentation/assets/images/code.svg'
import copyIcon from '@/presentation/assets/images/copy-icon.svg'
import createInvoice from '@/presentation/assets/images/create-invoice.svg'
import dropdown from '@/presentation/assets/images/dropdown.svg'
import edit from '@/presentation/assets/images/edit.svg'
import excelIcon from '@/presentation/assets/images/excel-icon.svg'
import eyeHide from '@/presentation/assets/images/eye-hide.svg'
import eyeView from '@/presentation/assets/images/eye-view.svg'
import gen051 from '@/presentation/assets/images/gen051.svg'
import helpIcon from '@/presentation/assets/images/helpicon.svg'
import loan from '@/presentation/assets/images/loan.svg'
import menu from '@/presentation/assets/images/menu.svg'
import nextIcon from '@/presentation/assets/images/next-icon.svg'
import notice from '@/presentation/assets/images/notice.svg'
import openfloatProduct from '@/presentation/assets/images/openfloat-product.svg'
import otpVerification from '@/presentation/assets/images/otp-verification.svg'
import paymentPage from '@/presentation/assets/images/payment-page.svg'
import payment from '@/presentation/assets/images/payment.svg'
import pdfIcon from '@/presentation/assets/images/pdf-icon.svg'
import pesapalTipsIcon from '@/presentation/assets/images/pesapal-tips.svg'
import proceed from '@/presentation/assets/images/proceed.svg'
import transactions from '@/presentation/assets/images/transactions.svg'
import upload1 from '@/presentation/assets/images/upload1.svg'
import upload2 from '@/presentation/assets/images/upload2.svg'
import windows from '@/presentation/assets/images/windows.svg'
import withdrawNotice from '@/presentation/assets/images/withdraw-notic.svg'
import withdraw from '@/presentation/assets/images/withdraw.svg'
import arrowForward from '@/presentation/assets/images/arrow-forward.svg'
import bank from '@/presentation/assets/images/bank.svg'
import blueNoticeAlert from '@/presentation/assets/images/blue-notice-alert.svg'
import business from '@/presentation/assets/images/business.svg'
import deopdown from '@/presentation/assets/images/deopdown.svg'

// Bank icons
import cooperative from '@/presentation/assets/images/bankicons/cooperative.svg'
import dfcu from '@/presentation/assets/images/bankicons/dfcu.svg'
import equity from '@/presentation/assets/images/bankicons/equity.svg'
import kcb from '@/presentation/assets/images/bankicons/kcb.svg'
import ncba from '@/presentation/assets/images/bankicons/ncba.svg'
import openfloat from '@/presentation/assets/images/bankicons/openfloat.svg'
import stanbik from '@/presentation/assets/images/bankicons/stanbik.svg'
import stanchart from '@/presentation/assets/images/bankicons/stanchart.svg'

// payment methods
import masterCard from '@/presentation/assets/images/payment-method-icons/mastercard.svg'
import visa from '@/presentation/assets/images/payment-method-icons/visa.svg'
import tigo from '@/presentation/assets/images/payment-method-icons/tigo.svg'
import mtn from '@/presentation/assets/images/payment-method-icons/mtn.svg'
import mpesa from '@/presentation/assets/images/payment-method-icons/mpesa.svg'
import airtel from '@/presentation/assets/images/payment-method-icons/airtel.svg'

export class AppImages {
  // Logo images
  static readonly LOGO = logo
  static readonly PESAPAL_LOGO = pesapalLogo
  static readonly PESAPAL_LOGO_PNG = pesapalLogoPng
  static readonly PESAPAL_MOBILE_ICON = pesapalMobileIcon
  static readonly PESAPAL_TIPS = pesapalTips
  static readonly PESAPAL_SABI = pesapalSabi
  static readonly MERCHANT_LOGO = merchantLogo
  static readonly LOGIN_POS = loginPos
  static readonly PRELOADER = preloader

  // UI Icons
  static readonly BELL = bell
  static readonly SEARCH = search
  static readonly CALENDAR = calendar
  static readonly CHAT = chat
  static readonly CODE = code
  static readonly COPY_ICON = copyIcon
  static readonly CREATE_INVOICE = createInvoice
  static readonly DROPDOWN = dropdown
  static readonly EDIT = edit
  static readonly EXCEL_ICON = excelIcon
  static readonly EYE_HIDE = eyeHide
  static readonly EYE_VIEW = eyeView
  static readonly GEN051 = gen051
  static readonly HELP_ICON = helpIcon
  static readonly LOAN = loan
  static readonly MENU = menu
  static readonly NEXT_ICON = nextIcon
  static readonly NOTICE = notice
  static readonly OPENFLOAT_PRODUCT = openfloatProduct
  static readonly OTP_VERIFICATION = otpVerification
  static readonly PAYMENT_PAGE = paymentPage
  static readonly PAYMENT = payment
  static readonly PDF_ICON = pdfIcon
  static readonly PESAPAL_TIPS_ICON = pesapalTipsIcon
  static readonly PROCEED = proceed
  static readonly TRANSACTIONS = transactions
  static readonly UPLOAD1 = upload1
  static readonly UPLOAD2 = upload2
  static readonly WINDOWS = windows
  static readonly WITHDRAW_NOTICE = withdrawNotice
  static readonly WITHDRAW = withdraw
  static readonly ARROW_FORWARD = arrowForward
  static readonly BANK = bank
  static readonly BLUE_NOTICE_ALERT = blueNoticeAlert
  static readonly BUSINESS = business
  static readonly DEOPDOWN = deopdown

  // Bank Icons
  static readonly BANK_COOPERATIVE = cooperative
  static readonly BANK_DFCU = dfcu
  static readonly BANK_EQUITY = equity
  static readonly BANK_KCB = kcb
  static readonly BANK_NCBA = ncba
  static readonly BANK_OPENFLOAT = openfloat
  static readonly BANK_STANBIK = stanbik
  static readonly BANK_STANCHART = stanchart

  // payment methods
  static readonly MASTER_CARD = masterCard
  static readonly VISA = visa
  static readonly TIGO = tigo
  static readonly MPESA = mpesa
  static readonly MTN = mtn
  static readonly AIRTEL = airtel

  // Helper method to get bank icon by name
  static getBankIcon(bankName: string): string {
    const bankIcons: Record<string, string> = {
      cooperative: this.BANK_COOPERATIVE,
      dfcu: this.BANK_DFCU,
      equity: this.BANK_EQUITY,
      kcb: this.BANK_KCB,
      ncba: this.BANK_NCBA,
      openfloat: this.BANK_OPENFLOAT,
      stanbik: this.BANK_STANBIK,
      stanchart: this.BANK_STANCHART,
    }

    const normalizedName = bankName.toLowerCase().replace(/\s+/g, '')
    return bankIcons[normalizedName] || this.BANK // fallback to generic bank icon
  }

  // Helper method to get all bank icons
  static getAllBankIcons(): Record<string, string> {
    return {
      cooperative: this.BANK_COOPERATIVE,
      dfcu: this.BANK_DFCU,
      equity: this.BANK_EQUITY,
      kcb: this.BANK_KCB,
      ncba: this.BANK_NCBA,
      openfloat: this.BANK_OPENFLOAT,
      stanbik: this.BANK_STANBIK,
      stanchart: this.BANK_STANCHART,
    }
  }

  static getPaymentMethod(paymentMethod: string): string {
    console.log('paymentMethod', paymentMethod)
    const paymentMethodIcons: Record<string, string> = {
      mastercard: this.MASTER_CARD,
      visa: this.VISA,
      tigo: this.TIGO,
      mtn: this.MTN,
      mpesa: this.MPESA,
      airtel: this.AIRTEL,
    }
    const normalizedName = paymentMethod.toLowerCase().replace(/\s+/g, '')
    return paymentMethodIcons[normalizedName] || this.MASTER_CARD // fallback to mastercard
  }
}

// Export individual images for backward compatibility
export const AppImagesMap = {
  logo: AppImages.LOGO,
  pesapalLogo: AppImages.PESAPAL_LOGO,
  pesapalLogoPng: AppImages.PESAPAL_LOGO_PNG,
  pesapalMobileIcon: AppImages.PESAPAL_MOBILE_ICON,
  pesapalTips: AppImages.PESAPAL_TIPS,
  pesapalSabi: AppImages.PESAPAL_SABI,
  merchantLogo: AppImages.MERCHANT_LOGO,
  loginPos: AppImages.LOGIN_POS,
  preloader: AppImages.PRELOADER,
  bell: AppImages.BELL,
  search: AppImages.SEARCH,
  calendar: AppImages.CALENDAR,
  chat: AppImages.CHAT,
  code: AppImages.CODE,
  copyIcon: AppImages.COPY_ICON,
  createInvoice: AppImages.CREATE_INVOICE,
  dropdown: AppImages.DROPDOWN,
  edit: AppImages.EDIT,
  excelIcon: AppImages.EXCEL_ICON,
  eyeHide: AppImages.EYE_HIDE,
  eyeView: AppImages.EYE_VIEW,
  gen051: AppImages.GEN051,
  helpIcon: AppImages.HELP_ICON,
  loan: AppImages.LOAN,
  masterCard: AppImages.MASTER_CARD,
  menu: AppImages.MENU,
  nextIcon: AppImages.NEXT_ICON,
  notice: AppImages.NOTICE,
  openfloatProduct: AppImages.OPENFLOAT_PRODUCT,
  otpVerification: AppImages.OTP_VERIFICATION,
  paymentPage: AppImages.PAYMENT_PAGE,
  payment: AppImages.PAYMENT,
  pdfIcon: AppImages.PDF_ICON,
  pesapalTipsIcon: AppImages.PESAPAL_TIPS_ICON,
  proceed: AppImages.PROCEED,
  transactions: AppImages.TRANSACTIONS,
  upload1: AppImages.UPLOAD1,
  upload2: AppImages.UPLOAD2,
  windows: AppImages.WINDOWS,
  withdrawNotice: AppImages.WITHDRAW_NOTICE,
  withdraw: AppImages.WITHDRAW,
  arrowForward: AppImages.ARROW_FORWARD,
  bank: AppImages.BANK,
  blueNoticeAlert: AppImages.BLUE_NOTICE_ALERT,
  business: AppImages.BUSINESS,
  deopdown: AppImages.DEOPDOWN,
}
