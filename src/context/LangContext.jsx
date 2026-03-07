import React, { createContext, useContext, useState } from 'react';

const LangContext = createContext(null);

// ─── Full translation dictionary ────────────────────────────────────────────
export const translations = {
  en: {
    // ── Navigation ──
    nav_home:    'Home',
    nav_orders:  'Orders',
    nav_income:  'Income',
    nav_routes:  'Routes',
    nav_profile: 'Profile',

    // ── Dashboard ──
    welcome_back:           'Welcome back,',
    availability:           'Availability',
    go_online:              'Go Online',
    go_offline:             'Go Offline',
    take_break:             'Break',
    resume:                 'Resume',
    gps_on:                 'GPS ON',
    locating:               'LOCATING…',
    visible_to_customers:   "You're visible to customers",
    go_online_to_receive:   'Go online to start receiving orders',
    on_break_paused:        'On a break — orders paused',
    performance:            'Performance',
    available_orders:       'Available Orders',
    no_orders_now:          'No orders right now',
    more_in_orders_tab:     'more in Orders tab',
    no_internet:            '📵 No internet — GPS and orders paused',
    onboarding_pending:     'Onboarding Pending',
    status_label:           'Status',
    orders_label:           'Orders',
    rating_label:           'Rating',
    success_label:          'Success',
    earnings_label:         'Earnings',
    all_time:               'All time',
    reviews:                'reviews',
    rate:                   'Rate',
    total:                  'Total',

    // ── Status labels ──
    status_online:   'Online',
    status_offline:  'Offline',
    status_on_break: 'On Break',
    status_busy:     'Busy',

    // ── Orders ──
    orders_page:        'Orders',
    my_deliveries:      'My Deliveries',
    placed:             'Placed',
    accepted:           'Accepted',
    dispatched:         'Dispatched',
    delivered:          'Delivered',
    cancelled:          'Cancelled',
    no_orders:          'No orders yet',
    items:              'items',
    item:               'item',
    accept:             'Accept',
    reject:             'Reject',
    pick_up:            'Pick Up',
    deliver:            'Deliver',
    confirm_delivery:   'Confirm Delivery',
    enter_otp:          'Enter OTP',
    enter_otp_desc:     'Ask the customer for the delivery OTP',
    verify:             'Verify',
    order_detail:       'Order Detail',
    customer:           'Customer',
    pickup:             'Pickup',
    delivery:           'Delivery',
    payment:            'Payment',
    cash_on_delivery:   'Cash on Delivery',
    prepaid:            'Prepaid',
    distance:           'Distance',
    earning:            'Earning',
    order_id:           'Order ID',
    placed_at:          'Placed At',

    // ── Income ──
    income:             'Income',
    my_earnings:        'My Earnings',
    today:              'Today',
    this_week:          'This Week',
    this_month:         'This Month',
    all_time_income:    'All Time',
    total_earnings:     'Total Earnings',
    total_deliveries:   'Total Deliveries',
    avg_per_order:      'Avg / Order',
    recent_payouts:     'Recent Payouts',
    no_payouts:         'No payouts yet',

    // ── Profile ──
    profile:            'Profile',
    manage_account:     'Manage your rider account',
    edit_profile:       'Edit Profile',
    kyc_status:         'KYC Status',
    onboarding:         'Onboarding',
    vehicle:            'Vehicle',
    reg_number:         'Reg. Number',
    complete_setup:     '🚀 Complete Setup',
    personal_profile:   'Personal Profile',
    name_email_info:    'Name, email, and contact info',
    vehicle_details:    'Vehicle Details',
    vehicle_desc:       'Vehicle type and registration number',
    kyc_documents:      'KYC Documents',
    kyc_desc:           'Government ID verification',
    onboarding_app:     'Onboarding Application',
    onboarding_desc:    'Submit for admin review and approval',
    complete_profile:   'Complete Profile',
    add_vehicle:        'Add Vehicle Details',
    submit_kyc:         'Submit KYC',
    submit_onboarding:  'Submit Onboarding Application',
    resubmit:           'Resubmit Application',
    fully_onboarded:    'Fully Onboarded!',
    approved_msg:       "You're approved to accept and deliver orders.",
    under_review:       '⏳ Your application is under review. We\'ll notify you once approved.',
    rejected_msg:       '✗ Application rejected. Please update your details and resubmit.',
    payout_account:     'Payout Account',
    no_payout_added:    'No payout account added yet',
    add_payout:         'Add Payout Account',
    sign_out:           'Sign Out',
    first_name:         'First Name',
    last_name:          'Last Name',
    email:              'Email',
    save:               'Save',
    saving:             'Saving…',
    cancel:             'Cancel',

    // ── KYC / Vehicle modal ──
    vehicle_type:       'Vehicle Type',
    vehicle_number:     'Vehicle Number',
    id_proof_type:      'ID Proof Type',
    id_proof_number:    'ID Number',
    aadhaar:            'Aadhaar Card',
    pan:                'PAN Card',
    driving_licence:    'Driving Licence',
    kyc_note:           'ℹ️ Documents are reviewed by admin and verified within 24–48 hours.',
    submitting:         'Submitting...',
    submit_vehicle:     'Submit Vehicle',

    // ── Bank / UPI ──
    bank:               '🏦 Bank',
    upi:                '📱 UPI',
    account_holder:     'Account Holder Name *',
    account_holder_ph:  'As on bank passbook',
    account_number:     'Account Number *',
    account_number_ph:  'e.g. 1234567890',
    ifsc_code:          'IFSC Code *',
    ifsc_ph:            'e.g. SBIN0001234',
    bank_name:          'Bank Name',
    bank_name_ph:       'e.g. State Bank of India',
    upi_id:             'UPI ID *',
    upi_ph:             'e.g. yourname@upi',
    account_no:         'Account No.',

    // ── Badges ──
    verified:           '✓ Verified',
    pending_review:     '⏳ Under Review',
    rejected:           '✗ Rejected',
    not_submitted:      'Not Submitted',
    approved:           '✓ Approved',

    // ── Settings (in Profile) ──
    settings:           'Settings',
    theme:              'Theme',
    dark_mode:          'Dark Mode',
    light_mode:         'Light Mode',
    language:           'Language',

    // ── Login ──
    welcome:            'Welcome back',
    enter_phone:        'Enter your phone number to receive an OTP',
    phone_number:       'Phone Number',
    phone_hint:         '10-digit numbers get +91 automatically',
    send_otp:           'Send OTP',
    sending_otp:        'Sending OTP...',
    enter_otp_login:    'Enter OTP',
    sent_to:            'Sent to',
    verify_sign_in:     'Verify & Sign In',
    verifying:          'Verifying...',
    resend_in:          'Resend in',
    resend_otp:         'Resend OTP',
    back:               'Back',

    // ── Routes ──
    routes_areas:       'Routes & Areas',
    service_areas:      'Service Areas',
    no_routes:          'No routes assigned yet',

    // ── Notifications ──
    notifications:      'Notifications',
    no_notifications:   'No notifications yet',
    mark_all_read:      'Mark all read',

    // ── General ──
    loading:            'Loading...',
    retry:              'Retry',
    refresh:            'Refresh',
    new_badge:          'NEW',
  },

  hi: {
    // ── Navigation ──
    nav_home:    'होम',
    nav_orders:  'ऑर्डर',
    nav_income:  'कमाई',
    nav_routes:  'रूट',
    nav_profile: 'प्रोफ़ाइल',

    // ── Dashboard ──
    welcome_back:           'वापसी पर स्वागत,',
    availability:           'उपलब्धता',
    go_online:              'ऑनलाइन जाएं',
    go_offline:             'ऑफलाइन जाएं',
    take_break:             'ब्रेक',
    resume:                 'फिर शुरू करें',
    gps_on:                 'GPS चालू',
    locating:               'ढूंढ रहा है…',
    visible_to_customers:   'आप ग्राहकों को दिख रहे हैं',
    go_online_to_receive:   'ऑर्डर पाने के लिए ऑनलाइन जाएं',
    on_break_paused:        'ब्रेक पर हैं — ऑर्डर रुके हुए हैं',
    performance:            'प्रदर्शन',
    available_orders:       'उपलब्ध ऑर्डर',
    no_orders_now:          'अभी कोई ऑर्डर नहीं है',
    more_in_orders_tab:     'और ऑर्डर टैब में',
    no_internet:            '📵 इंटरनेट नहीं — GPS और ऑर्डर रुके हैं',
    onboarding_pending:     'ऑनबोर्डिंग बाकी है',
    status_label:           'स्थिति',
    orders_label:           'ऑर्डर',
    rating_label:           'रेटिंग',
    success_label:          'सफलता',
    earnings_label:         'कमाई',
    all_time:               'सभी समय',
    reviews:                'समीक्षाएं',
    rate:                   'दर',
    total:                  'कुल',

    // ── Status labels ──
    status_online:   'ऑनलाइन',
    status_offline:  'ऑफलाइन',
    status_on_break: 'ब्रेक पर',
    status_busy:     'व्यस्त',

    // ── Orders ──
    orders_page:        'ऑर्डर',
    my_deliveries:      'मेरी डिलीवरी',
    placed:             'रखा गया',
    accepted:           'स्वीकृत',
    dispatched:         'भेजा गया',
    delivered:          'डिलीवर हुआ',
    cancelled:          'रद्द',
    no_orders:          'अभी कोई ऑर्डर नहीं',
    items:              'आइटम',
    item:               'आइटम',
    accept:             'स्वीकार करें',
    reject:             'अस्वीकार करें',
    pick_up:            'उठाएं',
    deliver:            'डिलीवर करें',
    confirm_delivery:   'डिलीवरी कन्फर्म करें',
    enter_otp:          'OTP दर्ज करें',
    enter_otp_desc:     'ग्राहक से डिलीवरी OTP पूछें',
    verify:             'सत्यापित करें',
    order_detail:       'ऑर्डर विवरण',
    customer:           'ग्राहक',
    pickup:             'पिकअप',
    delivery:           'डिलीवरी',
    payment:            'भुगतान',
    cash_on_delivery:   'कैश ऑन डिलीवरी',
    prepaid:            'प्रीपेड',
    distance:           'दूरी',
    earning:            'कमाई',
    order_id:           'ऑर्डर ID',
    placed_at:          'रखा गया',

    // ── Income ──
    income:             'कमाई',
    my_earnings:        'मेरी कमाई',
    today:              'आज',
    this_week:          'इस सप्ताह',
    this_month:         'इस महीने',
    all_time_income:    'सभी समय',
    total_earnings:     'कुल कमाई',
    total_deliveries:   'कुल डिलीवरी',
    avg_per_order:      'औसत / ऑर्डर',
    recent_payouts:     'हाल के भुगतान',
    no_payouts:         'अभी तक कोई भुगतान नहीं',

    // ── Profile ──
    profile:            'प्रोफ़ाइल',
    manage_account:     'अपना राइडर अकाउंट मैनेज करें',
    edit_profile:       'प्रोफ़ाइल संपादित करें',
    kyc_status:         'KYC स्थिति',
    onboarding:         'ऑनबोर्डिंग',
    vehicle:            'वाहन',
    reg_number:         'रजि. नंबर',
    complete_setup:     '🚀 सेटअप पूरा करें',
    personal_profile:   'व्यक्तिगत प्रोफ़ाइल',
    name_email_info:    'नाम, ईमेल और संपर्क जानकारी',
    vehicle_details:    'वाहन विवरण',
    vehicle_desc:       'वाहन प्रकार और पंजीकरण संख्या',
    kyc_documents:      'KYC दस्तावेज़',
    kyc_desc:           'सरकारी ID सत्यापन',
    onboarding_app:     'ऑनबोर्डिंग आवेदन',
    onboarding_desc:    'एडमिन समीक्षा और अनुमोदन के लिए जमा करें',
    complete_profile:   'प्रोफ़ाइल पूरी करें',
    add_vehicle:        'वाहन विवरण जोड़ें',
    submit_kyc:         'KYC जमा करें',
    submit_onboarding:  'ऑनबोर्डिंग आवेदन जमा करें',
    resubmit:           'आवेदन दोबारा जमा करें',
    fully_onboarded:    'पूरी तरह ऑनबोर्ड!',
    approved_msg:       'आप ऑर्डर स्वीकार और डिलीवर करने के लिए स्वीकृत हैं।',
    under_review:       '⏳ आपका आवेदन समीक्षा में है। अनुमोदन पर सूचित किया जाएगा।',
    rejected_msg:       '✗ आवेदन अस्वीकृत। कृपया विवरण अपडेट करें और दोबारा जमा करें।',
    payout_account:     'भुगतान खाता',
    no_payout_added:    'अभी तक कोई भुगतान खाता नहीं जोड़ा',
    add_payout:         'भुगतान खाता जोड़ें',
    sign_out:           'साइन आउट',
    first_name:         'पहला नाम',
    last_name:          'अंतिम नाम',
    email:              'ईमेल',
    save:               'सेव करें',
    saving:             'सेव हो रहा है…',
    cancel:             'रद्द करें',

    // ── KYC / Vehicle modal ──
    vehicle_type:       'वाहन प्रकार',
    vehicle_number:     'वाहन नंबर',
    id_proof_type:      'ID प्रूफ प्रकार',
    id_proof_number:    'ID नंबर',
    aadhaar:            'आधार कार्ड',
    pan:                'पैन कार्ड',
    driving_licence:    'ड्राइविंग लाइसेंस',
    kyc_note:           'ℹ️ दस्तावेज़ एडमिन द्वारा समीक्षा किए जाते हैं और 24–48 घंटों में सत्यापित होते हैं।',
    submitting:         'जमा हो रहा है...',
    submit_vehicle:     'वाहन जमा करें',

    // ── Bank / UPI ──
    bank:               '🏦 बैंक',
    upi:                '📱 UPI',
    account_holder:     'खाताधारक का नाम *',
    account_holder_ph:  'बैंक पासबुक के अनुसार',
    account_number:     'खाता संख्या *',
    account_number_ph:  'जैसे: 1234567890',
    ifsc_code:          'IFSC कोड *',
    ifsc_ph:            'जैसे: SBIN0001234',
    bank_name:          'बैंक का नाम',
    bank_name_ph:       'जैसे: भारतीय स्टेट बैंक',
    upi_id:             'UPI ID *',
    upi_ph:             'जैसे: yourname@upi',
    account_no:         'खाता नंबर',

    // ── Badges ──
    verified:           '✓ सत्यापित',
    pending_review:     '⏳ समीक्षाधीन',
    rejected:           '✗ अस्वीकृत',
    not_submitted:      'जमा नहीं किया',
    approved:           '✓ स्वीकृत',

    // ── Settings ──
    settings:           'सेटिंग्स',
    theme:              'थीम',
    dark_mode:          'डार्क मोड',
    light_mode:         'लाइट मोड',
    language:           'भाषा',

    // ── Login ──
    welcome:            'वापसी पर स्वागत',
    enter_phone:        'OTP पाने के लिए अपना फ़ोन नंबर दर्ज करें',
    phone_number:       'फ़ोन नंबर',
    phone_hint:         '10 अंकों वाले नंबर को +91 अपने आप मिलता है',
    send_otp:           'OTP भेजें',
    sending_otp:        'OTP भेजा जा रहा है...',
    enter_otp_login:    'OTP दर्ज करें',
    sent_to:            'भेजा गया',
    verify_sign_in:     'सत्यापित करें और साइन इन करें',
    verifying:          'सत्यापित हो रहा है...',
    resend_in:          'दोबारा भेजें',
    resend_otp:         'OTP दोबारा भेजें',
    back:               'वापस',

    // ── Routes ──
    routes_areas:       'रूट और क्षेत्र',
    service_areas:      'सेवा क्षेत्र',
    no_routes:          'अभी कोई रूट नहीं दिया गया',

    // ── Notifications ──
    notifications:      'सूचनाएं',
    no_notifications:   'अभी कोई सूचना नहीं',
    mark_all_read:      'सभी पढ़ा हुआ चिह्नित करें',

    // ── General ──
    loading:            'लोड हो रहा है...',
    retry:              'फिर कोशिश करें',
    refresh:            'रीफ्रेश',
    new_badge:          'नया',
  },
};

export function LangProvider({ children }) {
  const [lang, setLang] = useState(() => localStorage.getItem('lang') || 'en');

  const changeLang = (l) => {
    setLang(l);
    localStorage.setItem('lang', l);
  };

  const t = (key) => translations[lang]?.[key] ?? translations['en']?.[key] ?? key;

  return (
    <LangContext.Provider value={{ lang, setLang: changeLang, t, isHindi: lang === 'hi' }}>
      {children}
    </LangContext.Provider>
  );
}

export const useLang = () => {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error('useLang must be inside LangProvider');
  return ctx;
};