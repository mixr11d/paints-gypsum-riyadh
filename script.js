/**
 * Riyadh Gypsum & Paints - Dynamic Functionality & Centralized Google Ads Tracking
 */

// ==========================================================================
// 1. CONFIGURATION: GOOGLE ADS METRICS & CLIENT PHONE
// ==========================================================================
const GOOGLE_ADS_ID = 'AW-18373155241'; // ضع معرّف الإعلانات هنا مثل: 'AW-123456789'
const CONVERSION_LABEL_CALL = 'Cw5OCJyMqd0cEKmzgLlE'; // ملصق تحويل الاتصال
const CONVERSION_LABEL_WHATSAPP = 'mvLUCJ-Mqd0cEKmzgLlE'; // ملصق تحويل الواتساب
const CONVERSION_LABEL_FORM = 'g0TMCP_Jlt0cEKmzgLlE'; // ملصق تحويل النموذج

const CLIENT_PHONE = '0554578033';
const CLIENT_WHATSAPP_NUM = '966554578033';

// ==========================================================================
// 2. DYNAMIC GOOGLE TAG INJECTION
// ==========================================================================
if (GOOGLE_ADS_ID && GOOGLE_ADS_ID.trim() !== '') {
  const gtagScript = document.createElement('script');
  gtagScript.async = true;
  gtagScript.src = `https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ADS_ID}`;
  document.head.appendChild(gtagScript);

  window.dataLayer = window.dataLayer || [];
  function gtag(){ dataLayer.push(arguments); }
  window.gtag = gtag;
  gtag('js', new Date());
  gtag('config', GOOGLE_ADS_ID);
}

// Function to trigger Google Ads Conversion Event safely
function trackConversion(label, callback) {
  if (typeof gtag === 'function' && GOOGLE_ADS_ID && label) {
    gtag('event', 'conversion', {
      'send_to': `${GOOGLE_ADS_ID}/${label}`,
      'event_callback': callback
    });
    // Fallback if callback isn't fired quickly
    setTimeout(callback, 500);
  } else {
    callback();
  }
}

// ==========================================================================
// 3. UI INITIALIZATION & EVENT LISTENERS
// ==========================================================================
document.addEventListener('DOMContentLoaded', () => {
  
  // Mobile Navigation Drawer Toggle
  const mobileToggle = document.getElementById('mobileToggle');
  const navMenu = document.getElementById('navMenu');
  const menuOverlay = document.getElementById('menuOverlay');

  if (mobileToggle && navMenu && menuOverlay) {
    const toggleMenu = () => {
      navMenu.classList.toggle('active');
      menuOverlay.classList.toggle('active');
      document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    };

    mobileToggle.addEventListener('click', toggleMenu);
    menuOverlay.addEventListener('click', toggleMenu);
  }

  // On-Touch Dropdown Toggle for Mobile & Desktop
  const dropdownToggle = document.getElementById('servicesDropdown');
  const dropdownMenu = document.getElementById('dropdownMenu');

  if (dropdownToggle && dropdownMenu) {
    dropdownToggle.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      dropdownMenu.classList.toggle('show');
    });

    // Close dropdown on click outside
    document.addEventListener('click', (e) => {
      if (!dropdownToggle.contains(e.target) && !dropdownMenu.contains(e.target)) {
        dropdownMenu.classList.remove('show');
      }
    });
  }

  // Scroll To Top Button Logic
  const scrollTopBtn = document.getElementById('scrollTopBtn');
  if (scrollTopBtn) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 300) {
        scrollTopBtn.classList.add('show');
      } else {
        scrollTopBtn.classList.remove('show');
      }
    });

    scrollTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // FAQ Accordion Toggle
  const faqQuestions = document.querySelectorAll('.faq-question');
  faqQuestions.forEach(question => {
    question.addEventListener('click', () => {
      const faqItem = question.parentElement;
      const isOpen = faqItem.classList.contains('active');
      
      // Close all other items
      document.querySelectorAll('.faq-item').forEach(item => {
        item.classList.remove('active');
      });

      if (!isOpen) {
        faqItem.classList.add('active');
      }
    });
  });

  // Dynamic Handling of Direct Call Actions
  const callActionBtns = document.querySelectorAll('.action-call');
  callActionBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      trackConversion(CONVERSION_LABEL_CALL, () => {
        window.location.href = `tel:${CLIENT_PHONE}`;
      });
    });
  });

  // Dynamic Handling of Direct WhatsApp Actions
  const whatsappActionBtns = document.querySelectorAll('.action-whatsapp');
  whatsappActionBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const message = encodeURIComponent('السلام عليكم، أود الاستفسار عن خدمات الجبس والدهانات المتاحة لديكم.');
      trackConversion(CONVERSION_LABEL_WHATSAPP, () => {
        window.open(`https://wa.me/${CLIENT_WHATSAPP_NUM}?text=${message}`, '_blank');
      });
    });
  });

  // Dynamic Lead Form Submission Handling
  const leadForm = document.getElementById('leadForm');
  if (leadForm) {
    leadForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('clientName').value.trim();
      const phone = document.getElementById('clientPhone').value.trim();
      const district = document.getElementById('clientDistrict').value.trim();
      const service = document.getElementById('clientService').value;

      if (!name || !phone || !district) {
        alert('يرجى تعبئة كافة الحقول المطلوبة.');
        return;
      }

      const formattedMessage = `طلب معاينة جديدة عبر الموقع:%0A` +
        `• الاسم: ${encodeURIComponent(name)}%0A` +
        `• الجوال: ${encodeURIComponent(phone)}%0A` +
        `• الحي: ${encodeURIComponent(district)}%0A` +
        `• الخدمة المطلوبة: ${encodeURIComponent(service)}`;

      const submitBtn = leadForm.querySelector('button[type="submit"]');
      const originalBtnText = submitBtn.innerHTML;
      submitBtn.innerHTML = 'جاري إرسال الطلب...';
      submitBtn.disabled = true;

      trackConversion(CONVERSION_LABEL_FORM, () => {
        window.open(`https://wa.me/${CLIENT_WHATSAPP_NUM}?text=${formattedMessage}`, '_blank');
        leadForm.reset();
        submitBtn.innerHTML = originalBtnText;
        submitBtn.disabled = false;
      });
    });
  }

});
