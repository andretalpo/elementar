document.querySelector('#btn-search-user').onclick = async e => {
  const username = document.querySelector('#username').value;

  limpar();

  const { data } = await axios.get(`/user/${username}`);

  if (!username || !data) {
    mensagem("Não foi encontrado nenhum usuário.");
    return;
  }

  document.querySelector('#email').value = data.email;

  document.querySelector('#name').value = data.name;

  const roles = [
    { value: 'admin', text: 'Admin' },
    { value: 'spec', text: 'Specialist' },
    { value: 'member', text: 'Member' },
  ];

  roles.sort((a, b) => {
    if (a.value === data.role) return -1;

    return 0;
  });

  let optionsHTML = '';

  roles.forEach(option => {
    optionsHTML += `<option value=${option.value}>${option.text}</option>`;
  })

  document.querySelector('#role').innerHTML = optionsHTML;
}


document.querySelector('#btn-update-user').onclick = async e => {
  const role = document.querySelector('#role').value;

  const username = document.querySelector('#username').value;

  const message = await axios.put(`/user/${username}`, { role });

  mensagem(message.data.message);
}

document.querySelector('#btn-delete-user').onclick = async e => {
  const username = document.querySelector('#username').value;

  const message = await axios.delete(`/user/${username}`);

  mensagem(message.data.message);
}

function mensagem(mensagem) {
  document.querySelector("#message").innerHTML = mensagem;
}

function limpar() {
  document.querySelector('#email').value = "";
  document.querySelector('#name').value = "";
}