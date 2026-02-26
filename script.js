const tabs = document.querySelectorAll('.tab');
const panels = document.querySelectorAll('.panel');
const rightTabsRoot = document.getElementById('right-tabs');

const sectionLabels = {
  overview: 'Обзор',
  cabinet: 'Личный кабинет',
  auction: 'Аукцион',
  bank: 'Переводы',
  bans: 'Нарушения',
  shop: 'Магазин',
  rent: 'Аренда AR',
  chat: 'Чат игроков',
  roles: 'Должности',
  admin: 'Админ-панель'
};

const state = {
  user: null,
  balance: 125000,
  transfers: [],
  bans: [
    { player: 'NightDriller', reason: 'Grief базы', mod: 'Admin_Kira', term: '14 дней', status: 'Активен' },
    { player: 'SkyRush', reason: 'Читы: KillAura', mod: 'Mod_Artemis', term: 'Перманент', status: 'Активен' },
    { player: 'BambooFox', reason: 'Спам в чат', mod: 'Helper_Nova', term: '2 дня', status: 'Истек' }
  ]
};

const auctionItems = [
  { name: 'Netherite Sword', price: 9800, img: 'https://mc.nerothe.com/img/1.21.11/item/netherite_sword.png' },
  { name: 'Totem of Undying', price: 5300, img: 'https://mc.nerothe.com/img/1.21.11/item/totem_of_undying.png' },
  { name: 'Elytra', price: 18700, img: 'https://mc.nerothe.com/img/1.21.11/item/elytra.png' },
  { name: 'Diamond Ore (AR)', price: 6100, img: 'https://mc.nerothe.com/img/1.21.11/block/diamond_ore.png' },
  { name: 'Shulker Box', price: 2700, img: 'https://mc.nerothe.com/img/1.21.11/block/purple_shulker_box.png' },
  { name: 'Beacon', price: 8900, img: 'https://mc.nerothe.com/img/1.21.11/block/beacon.png' }
];

const shopItems = [
  { name: 'Алмазный набор PvP', price: 4900, img: 'https://mc.nerothe.com/img/1.21.11/item/diamond_chestplate.png' },
  { name: 'Фермерский пак', price: 1900, img: 'https://mc.nerothe.com/img/1.21.11/item/wheat.png' },
  { name: 'Строитель PRO', price: 3400, img: 'https://mc.nerothe.com/img/1.21.11/block/quartz_block.png' },
  { name: 'Редстоун Инженер', price: 2750, img: 'https://mc.nerothe.com/img/1.21.11/item/redstone.png' }
];

const rentSpaces = [
  { title: 'Рынок #A-12', cap: '120 сундуков', fee: '420 AR/день' },
  { title: 'Склад #B-07', cap: '300 сундуков', fee: '900 AR/день' },
  { title: 'VIP-витрина #S-01', cap: '80 сундуков', fee: '1300 AR/день' }
];

const roles = [
  { title: 'Игрок', desc: 'Базовый доступ к миру и экономике' },
  { title: 'Торговец', desc: 'Расширенные лимиты аукциона и комиссий' },
  { title: 'Строитель', desc: 'Приват-регионы и доступ к аренде AR' },
  { title: 'Модератор', desc: 'Муты, жалобы, контроль чата' },
  { title: 'Администратор', desc: 'Полный контроль системы и банов' },
  { title: 'Владелец', desc: 'Управление сезоном и балансом сервера' }
];

Object.entries(sectionLabels).forEach(([id, label]) => {
  const button = document.createElement('button');
  button.className = 'side-tab';
  button.dataset.tab = id;
  button.textContent = label;
  button.addEventListener('click', () => openTab(id));
  rightTabsRoot.append(button);
});

function openTab(tabId) {
  tabs.forEach((btn) => btn.classList.toggle('active', btn.dataset.tab === tabId));
  document.querySelectorAll('.side-tab').forEach((btn) => btn.classList.toggle('active', btn.dataset.tab === tabId));
  panels.forEach((panel) => panel.classList.toggle('active', panel.id === tabId));
}

tabs.forEach((btn) => btn.addEventListener('click', () => openTab(btn.dataset.tab)));
document.querySelectorAll('[data-open-tab]').forEach((btn) => {
  btn.addEventListener('click', () => openTab(btn.dataset.openTab));
});
openTab('overview');

function renderItems(list, root) {
  root.innerHTML = list
    .map((item) => `
      <article class="item">
        <div class="item-head">
          <img src="${item.img}" alt="${item.name}" loading="lazy" />
          <span class="price">${item.price.toLocaleString('ru-RU')} AR</span>
        </div>
        <h4>${item.name}</h4>
        <button class="btn ghost">Открыть карточку</button>
      </article>
    `)
    .join('');
}

const auctionRoot = document.getElementById('auction-list');
const shopRoot = document.getElementById('shop-list');
renderItems(auctionItems, auctionRoot);
renderItems(shopItems, shopRoot);

const auctionSearch = document.getElementById('auction-search');
const auctionSort = document.getElementById('auction-sort');

function refreshAuction() {
  const q = auctionSearch.value.toLowerCase().trim();
  const sorted = [...auctionItems]
    .filter((i) => i.name.toLowerCase().includes(q))
    .sort((a, b) => {
      if (auctionSort.value === 'price-asc') return a.price - b.price;
      if (auctionSort.value === 'price-desc') return b.price - a.price;
      return a.name.localeCompare(b.name);
    });
  renderItems(sorted, auctionRoot);
}
auctionSearch.addEventListener('input', refreshAuction);
auctionSort.addEventListener('change', refreshAuction);

const profileCard = document.getElementById('profile-card');
const cardOwner = document.getElementById('card-owner');
const cardBalance = document.getElementById('card-balance');
document.getElementById('login-form').addEventListener('submit', (e) => {
  e.preventDefault();
  const fd = new FormData(e.target);
  const nick = fd.get('nick').toString().trim();
  if (!nick) return;
  state.user = nick;
  profileCard.innerHTML = `
    <h3>${nick}</h3>
    <p class="muted">Ранг: Легенда · Уровень: 87 · Репутация: 4.9/5</p>
    <ul>
      <li>Баланс: ${state.balance.toLocaleString('ru-RU')} AR-Coin</li>
      <li>Лотов на аукционе: 17</li>
      <li>Привязки: Telegram, Discord, Auth App</li>
    </ul>
  `;
  cardOwner.textContent = nick;
  cardBalance.textContent = `${state.balance.toLocaleString('ru-RU')} AR-Coin`;
  e.target.reset();
});

const transferHistory = document.getElementById('transfer-history');
const transferHint = document.getElementById('transfer-hint');
function renderTransfers() {
  transferHistory.innerHTML = state.transfers.length
    ? state.transfers.map((t) => `<li>${t.date} · ${t.to} · -${t.amount} AR-Coin</li>`).join('')
    : '<li class="muted">Переводов пока нет.</li>';
}
renderTransfers();

document.getElementById('transfer-form').addEventListener('submit', (e) => {
  e.preventDefault();
  const fd = new FormData(e.target);
  const to = fd.get('to').toString().trim();
  const amount = Number(fd.get('amount'));
  if (!to || !amount || amount < 1) return;
  if (amount > state.balance) {
    transferHint.textContent = 'Недостаточно средств на карте.';
    return;
  }
  state.balance -= amount;
  cardBalance.textContent = `${state.balance.toLocaleString('ru-RU')} AR-Coin`;
  state.transfers.unshift({ to, amount, date: new Date().toLocaleString('ru-RU') });
  transferHint.textContent = `Перевод ${amount.toLocaleString('ru-RU')} AR-Coin игроку ${to} выполнен.`;
  renderTransfers();
  e.target.reset();
});

const banTable = document.getElementById('ban-table');
function renderBans() {
  banTable.innerHTML = state.bans
    .map(
      (b) => `
      <tr>
        <td>${b.player}</td><td>${b.reason}</td><td>${b.mod}</td><td>${b.term}</td><td>${b.status}</td>
      </tr>
    `
    )
    .join('');
}
renderBans();

document.getElementById('ban-form').addEventListener('submit', (e) => {
  e.preventDefault();
  const fd = new FormData(e.target);
  state.bans.unshift({
    player: fd.get('player').toString().trim(),
    reason: fd.get('reason').toString().trim(),
    mod: 'Admin_Panel',
    term: fd.get('term').toString().trim(),
    status: 'Активен'
  });
  document.getElementById('admin-hint').textContent = 'Наказание добавлено в историю.';
  renderBans();
  e.target.reset();
});

const rentRoot = document.getElementById('rent-list');
rentRoot.innerHTML = rentSpaces
  .map(
    (r) => `
  <article class="card">
    <h3>${r.title}</h3>
    <p>Вместимость: ${r.cap}</p>
    <p class="price">${r.fee}</p>
    <button class="btn primary">Арендовать</button>
  </article>
`
  )
  .join('');

const rolesRoot = document.getElementById('roles-list');
rolesRoot.innerHTML = roles
  .map(
    (r) => `
  <article class="card">
    <h3>${r.title}</h3>
    <p>${r.desc}</p>
  </article>
`
  )
  .join('');

const chatLog = document.getElementById('chat-log');
function addMessage(author, text) {
  const node = document.createElement('div');
  node.className = 'msg';
  node.innerHTML = `<b>${author}:</b> ${text}`;
  chatLog.append(node);
  chatLog.scrollTop = chatLog.scrollHeight;
}

['System: Добро пожаловать в глобальный чат MEOW.', 'Mod_Artemis: Не забываем правила торговли!', 'BuilderMax: Куплю 4 маяка.'].forEach((line) => {
  const [author, ...rest] = line.split(': ');
  addMessage(author, rest.join(': '));
});

document.getElementById('chat-form').addEventListener('submit', (e) => {
  e.preventDefault();
  const fd = new FormData(e.target);
  const text = fd.get('message').toString().trim();
  if (!text) return;
  addMessage(state.user || 'Guest', text);
  e.target.reset();
});
