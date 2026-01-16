document.addEventListener('DOMContentLoaded', async () => {
  const data = await chrome.storage.local.get(["history"]);
  const history = data.history || [];

  let prodTotal = 0;
  let unprodTotal = 0;

  history.forEach(entry => {
    if (entry.category === "Productive") prodTotal += entry.duration;
    if (entry.category === "Unproductive") unprodTotal += entry.duration;
  });

  document.getElementById('prod-time').innerText = Math.round(prodTotal) + "s";
  document.getElementById('unprod-time').innerText = Math.round(unprodTotal) + "s";

  // Create Chart
  const ctx = document.getElementById('prodChart').getContext('2d');
  new Chart(ctx, {
    type: 'pie',
    data: {
      labels: ['Productive', 'Unproductive'],
      datasets: [{
        data: [prodTotal, unprodTotal],
        backgroundColor: ['#4CAF50', '#F44336']
      }]
    }
  });
});