axios.get('/auth/authenticated')
    .then(response => {
        const { authenticated, role } = response.data;
        if (authenticated) {
            document.querySelectorAll('.vote-button').forEach(e => e.classList.remove('invisible'));
        }

        if (role === 'spec') {
            document.querySelector('#adicionarAnalise').classList.remove('invisible');
        }

        if (role === 'admin') {
            document.querySelector('#excluirNoticia').classList.remove('invisible');
        }
    })
    .catch(error => {
        console.log(error);
    });

document.querySelector('#voteTruth').onclick = async element => {
    const newsId = document.querySelector('#newsId').getAttribute('newsId');
    try {
        const response = await axios.put(`/news/${newsId}/voteTruth`);
        if (response.data.message.includes('votada')) {
            document.querySelector('#message').innerHTML = response.data.message;
        } else {
            window.location.reload();
        }
    } catch (error) {
        console.log(error);
    }
};

document.querySelector('#voteFake').onclick = async element => {
    const newsId = document.querySelector('#newsId').getAttribute('newsId');
    console.log(newsId);
    try {
        const response = await axios.put(`/news/${newsId}/voteFake`);
        if (response.data.message.includes('votada')) {
            document.querySelector('#message').innerHTML = response.data.message;
        } else {
            window.location.reload();
        }
    } catch (error) {
        console.log(error);
    }
};

document.querySelector('#adicionarAnalise').onclick = element => {
    document.querySelector('#textAnalise').classList.remove('invisible');
    document.querySelector('#textFonte').classList.remove('invisible');

    document.querySelector('#salvarAnalise').classList.remove('invisible');
    document.querySelector('#adicionarAnalise').classList.add('invisible');
};

document.querySelector('#salvarAnalise').onclick = async element => {
    const newsId = document.querySelector('#newsId').getAttribute('newsId');
    const analise = document.querySelector('#textAnalise').value;
    const fonte = document.querySelector('#textFonte').value;

    console.log(newsId, analise, fonte);
    const response = await axios.put(`/news/spec/${newsId}/analisys`, { specText: analise, sourceUrl: fonte });
    
    if (response.data.message.includes('Preencha')) {
        document.querySelector('#message').innerHTML = response.data.message;
    } else {
        window.location.reload();
    }
};

document.querySelector('#excluirNoticia').onclick = async element => {
    const newsId = document.querySelector('#newsId').getAttribute('newsId');

    await axios.delete(`/news/${newsId}`);

    window.location.replace('/user-home');
};