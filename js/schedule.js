// بارگذاری داده‌ها از localStorage
let scheduleData = JSON.parse(localStorage.getItem('scheduleData')) || [];

// روزهای هفته
const days = ['شنبه', 'یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنجشنبه', 'جمعه'];

// وضعیت‌ها
const statuses = {
    'pending': '⏳ در انتظار',
    'done': '✅ انجام شده',
    'cancelled': '❌ لغو شده'
};

// ساخت ردیف
function createRow(data = {}) {
    const tr = document.createElement('tr');
    tr.innerHTML = `
        <td>
            <select class="day-select">
                ${days.map(d => `<option value="${d}" ${data.day === d ? 'selected' : ''}>${d}</option>`).join('')}
            </select>
        </td>
        <td>
            <input type="time" value="${data.time || ''}">
        </td>
        <td>
            <input type="text" placeholder="برنامه..." value="${data.task || ''}">
        </td>
        <td>
            <input type="text" placeholder="توضیحات..." value="${data.note || ''}">
        </td>
        <td>
            <select class="status-select">
                ${Object.entries(statuses).map(([key, val]) => 
                    `<option value="${key}" ${data.status === key ? 'selected' : ''}>${val}</option>`
                ).join('')}
            </select>
        </td>
        <td>
            <button class="btn-delete" onclick="deleteRow(this)">🗑️</button>
        </td>
    `;

    // رویداد تغییر وضعیت
    const statusSelect = tr.querySelector('.status-select');
    statusSelect.addEventListener('change', () => {
        if (statusSelect.value === 'done') {
            tr.classList.add('done');
        } else {
            tr.classList.remove('done');
        }
        saveData();
        updateStats();
    });

    if (data.status === 'done') {
        tr.classList.add('done');
    }

    return tr;
}

// افزودن ردیف
function addRow(data = {}) {
    const tbody = document.getElementById('scheduleBody');
    const tr = createRow(data);
    tbody.appendChild(tr);
    saveData();
    updateStats();
}

// حذف ردیف
function deleteRow(btn) {
    if (confirm('این ردیف حذف بشه؟')) {
        btn.closest('tr').remove();
        saveData();
        updateStats();
    }
}

// ذخیره داده‌ها
function saveData() {
    const rows = document.querySelectorAll('#scheduleBody tr');
    scheduleData = [];
    
    rows.forEach(tr => {
        const select = tr.querySelector('.day-select');
        const time = tr.querySelector('input[type="time"]').value;
        const task = tr.querySelectorAll('input[type="text"]')[0].value;
        const note = tr.querySelectorAll('input[type="text"]')[1].value;
        const status = tr.querySelector('.status-select').value;
        
        scheduleData.push({
            day: select.value,
            time: time,
            task: task,
            note: note,
            status: status
        });
    });
    
    localStorage.setItem('scheduleData', JSON.stringify(scheduleData));
    showToast('💾 ذخیره شد!');
}

// به‌روزرسانی آمار
function updateStats() {
    const rows = document.querySelectorAll('#scheduleBody tr');
    const total = rows.length;
    const done = document.querySelectorAll('#scheduleBody tr.done').length;
    const pending = total - done;
    
    document.getElementById('totalTasks').textContent = toPersianNumber(total);
    document.getElementById('doneTasks').textContent = toPersianNumber(done);
    document.getElementById('pendingTasks').textContent = toPersianNumber(pending);
}

// تبدیل عدد به فارسی
function toPersianNumber(num) {
    const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
    return num.toString().replace(/\d/g, d => persianDigits[d]);
}

// پاک کردن همه
function clearAll() {
    if (confirm('همه‌ی برنامه‌ها پاک بشن؟')) {
        document.getElementById('scheduleBody').innerHTML = '';
        scheduleData = [];
        localStorage.removeItem('scheduleData');
        updateStats();
        showToast('🗑️ پاک شد!');
    }
}

// خروجی
function exportData() {
    const data = localStorage.getItem('scheduleData');
    if (!data || data === '[]') {
        alert('هیچ برنامه‌ای برای خروجی نیست!');
        return;
    }
    
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'schedule-backup.json';
    a.click();
    URL.revokeObjectURL(url);
    showToast('📥 خروجی گرفته شد!');
}

// نمایش پیام
function showToast(message) {
    const toast = document.createElement('div');
    toast.textContent = message;
    toast.style.cssText = `
        position: fixed;
        bottom: 2rem;
        left: 50%;
        transform: translateX(-50%);
        background: #2ecc71;
        color: white;
        padding: 1rem 2rem;
        border-radius: 10px;
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        z-index: 1000;
        font-family: inherit;
        animation: slideUp 0.3s ease;
    `;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'slideDown 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 2000);
}

// انیمیشن
const style = document.createElement('style');
style.textContent = `
    @keyframes slideUp {
        from { opacity: 0; transform: translate(-50%, 20px); }
        to { opacity: 1; transform: translate(-50%, 0); }
    }
    @keyframes slideDown {
        from { opacity: 1; transform: translate(-50%, 0); }
        to { opacity: 0; transform: translate(-50%, 20px); }
    }
`;
document.head.appendChild(style);

// بارگذاری اولیه
window.addEventListener('DOMContentLoaded', () => {
    if (scheduleData.length > 0) {
        scheduleData.forEach(data => addRow(data));
    } else {
        // سه ردیف خالی برای شروع
        addRow();
        addRow();
        addRow();
    }
    updateStats();
});

console.log('📅 صفحه برنامه هفتگی آماده است!');
