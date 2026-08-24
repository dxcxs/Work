async function LoadMenu(type) {
  const response = await fetch(`http://localhost:3000/api/menus/${type}`);
  const menu_items = await response.json();
  const container = document.getElementById('menu');

  container.innerHTML = ""
  
  menu_items.forEach(item => {
    const div = document.createElement('div');
    div.className = "menu-item"

    div.innerHTML = `
      <img class="menu-image" src="img/${item.name}.jpg">
      <h3>${item.name}</h3>
      <h3>${item.price}</h3>
      <h3>${item.cat}</h3>
    `;
    container.appendChild(div);
  });
}

LoadMenu("all");
