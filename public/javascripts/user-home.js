axios.get('/auth/authenticated')
    .then(response => {
        const { authenticated, role } = response.data;
        if (role === 'admin') {
            document.querySelector('#gestaoUsuario').classList.remove('invisible');
        }
    })
    .catch(error => {
        console.log(error);
    });
