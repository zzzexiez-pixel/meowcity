const tabButtons = document.querySelectorAll('.tab-btn');
const tabPanels = document.querySelectorAll('.tab-panel');

function openTab(tabId) {
  tabButtons.forEach((button) => {
    button.classList.toggle('active', button.dataset.tab === tabId);
  });

  tabPanels.forEach((panel) => {
    panel.classList.toggle('active', panel.id === tabId);
  });
}

tabButtons.forEach((button) => {
  button.addEventListener('click', () => openTab(button.dataset.tab));
});

document.querySelectorAll('[data-open-tab]').forEach((button) => {
  button.addEventListener('click', () => openTab(button.dataset.openTab));
});

const authForm = document.getElementById('auth-form');
const profileCard = document.getElementById('profile-card');

authForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const formData = new FormData(authForm);
  const nickname = formData.get('nickname')?.toString().trim();

  if (!nickname) {
    return;
  }

  profileCard.innerHTML = `
    <h3>Профиль</h3>
    <p class="muted">Вы авторизованы как <strong>${nickname}</strong>.</p>
    <ul>
      <li>Город: Нео-Мурбург</li>
      <li>Баланс: 245 700$</li>
      <li>Ранг: Легенда сервера</li>
    </ul>
  `;

  authForm.reset();
});

const supportForm = document.getElementById('support-form');
const supportMessage = document.getElementById('support-message');

supportForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const formData = new FormData(supportForm);
  const topic = formData.get('topic')?.toString().trim();
  const message = formData.get('message')?.toString().trim();

  if (!topic || !message) {
    supportMessage.textContent = 'Заполните тему и описание проблемы.';
    supportMessage.className = 'hint error';
    return;
  }

  supportMessage.textContent = `Тикет «${topic}» создан. Ответим в течение 10 минут.`;
  supportMessage.className = 'hint success';
  supportForm.reset();
});
