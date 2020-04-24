document.querySelector('#voteTruth').onclick = async (element) => {
    const newsId = document.querySelector('#newsId').getAttribute('newsId');

    console.log(newsId);

    try{
        await axios.put(`http://localhost:3000/news/${newsId}/voteTruth`);

        // await axios.get('http://localhost:3000/user-home');
    } catch (error) {
        console.log(error);
    }
};