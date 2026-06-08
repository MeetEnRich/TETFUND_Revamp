// Main Public Page Logic
document.addEventListener('DOMContentLoaded', () => {
  loadTenders();
  loadNews();

  const filter = document.getElementById('tender-category-filter');
  if(filter) {
    filter.addEventListener('change', (e) => loadTenders(e.target.value));
  }
});

async function loadTenders(category = '') {
  const container = document.getElementById('tenders-container');
  if(!container) return;
  
  try {
    let url = '/tenders?status=Active';
    if (category) url += `&category=${category}`;
    
    const tenders = await apiFetch(url);
    
    if (tenders.length === 0) {
      container.innerHTML = `<div class="p-8 text-center text-gray-500 bg-white shadow-sm rounded border">No active tenders found.</div>`;
      return;
    }

    container.innerHTML = tenders.map(tender => `
      <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-between hover:shadow-md transition">
        <div>
          <div class="flex justify-between items-start mb-4">
            <span class="bg-[#eaf5e1] text-[#449B01] font-bold px-3 py-1 rounded-full text-xs uppercase tracking-wide">Active</span>
            <span class="bg-gray-100 text-gray-600 font-bold px-3 py-1 rounded-full text-xs uppercase tracking-wide">${tender.Category}</span>
          </div>
          <h3 class="text-xl font-bold mb-2 text-gray-800">${tender.Title}</h3>
          <p class="text-gray-600 text-sm mb-6 line-clamp-3">${tender.Description}</p>
        </div>
        <div class="border-t pt-4">
          <div class="flex justify-between text-xs text-gray-500 mb-4 font-semibold">
            <span>Pub: ${new Date(tender.PublishedDate).toLocaleDateString()}</span>
            <span class="text-red-600">Closes: ${new Date(tender.ClosingDate).toLocaleDateString()}</span>
          </div>
          <a href="/dashboard.html?tender=${tender.TenderID}" class="block text-center bg-[#449B01] text-white font-bold py-2 rounded hover:bg-[#357a01] transition">Submit Bid Document</a>
        </div>
      </div>
    `).join('');
  } catch (err) {
    container.innerHTML = `<div class="p-8 text-center text-red-500 bg-white shadow-sm rounded border">Failed to load tenders.</div>`;
  }
}

async function loadNews() {
  const container = document.getElementById('news-container');
  if(!container) return;
  
  try {
    const news = await apiFetch('/news');
    
    if (news.length === 0) {
      container.innerHTML = `<div class="p-8 text-center text-gray-500 bg-white shadow-sm rounded border">No news articles published yet.</div>`;
      return;
    }

    const defaultImg = 'https://via.placeholder.com/400x250/eaf5e1/449b01?text=TETFund+News';

    container.innerHTML = news.map(item => `
      <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col hover:shadow-md transition">
        <img src="${item.ImagePath || defaultImg}" alt="News Image" class="w-full h-48 object-cover">
        <div class="p-6 flex-1 flex flex-col">
          <span class="text-xs text-[#449B01] font-bold uppercase tracking-wide mb-2">${new Date(item.DatePosted).toLocaleDateString()}</span>
          <h3 class="text-lg font-bold mb-3 text-gray-800">${item.Title}</h3>
          <p class="text-gray-600 text-sm mb-6 line-clamp-3">${item.Content}</p>
          <a href="#" class="mt-auto text-[#449B01] font-bold hover:underline">Read More &rarr;</a>
        </div>
      </div>
    `).join('');
  } catch (err) {
    container.innerHTML = `<div class="p-8 text-center text-red-500 bg-white shadow-sm rounded border">Failed to load news.</div>`;
  }
}
