'use strict';

import SimpleLightbox from 'simplelightbox';
import iziToast from 'izitoast';
import makeSearchRequest from './js/pixabay-api.js';
import createGalleryItem from './js/render-functions.js';

const form = document.getElementById('searching-form');
const loader = document.getElementById('loader');
const loadMore = document.getElementById('load-more');
const gallery = document.getElementById('gallery');

const key = '49622419-312bd19c735093b11668a437b';
const perPage = 15;

let loadedImages = 0;

const lightbox = new SimpleLightbox('.gallery-item > a', {
  captionsData: 'alt',
  captionDelay: 250,
});

function requestParams() {
  return {
    key: key,
    q: form.elements.search.value,
    orientation: form.elements.orientation.value,
    type: form.elements.type.value,
    sefesearch: form.elements.safesearch.value,
    page: Math.ceil(loadedImages / perPage) + 1,
    perPage: perPage,
  };
}

async function load() {
  loader.dataset.hidden = false;
  loadMore.dataset.hidden = true;

  try {
    const data = await makeSearchRequest(requestParams());
    const hits = data.hits;
    const totalHits = data.totalHits;
    if (hits.length === 0) {
      iziToast.info({
        title: 'Info',
        message: 'No images found!',
      });
      return;
    }
    const nchildren = gallery.children.length;
    const items = await Promise.all(
      hits.map(async i => {
        return await createGalleryItem({
          original: i.largeImageURL,
          preview: i.webformatURL,
          description: i.tags,
        });
      })
    );
    gallery.append(...items);

    loadedImages += hits.length;
    if (loadedImages < totalHits) {
      iziToast.info({
        title: 'Info',
        message: `Loaded ${loadedImages} of ${totalHits} images. Please click "Load more" to load the rest of the images.`,
      });
      loadMore.dataset.hidden = false;
    } else {
      iziToast.success({
        title: 'Success',
        message: "We're sorry, but you've reached the end of search results.",
      });
    }
    lightbox.refresh();
    gallery.children[nchildren].scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  } catch (err) {
    console.log(err);
    iziToast.error({
      title: 'Error',
      message: err,
    });
  } finally {
    loader.dataset.hidden = true;
  }
}

form.addEventListener('submit', async event => {
  event.preventDefault();
  loadedImages = 0;
  gallery.innerHTML = '';

  if (form.elements.search.value === '') {
    iziToast.warning({
      title: 'Warning',
      message: 'Please enter a search query!',
    });
    return;
  }

  await load();
});

loadMore.addEventListener('click', load);