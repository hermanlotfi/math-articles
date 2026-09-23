// جستجو در مقاله‌ها
const searchInput = document.getElementById('search');
const articleCards = document.querySelectorAll('.article-card');

searchInput.addEventListener('input', (e) => {
    const query = e.target.value.trim().toLowerCase();
    
    articleCards.forEach(card => {
        const title = card.querySelector('h3').textContent.toLowerCase();
        const text = card.querySelector('p:not(.article-meta)').textContent.toLowerCase();
        
        if (title.includes(query) || text.includes(query) || query === '') {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
    
    // اگه هیچی پیدا نشد
    const visibleCards = [...articleCards].filter(c => c.style.display !== 'none');
    const noResult = document.getElementById('no-result');
    
    if (visibleCards.length === 0 && query !== '') {
        if (!noResult) {
            const msg = document.createElement('p');
            msg.id = 'no-result';
            msg.textContent = '❌ مقاله‌ای پیدا نشد';
            msg.style.textAlign = 'center';
            msg.style.color = '#888';
            msg.style.fontSize = '1.2rem';
            document.querySelector('.articles-grid').appendChild(msg);
        }
    } else if (noResult) {
        noResult.remove();
    }
});

console.log('📐 سایت مقاله‌های ریاضی آماده است!');