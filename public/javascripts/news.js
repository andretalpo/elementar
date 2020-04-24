window.onload = async () => {
    const userId = document.querySelector('#userId').getAttribute('userId');
    if (userId) {
        document.querySelectorAll('.vote-button').forEach(e => e.classList.remove('invisible'));
    }
}

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