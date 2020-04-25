window.onload = async () => {
    const { data } = await axios.get('/auth/authenticated')
    if (data.authenticated) {
        document.querySelector('#logout').classList.remove('invisible');
        document.querySelector('#login').classList.add('invisible');
    } else {
        document.querySelector('#logout').classList.add('invisible');
        document.querySelector('#login').classList.remove('invisible');
    }
}