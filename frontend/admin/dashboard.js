/* dashboard.js — Kalakosh Admin Dashboard */

document.addEventListener('DOMContentLoaded', function () {

    /* ── SIDEBAR: active state from current URL ── */
    const currentPage = location.pathname.split('/').pop() || 'admin-dashboard.html';
    document.querySelectorAll('.sidebar-menu li a').forEach(link => {
        const li = link.parentElement;
        if (link.getAttribute('href') === currentPage) {
            li.classList.add('active');
        } else {
            li.classList.remove('active');
        }
    });

    /* ── REVENUE CHART (Canvas) ── */
    const canvas = document.getElementById('revenueChart');
    if (!canvas) return;

    const ctx    = canvas.getContext('2d');
    const W      = canvas.offsetWidth  || 800;
    const H      = canvas.offsetHeight || 320;
    canvas.width  = W;
    canvas.height = H;

    const data   = [22000, 16000, 28000, 25000, 36000, 30000];
    const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    const maxVal = Math.max(...data) * 1.15;
    const padL   = 20;
    const padR   = 20;
    const padT   = 20;
    const padB   = 0;
    const plotW  = W - padL - padR;
    const plotH  = H - padT - padB;

    /* Gradient fill */
    const grad = ctx.createLinearGradient(0, padT, 0, H);
    grad.addColorStop(0,   'rgba(123,31,31,0.28)');
    grad.addColorStop(1,   'rgba(123,31,31,0.02)');

    function xPos(i) { return padL + (i / (data.length - 1)) * plotW; }
    function yPos(v) { return padT + plotH - (v / maxVal) * plotH; }

    /* Draw filled area */
    ctx.beginPath();
    ctx.moveTo(xPos(0), yPos(data[0]));
    for (let i = 1; i < data.length; i++) {
        const cpx = (xPos(i - 1) + xPos(i)) / 2;
        ctx.bezierCurveTo(cpx, yPos(data[i - 1]), cpx, yPos(data[i]), xPos(i), yPos(data[i]));
    }
    ctx.lineTo(xPos(data.length - 1), H);
    ctx.lineTo(xPos(0), H);
    ctx.closePath();
    ctx.fillStyle = grad;
    ctx.fill();

    /* Draw line */
    ctx.beginPath();
    ctx.moveTo(xPos(0), yPos(data[0]));
    for (let i = 1; i < data.length; i++) {
        const cpx = (xPos(i - 1) + xPos(i)) / 2;
        ctx.bezierCurveTo(cpx, yPos(data[i - 1]), cpx, yPos(data[i]), xPos(i), yPos(data[i]));
    }
    ctx.strokeStyle = '#7B1F1F';
    ctx.lineWidth   = 2.5;
    ctx.lineJoin    = 'round';
    ctx.stroke();

    /* Data points */
    data.forEach((v, i) => {
        ctx.beginPath();
        ctx.arc(xPos(i), yPos(v), 5, 0, Math.PI * 2);
        ctx.fillStyle   = '#7B1F1F';
        ctx.fill();
        ctx.strokeStyle = '#FAF7F2';
        ctx.lineWidth   = 2;
        ctx.stroke();
    });

    /* ── STAT CARD COUNT-UP ── */
    document.querySelectorAll('.stat-card h2').forEach(el => {
        const raw    = el.textContent.trim();
        const prefix = raw.startsWith('$') ? '$' : '';
        const suffix = raw.endsWith('k')  ? 'k' : (raw.endsWith('%') ? '%' : '');
        const num    = parseFloat(raw.replace(/[^0-9.]/g, ''));
        if (!num) return;

        let cur = 0;
        const step  = num / 50;
        const timer = setInterval(() => {
            cur += step;
            if (cur >= num) { cur = num; clearInterval(timer); }
            el.textContent = prefix + (suffix === 'k' ? cur.toFixed(0) : Math.round(cur)) + suffix;
        }, 20);
    });

    /* ── SIDEBAR LOGOUT CONFIRM ── */
    const logoutLink = document.querySelector('.sidebar-menu .logout-item a');
    if (logoutLink) {
        logoutLink.addEventListener('click', function (e) {
            if (!confirm('Are you sure you want to logout?')) {
                e.preventDefault();
            }
        });
    }

});
