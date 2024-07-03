document.addEventListener('DOMContentLoaded', () => {
  function updatePopup() {
    chrome.storage.local.get('siteData', data => {
      const siteData = data.siteData || {};
      const contentDiv = document.getElementById('content');
      contentDiv.innerHTML = '';

      for (const [site, time] of Object.entries(siteData)) {
        const minutes = Math.floor(time / 60000);
        const seconds = ((time % 60000) / 1000).toFixed(0);
        const siteDiv = document.createElement('div');
        siteDiv.textContent = `${site}: ${minutes} minutes ${seconds} seconds`;
        contentDiv.appendChild(siteDiv);
      }
    });
  }

  updatePopup();
  setInterval(updatePopup, 1000); // Update every second
});
