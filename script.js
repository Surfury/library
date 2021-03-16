const eleID = ID => document.getElementById(ID);
let library = [];
window.addEventListener('load', () => {
  eleID('spinner').remove();
  eleID('cover').classList.add('hidden');
  eleID('cover').addEventListener('click', (e) => hideCover(e));
  document.documentElement.style.setProperty('--light-gray', '#aaaa');
});
/* add a new book and render it */
const addNewBook = (title, author, pages, isRead) => {
  library.push({
    title: title,
    author: author,
    pages: pages,
    isRead: isRead
  });
  updateBooks();
}
/* display books */
const updateBooks = () => {
  eleID('books').innerHTML = '';
  library.forEach(E => {
    eleID('books').innerHTML += `<div class='card'>
  <button>x</button>
  <p title='Title'>${E.title}</p>
      <hr>
      <p title='Author'>${E.author}</p>
      <hr>
      <p title='Number of Pages'>${E.pages}</p>
      <hr>
      <label class='check'>Is Read?
      <input type='checkbox' ${E.isRead} disabled>
      </label>
  </div>`;
  });
  document.querySelectorAll('div.card > button').forEach(E => {
    E.addEventListener('click', (e) => deleteBook(e.target));
  });
  localStorage.clear();
  if (library.length > 0) localStorage.setItem('library', JSON.stringify(library));
}
class Book {
  constructor(title, author, pages, isRead) {
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.isRead = isRead;
  }
  addbook() {
    addNewBook(this.title, this.author, this.pages, this.isRead);
  }
}
/* delete book if you click 'x' */
function deleteBook(E) {
  library = library.filter(Ele => Ele.title !== E.parentElement.firstElementChild.nextElementSibling.textContent);
  /* wait to complete the transition */
  E.parentElement.classList.add('hidden')
  setTimeout(() => E.parentElement.remove(), 490);
  updateBooks();
}
const numberOnly = e => {
  if (!e.key.match(/\d/)) {
    e.preventDefault();
  }
}
const hideCover = e => {
  if (e.target === eleID('cover')) {
    eleID('cover').classList.add('hidden');
    eleID('add').classList.remove('hidden');
  }
}
const showCover = () => {
  eleID('addBook').classList.remove('none');
  eleID('cover').classList.remove('hidden');
  eleID('add').classList.add('hidden');
}
eleID('pages').addEventListener('keypress', (e) => numberOnly(e));

eleID('add').addEventListener('click', showCover);

/* create a new book and send it to render it */
eleID('addNewBook').addEventListener('click', () => {
  let Read = '';
  if (eleID('isRead').checked) Read = 'checked';

  let book = new Book(eleID('title').value.trim(), eleID('author').value.trim(), eleID('pages').value.trim(), Read);
  book.addbook();

  eleID('title').value = '';
  eleID('author').value = '';
  eleID('pages').value = '';
  /* to hide the cover */
  eleID('cover').dispatchEvent(new Event('click'));
  eleID('addNewBook').disabled = 'disabled';
});
/* test the length of inputs */
document.querySelectorAll('input[type="text"]').forEach(E => {
  E.addEventListener('input', () => {
    if (eleID('title').value.length > 5 &&
      eleID('author').value.length > 6 &&
      eleID('pages').value.length >= 2) {
      eleID('addNewBook').removeAttribute('disabled');
    } else {
      eleID('addNewBook').disabled = 'disabled';
    }
  });
});
/* Display saved books */
if (localStorage.getItem('library') !== null) {
  library = JSON.parse(localStorage.getItem('library'));
  for (let i = library.length - 1; i >= 0; i--) {
    addNewBook(library[i].title, library[i].author, library[i].pages, library[i].isRead);
  }
}
