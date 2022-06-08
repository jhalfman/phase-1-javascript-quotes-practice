fetch(`http://localhost:3000/quotes?_embed=likes`)
.then(resp => resp.json())
.then(data => data.forEach(quote => {
    createQuoteCard(quote);
}))

const newQuoteForm = document.querySelector("#new-quote-form");
newQuoteForm.addEventListener("submit", e => {
    e.preventDefault();
    fetch(`http://localhost:3000/quotes`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            quote: `${e.target["new-quote"].value}`,
            author: `${e.target["author"].value}`,
            likes: []
        })
    })
    .then(resp => resp.json())
    .then(data => createQuoteCard(data))
    
    e.target.reset();
})

function createQuoteCard(data) {
    const quoteCard = document.createElement("li");
    const quoteList = document.querySelector("#quote-list");
    quoteCard.className = "quote-card";
    quoteCard.innerHTML = `
    <blockquote class="blockquote">
    <p class="mb-0">${data.quote}</p>
    <footer class="blockquote-footer">${data.author}</footer>
    <br>
    <button class='btn-success'>Likes: <span>${data.likes.length}</span></button>
    <button class='btn-danger'>Delete</button>
    </blockquote>
    `
    const deleteButton = quoteCard.querySelector(".btn-danger");
    deleteButton.addEventListener("click", e => {
        fetch(`http://localhost:3000/quotes/${data.id}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json"
        }
    })
    .then(resp => resp.json())
    .then(quote=> {
        console.log(quote);
        quoteCard.remove();
    });
    })

    const likeButton = quoteCard.querySelector(".btn-success");
    likeButton.addEventListener("click", e => {
        fetch(`http://localhost:3000/likes`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                quoteId: data.id
            })
        })
        .then(resp => resp.json())
        .then(update => {
            console.log(update)
            likeButton.querySelector("span").innerText= parseInt(likeButton.querySelector("span").innerText, 10) + 1
            // console.log(likeButton.querySelector("span").innerText)
            // console.log(data.likes.length)
        })
        
    })

    quoteList.appendChild(quoteCard);
}