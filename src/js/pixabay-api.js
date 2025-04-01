'use strict';

import axios from 'axios';

export default async function makeSearchRequest({
  key,
  q,
  type = 'photo',
  orientation = 'horizontal',
  safesearch = true,
  page = 1,
  perPage = 20,
}) {
  const response = await axios.get('https://pixabay.com/api/', {
    params: {
      key,
      q,
      image_type: type,
      orientation,
      safesearch,
      page,
      per_page: perPage,
    },
  });
  return response.data;
}