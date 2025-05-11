document.addEventListener('DOMContentLoaded', () => {
  updateStats();
  document.getElementById('view-dashboard').addEventListener('click', openDashboard);
});

function updateStats() {
  const today = new Date().toISOString().split('T')[0];
  
  chrome.storage.local.get(['timeData'], (result) => {
    const timeData = result.timeData || {};
    const todayData = timeData[today] || {};
    
    let productiveTime = 0;
    let unproductiveTime = 0;
    
    Object.entries(todayData).forEach(([domain, time]) => {
      if (isProductiveWebsite(domain)) {
        productiveTime += time;
      } else if (isUnproductiveWebsite(domain)) {
        unproductiveTime += time;
      }
    });
    
    document.getElementById('productive-time').textContent = 
      Math.round(productiveTime / 60000) + ' minutes';
    document.getElementById('unproductive-time').textContent = 
      Math.round(unproductiveTime / 60000) + ' minutes';
  });
}

function isProductiveWebsite(domain) {
  return productiveWebsites.some(site => domain.includes(site));
}

function isUnproductiveWebsite(domain) {
  return unproductiveWebsites.some(site => domain.includes(site));
}

function openDashboard() {
  chrome.tabs.create({
    url: 'dashboard.html'
  });
}