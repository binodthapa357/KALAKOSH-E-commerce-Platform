/* pages.js — Kalakosh Admin Pages JS */

document.addEventListener('DOMContentLoaded', function () {

    /* ── SIDEBAR: highlight active link ── */
    const sidebarLinks = document.querySelectorAll('.sidebar ul li a');
    const currentPage  = location.pathname.split('/').pop();

    sidebarLinks.forEach(link => {
        const li = link.parentElement;
        if (link.getAttribute('href') === currentPage) {
            li.classList.add('active');
        } else {
            li.classList.remove('active');
        }
    });

    /* ── SETTINGS TABS ── */
    const tabs   = document.querySelectorAll('.settings-tab');
    const panels = document.querySelectorAll('.settings-panel');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            panels.forEach(p => p.classList.remove('active'));

            tab.classList.add('active');
            const target = document.getElementById('tab-' + tab.dataset.tab);
            if (target) target.classList.add('active');
        });
    });

    /* ── SAVE BUTTON FEEDBACK ── */
    document.querySelectorAll('.save-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const original = btn.innerHTML;
            btn.innerHTML  = '<i class="fa-solid fa-check"></i> Saved!';
            btn.style.background = '#2B6B32';
            setTimeout(() => {
                btn.innerHTML  = original;
                btn.style.background = '';
            }, 2000);
        });
    });

    /* ── SEARCH FILTER (tables) ── */
    const searchInput = document.querySelector('.search-box input');
    if (searchInput) {
        searchInput.addEventListener('input', function () {
            const q   = this.value.toLowerCase();
            const rows = document.querySelectorAll('tbody tr');
            rows.forEach(row => {
                row.style.display = row.textContent.toLowerCase().includes(q) ? '' : 'none';
            });
        });
    }

    /* ── STATUS FILTER (select) ── */
    const filterSelects = document.querySelectorAll('.filter-select');
    filterSelects.forEach(sel => {
        sel.addEventListener('change', function () {
            const val  = this.value.toLowerCase();
            const rows = document.querySelectorAll('tbody tr');
            if (val.includes('all') || val === '') {
                rows.forEach(r => r.style.display = '');
                return;
            }
            rows.forEach(row => {
                const statusEl = row.querySelector('.status');
                if (!statusEl) { row.style.display = ''; return; }
                row.style.display = statusEl.textContent.toLowerCase().includes(val) ? '' : 'none';
            });
        });
    });

    /* ── ACTION BUTTONS: Block / Approve confirm ── */
    document.querySelectorAll('.danger-btn').forEach(btn => {
        btn.addEventListener('click', function () {
            const row    = this.closest('tr') || this.closest('.review-card') || this.closest('.category-card');
            const nameEl = row && (row.querySelector('h4') || row.querySelector('h3'));
            const name   = nameEl ? nameEl.textContent.trim() : 'this item';
            if (confirm(`Are you sure you want to perform this action on "${name}"?`)) {
                if (row) {
                    row.style.transition = 'opacity 0.3s';
                    row.style.opacity    = '0';
                    setTimeout(() => row.remove(), 300);
                }
            }
        });
    });

    /* ── ADD / CREATE BUTTON: clear form ── */
    document.querySelectorAll('.add-btn').forEach(btn => {
        btn.addEventListener('click', function (e) {
            const form = this.closest('.form-card');
            if (form) {
                const inputs = form.querySelectorAll('input, select');
                // Only clear if all required fields are filled
                let allFilled = true;
                inputs.forEach(inp => { if (inp.value.trim() === '' && inp.type !== 'date') allFilled = false; });
                if (allFilled) {
                    setTimeout(() => inputs.forEach(inp => {
                        if (inp.tagName === 'SELECT') inp.selectedIndex = 0;
                        else inp.value = '';
                    }), 100);
                }
            }
        });
    });

    /* ── COUPON CODE: auto-uppercase ── */
    const couponInput = document.querySelector('.form-card input[placeholder*="HIMALAYA"]');
    if (couponInput) {
        couponInput.addEventListener('input', function () {
            this.value = this.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
        });
    }

    /* ── PRODUCT CARD hover-lift ── */
    document.querySelectorAll('.product-card, .category-card, .review-card').forEach(card => {
        card.addEventListener('mouseenter', () => card.style.transition = 'transform 0.2s, box-shadow 0.2s');
    });

    /* ── CATEGORY card slide-in on load ── */
    const catCards = document.querySelectorAll('.category-card');
    catCards.forEach((card, i) => {
        card.style.opacity   = '0';
        card.style.transform = 'translateX(-12px)';
        card.style.transition = `opacity 0.3s ${i * 0.06}s, transform 0.3s ${i * 0.06}s`;
        requestAnimationFrame(() => {
            card.style.opacity   = '1';
            card.style.transform = 'translateX(0)';
        });
    });

    /* ── MINI STAT count-up animation ── */
    document.querySelectorAll('.mini-stat strong').forEach(el => {
        const raw   = el.textContent.replace(/[^0-9.]/g, '');
        const end   = parseFloat(raw);
        if (!end) return;
        const prefix = el.textContent.includes('$') ? '$' : '';
        const suffix = el.textContent.includes('%') ? '%' : (el.textContent.includes('k') ? 'k' : '');
        let current  = 0;
        const step   = end / 40;
        const timer  = setInterval(() => {
            current += step;
            if (current >= end) { current = end; clearInterval(timer); }
            el.textContent = prefix + (suffix === 'k' ? current.toFixed(0) : Math.round(current)) + suffix;
        }, 25);
    });

});
