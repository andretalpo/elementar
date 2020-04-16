document.querySelector('#btn-search-user').onclick = async e => {
    const username = document.querySelector('#username').value;

    const { data } = await axios.get(`http://localhost:3000/user/${username}`);
    
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

    console.log(await axios.put(`http://localhost:3000/user/${username}`, { role }));
}