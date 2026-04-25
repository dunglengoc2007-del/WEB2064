'use strict';

var VALID_EMAIL = 'admin@gmail.com';
var VALID_PASSWORD = 'Adm!n123';

/* ── SVG icons ── */
var SVG_USER = '<svg viewBox="0 0 24 24"><path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/></svg>';
var SVG_EYE_ON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>';
var SVG_EYE_OFF = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>';

/* ── Utility ── */
function el(tag, props, children) {
    var node = document.createElement(tag);
    props = props || {};
    Object.keys(props).forEach(function (k) {
        var v = props[k];
        if (k === 'class') node.className = v;
        else if (k === 'text') node.textContent = v;
        else if (k === 'html') node.innerHTML = v;
        else if (k === 'for') node.htmlFor = v;
        else if (k.startsWith('on') && typeof v === 'function')
            node.addEventListener(k.slice(2), v);
        else node.setAttribute(k, v);
    });
    (children || []).forEach(function (ch) {
        if (ch == null) return;
        node.appendChild(ch.nodeType ? ch : document.createTextNode(ch));
    });
    return node;
}

/* ── Toast ── */
var toastEl = el('div', { class: 'toast', id: 'toast' });
document.body.appendChild(toastEl);

function showToast(msg, type) {
    toastEl.textContent = msg;
    toastEl.className = 'toast ' + (type || 'success') + ' visible';
    setTimeout(function () { toastEl.classList.remove('visible'); }, 3000);
}

/* ── Validation ── */
function validateEmail(v) { return /\S+@\S+\.\S+/.test(v); }
function validatePassword(v) { return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/.test(v); }
function setError(inp, errEl, msg) { inp.classList.add('invalid'); errEl.textContent = msg; errEl.classList.add('show'); }
function clearError(inp, errEl) { inp.classList.remove('invalid'); errEl.classList.remove('show'); }

/* ── Build UI ── */
var app = document.getElementById('app');

// Avatar
app.appendChild(el('div', { class: 'avatar-wrap' }, [
    el('div', { class: 'avatar', html: SVG_USER })
]));

// Title
app.appendChild(el('h1', { class: 'title', text: 'Sign in' }));

// Card
var card = el('div', { class: 'card' });
app.appendChild(card);

// Email field
var inpEmail = el('input', { id: 'email', type: 'email', placeholder: 'you@example.com', autocomplete: 'username' });
var errEmail = el('p', { class: 'error-msg' });
card.appendChild(el('div', { class: 'field' }, [
    el('label', { for: 'email', text: 'Email' }),
    el('div', { class: 'input-wrap' }, [inpEmail]),
    errEmail
]));

// Password field
var inpPass = el('input', { id: 'password', type: 'password', placeholder: '••••••••', autocomplete: 'current-password' });
var eyeBtn = el('button', { type: 'button', class: 'eye-btn', html: SVG_EYE_ON });
eyeBtn.addEventListener('click', function () {
    var hidden = inpPass.type === 'password';
    inpPass.type = hidden ? 'text' : 'password';
    eyeBtn.innerHTML = hidden ? SVG_EYE_OFF : SVG_EYE_ON;
});
var errPass = el('p', { class: 'error-msg' });
card.appendChild(el('div', { class: 'field' }, [
    el('label', { for: 'password', text: 'Password' }),
    el('div', { class: 'input-wrap' }, [inpPass, eyeBtn]),
    errPass
]));

// Remember me + Forgot password
var chk = el('input', { type: 'checkbox', id: 'remember' });
card.appendChild(el('div', { class: 'row-between' }, [
    el('label', { class: 'remember', for: 'remember' }, [chk, el('span', { text: 'Remember me' })]),
    el('a', { class: 'link', href: '#', text: 'Forgot password?' })
]));

// Sign in button
var submitBtn = el('button', { class: 'btn', type: 'button', text: 'Sign in' });
submitBtn.addEventListener('click', function () {
    var emailVal = inpEmail.value.trim();
    var passVal = inpPass.value;
    var ok = true;

    if (!validateEmail(emailVal)) {
        setError(inpEmail, errEmail, 'Email không đúng định dạng (*@*.*)');
        ok = false;
    } else {
        clearError(inpEmail, errEmail);
    }

    if (!validatePassword(passVal)) {
        setError(inpPass, errPass, 'Tối thiểu 8 ký tự, có chữ hoa, chữ thường, số và ký tự đặc biệt');
        ok = false;
    } else {
        clearError(inpPass, errPass);
    }

    if (!ok) return;

    if (emailVal === VALID_EMAIL && passVal === VALID_PASSWORD) {
        showToast('Đăng nhập thành công!', 'success');
    } else {
        showToast('Thông tin chưa đúng, vui lòng đăng nhập lại', 'error-t');
    }
});
card.appendChild(submitBtn);

// Footer
card.appendChild(el('p', { class: 'footer' }, [
    el('span', { text: "Don't have an account? " }),
    el('a', { class: 'link', href: '#signup', text: 'Sign up' })
]));