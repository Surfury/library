const eleID = ID => document.getElementById(ID);
let library = [];
/* create nodes and append them */
const newNode = (HTMLTag = 'div', parent = eleID('books')) => {
  let node = document.createElement(HTMLTag);
  parent.appendChild(node);
  return node;
}
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
    let card = newNode();
    card.classList.add('card');

    let removeButton = newNode('button',card);
    removeButton.textContent='x';
    removeButton.addEventListener('click', (e) => deleteBook(e.target));

    let titleParagraph = newNode('p',card);
    titleParagraph.title='Title';
    titleParagraph.textContent=E.title;

    newNode('hr',card);

    let pages = newNode('p',card);
    pages.title='Number of Pages';
    pages.textContent=E.pages;
    
    newNode('hr',card);

    let author = newNode('p',card);
    author.title='Author';
    author.textContent=E.author;

    newNode('hr',card);

    let label = newNode('label',card);
    label.classList.add('check');
    label.textContent='Is Read?';

    let checkbox = newNode('input',label);
    checkbox.type='checkbox';
    checkbox.textContent=E.isRead;
    checkbox.disabled='disabled';
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
  E.parentElement.classList.add('hidden');
  setTimeout(() => {
    updateBooks();
  },390);
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
  updateBooks();
}
