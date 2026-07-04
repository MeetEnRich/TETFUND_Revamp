// Main Public Page Logic

let allTenders = [];
let showingAllTenders = false;
const TENDERS_LIMIT = 6; // Show 6 by default on landing page

let allNews = [];
let showingAllNews = false;
const NEWS_LIMIT = 3; // Show 3 by default on landing page

document.addEventListener('DOMContentLoaded', () => {
  loadTenders();
  loadNews();

  const filter = document.getElementById('tender-category-filter');
  if(filter) {
    filter.addEventListener('change', (e) => loadTenders(e.target.value));
  }

  const seeMoreTendersBtn = document.getElementById('btn-see-more-tenders');
  if (seeMoreTendersBtn) {
    seeMoreTendersBtn.addEventListener('click', () => {
      showingAllTenders = !showingAllTenders;
      renderTenders();
    });
  }

  const seeMoreNewsBtn = document.getElementById('btn-see-more-news');
  if (seeMoreNewsBtn) {
    seeMoreNewsBtn.addEventListener('click', () => {
      showingAllNews = !showingAllNews;
      renderNews();
    });
  }
});

async function loadTenders(category = '') {
  const container = document.getElementById('tenders-container');
  const moreContainer = document.getElementById('tenders-more-container');
  if(!container) return;
  
  try {
    let url = '/tenders?status=Active';
    if (category) url += `&category=${category}`;
    
    allTenders = await apiFetch(url);
    showingAllTenders = false; // Reset state
    
    renderTenders();
  } catch (err) {
    container.innerHTML = `<div class="col-span-full p-8 text-center text-red-500 bg-white shadow-sm rounded border">Failed to load tenders.</div>`;
    if (moreContainer) moreContainer.classList.add('hidden');
  }
}

function renderTenders() {
  const container = document.getElementById('tenders-container');
  const moreContainer = document.getElementById('tenders-more-container');
  if (!container) return;

  if (allTenders.length === 0) {
    container.innerHTML = `<div class="col-span-full p-8 text-center text-gray-500 bg-white shadow-sm rounded border">No active tenders found.</div>`;
    if (moreContainer) moreContainer.classList.add('hidden');
    return;
  }

  const tendersToDisplay = showingAllTenders ? allTenders : allTenders.slice(0, TENDERS_LIMIT);

  container.innerHTML = tendersToDisplay.map(tender => `
    <div class="card p-6 flex flex-col justify-between fade-in">
      <div>
        <div class="flex justify-between items-start mb-4">
          <span class="badge badge-primary">Active</span>
          <span class="badge bg-gray-100 text-gray-600">${tender.Category}</span>
        </div>
        <h3 class="text-xl font-bold mb-2 text-gray-800">${tender.Title}</h3>
        <p class="text-gray-600 text-sm mb-6 line-clamp-3">${tender.Description}</p>
      </div>
      <div class="border-t pt-4">
        <div class="flex justify-between text-xs text-gray-500 mb-4 font-semibold">
          <span>Pub: ${new Date(tender.PublishedDate).toLocaleDateString()}</span>
          <span class="text-red-600">Closes: ${new Date(tender.ClosingDate).toLocaleDateString()}</span>
        </div>
        <a href="/dashboard.html?tender=${tender.TenderID}" class="btn btn-primary btn-block">Submit Bid Document</a>
      </div>
    </div>
  `).join('');

  if (moreContainer) {
    if (allTenders.length > TENDERS_LIMIT) {
      moreContainer.classList.remove('hidden');
      const btn = document.getElementById('btn-see-more-tenders');
      if (btn) {
        btn.innerText = showingAllTenders ? 'See Less Tenders' : 'See More Tenders';
      }
    } else {
      moreContainer.classList.add('hidden');
    }
  }
}

async function loadNews() {
  const container = document.getElementById('news-container');
  const moreContainer = document.getElementById('news-more-container');
  if(!container) return;
  
  try {
    allNews = await apiFetch('/news');
    showingAllNews = false; // Reset state
    
    renderNews();
  } catch (err) {
    container.innerHTML = `<div class="col-span-full p-8 text-center text-red-500 bg-white shadow-sm rounded border">Failed to load news.</div>`;
    if (moreContainer) moreContainer.classList.add('hidden');
  }
}

function renderNews() {
  const container = document.getElementById('news-container');
  const moreContainer = document.getElementById('news-more-container');
  if (!container) return;

  if (allNews.length === 0) {
    container.innerHTML = `<div class="col-span-full p-8 text-center text-gray-500 bg-white shadow-sm rounded border">No news articles published yet.</div>`;
    if (moreContainer) moreContainer.classList.add('hidden');
    return;
  }

  const newsToDisplay = showingAllNews ? allNews : allNews.slice(0, NEWS_LIMIT);
  const defaultImg = 'https://via.placeholder.com/400x250/eaf5e1/449b01?text=TETFund+News';

  container.innerHTML = newsToDisplay.map(item => `
    <div class="card overflow-hidden flex flex-col fade-in">
      <img src="${item.ImagePath || defaultImg}" alt="News Image" class="card-img">
      <div class="p-6 flex-1 flex flex-col">
        <span class="text-xs text-primary font-bold uppercase tracking-wide mb-2">${new Date(item.DatePosted).toLocaleDateString()}</span>
        <h3 class="text-lg font-bold mb-3 text-gray-800">${item.Title}</h3>
        <p class="text-gray-600 text-sm mb-6 line-clamp-3">${item.Content}</p>
        <a href="javascript:void(0)" onclick="openNewsModal(${item.NewsID})" class="mt-auto text-primary font-bold hover:underline">Read More &rarr;</a>
      </div>
    </div>
  `).join('');

  if (moreContainer) {
    if (allNews.length > NEWS_LIMIT) {
      moreContainer.classList.remove('hidden');
      const btn = document.getElementById('btn-see-more-news');
      if (btn) {
        btn.innerText = showingAllNews ? 'See Less News' : 'See More News';
      }
    } else {
      moreContainer.classList.add('hidden');
    }
  }
}

async function openNewsModal(newsId) {
  const modal = document.getElementById('news-modal');
  if (!modal) return;

  try {
    const item = await apiFetch(`/news/${newsId}`);
    
    const defaultImg = 'https://via.placeholder.com/600x300/eaf5e1/449b01?text=TETFund+News';
    document.getElementById('modal-news-img').src = item.ImagePath || defaultImg;
    document.getElementById('modal-news-date').innerText = new Date(item.DatePosted).toLocaleDateString();
    document.getElementById('modal-news-title').innerText = item.Title;
    document.getElementById('modal-news-content').innerText = item.Content;

    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden'; // Lock background scroll
  } catch (err) {
    showToast('Failed to load article details', 'error');
  }
}

function closeNewsModal() {
  const modal = document.getElementById('news-modal');
  if (modal) {
    modal.classList.add('hidden');
    document.body.style.overflow = ''; // Unlock background scroll
  }
}
