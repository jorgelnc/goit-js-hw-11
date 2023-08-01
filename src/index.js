import Notiflix from 'notiflix';
import axios from "axios";
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

axios.defaults.headers.common["x-api-key"] = "38461853-2a18bc6938cc549cf03ed926c";

const apiKey = "38461853-2a18bc6938cc549cf03ed926c";
const form = document.getElementById("search-form");
const gallery = document.querySelector(".gallery");
let loadmoreButton = document.querySelector(".load-more");

loadmoreButton.style.display = "none";
let page = 1;
let perPage = 40;

form.addEventListener("submit", (e) => {
    e.preventDefault()
    let valueInput = e.target[0].value;
    if (valueInput === "") {
      Notiflix.Notify.info("Please, enter the search word.");
    } else {
        getImages(valueInput, page, perPage);
        totalHits(valueInput);
  }
})

form.addEventListener("change", (e) => {
  let valueChange = e.target.value;
  page = 1;
  getImages(valueChange, page, perPage);
  totalHits(valueChange);
})

async function getImages(id, page, perPage) {
  try {
    const response = await fetch(`https://pixabay.com/api/?key=${apiKey}&q=${id}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=${perPage}`);
    let data = await response.json();
    let dataInfo = data.hits;
    let card = dataInfo.map(item => {
      const cardImages = `<a class="card__link" href="${item.largeImageURL}">
          <div class="photo-card" id="${item.id}">
            <img class="gallery-item__img" src="${item.webformatURL}" alt="${item.tags}" loading="lazy" />
            <div class="info">
              <p class="info-item"><b>Likes</b>${item.likes}</p>
              <p class="info-item"><b>Views</b>${item.views}</p>
              <p class="info-item"><b>Comments</b>${item.comments}</p>
              <p class="info-item"><b>Downloads</b>${item.downloads}</p>
            </div>
          </div>
        </a>`;
      return cardImages;
    }).join("");

    if (page === 1) {
    gallery.innerHTML = card;
    } else {
    gallery.innerHTML += card;
    }
    page += 1;

  let simplelightbox = new SimpleLightbox(".gallery a", {
    captionsData: `alt`,
    captionDelay: "250ms",
  });
    
  } catch (error) {
  Notiflix.Notify.warning("Sorry, there are no images matching your search query. Please try again.");
      }
    }

loadmoreButton.addEventListener("click", (e) => {
let q = (e.target.parentElement.firstElementChild.firstElementChild.firstElementChild.value);
page += 1;
loadmorePage(q, page);
})

async function loadmorePage(q, page) {
getImages(q, page, 40)
}

async function totalHits(id) {
  const response = await fetch(`https://pixabay.com/api/?key=${apiKey}&q=${id}`);
  let data = await response.json();
  if (data.totalHits === 0) {
    loadmoreButton.style.display = "none";
    Notiflix.Notify.warning("Sorry, there are no images matching your search query. Please try again.");
  } else {
    loadmoreButton.style.display = "inline-block";
    Notiflix.Notify.info(`Hooray! We found ${data.totalHits} images.`);
  }
}