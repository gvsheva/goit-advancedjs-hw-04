'use strict';

export default async function createGalleryItem({
  preview,
  original,
  description,
}) {
  return new Promise(resolve => {
    const img = document.createElement('img');
    img.src = preview;
    img.dataset.source = original;
    img.alt = description;
    img.classList.add('gallery-image');
    const a = document.createElement('a');
    const li = document.createElement('li');
    a.appendChild(img);
    a.classList.add('gallery-link');
    a.href = original;
    li.appendChild(a);
    li.classList.add('gallery-item');
    img.onload = () => resolve(li);
  });
}