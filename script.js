document.addEventListener('click', (event) => {
  const menuToggle = event.target.closest('.menu-toggle');
  const siteHeader = document.querySelector('.site-header');
  const siteNav = document.querySelector('.site-nav');

  if (menuToggle && siteHeader && siteNav) {
    const isOpen = siteHeader.classList.toggle('is-open');
    siteNav.classList.toggle('is-open', isOpen);
    menuToggle.setAttribute('aria-expanded', String(isOpen));
    return;
  }

  if (event.target.closest('.site-nav a') && siteHeader && siteNav) {
    siteNav.classList.remove('is-open');
    siteHeader.classList.remove('is-open');
    document.querySelector('.menu-toggle')?.setAttribute('aria-expanded', 'false');
  }
});

function renderBusinessCalendar() {
  const calendarMonth = document.querySelector('#calendar-month');
  const businessCalendar = document.querySelector('#business-calendar');
  const calendarWeekdays = document.querySelector('.calendar-weekdays');

  if (!calendarMonth || !businessCalendar || !calendarWeekdays) return;

  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const weekdays = ['日', '月', '火', '水', '木', '金', '土'];

  businessCalendar.replaceChildren();
  calendarMonth.textContent = `${year}.${String(month + 1).padStart(2, '0')}`;
  calendarWeekdays.innerHTML = weekdays.map((day) => `<span>${day}</span>`).join('');

  for (let blank = 0; blank < firstDay; blank += 1) {
    businessCalendar.insertAdjacentHTML('beforeend', '<span class="calendar-day is-blank" aria-hidden="true"></span>');
  }

  for (let date = 1; date <= daysInMonth; date += 1) {
    const currentDate = new Date(year, month, date);
    const dayOfWeek = currentDate.getDay();
    const mondayOccurrence = Math.ceil(date / 7);
    const isClosed = dayOfWeek === 3 || (dayOfWeek === 1 && (mondayOccurrence === 1 || mondayOccurrence === 3));
    const isToday = date === today.getDate();
    const classes = ['calendar-day', isClosed ? 'is-closed' : 'is-open', isToday ? 'is-today' : ''].filter(Boolean).join(' ');
    const status = isClosed ? '定休日' : '営業日';
    businessCalendar.insertAdjacentHTML('beforeend', `<span class="${classes}" aria-label="${date}日 ${status}">${date}</span>`);
  }
}

function setupScrollReveal() {
  const revealElements = document.querySelectorAll('.reveal-on-scroll');

  if (!revealElements.length) return;

  if (!('IntersectionObserver' in window)) {
    revealElements.forEach((element) => element.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver((entries, observerInstance) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      entry.target.classList.add('is-visible');
      observerInstance.unobserve(entry.target);
    });
  }, { threshold: 0.25 });

  revealElements.forEach((element) => observer.observe(element));
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    renderBusinessCalendar();
    setupScrollReveal();
  });
} else {
  renderBusinessCalendar();
  setupScrollReveal();
}
