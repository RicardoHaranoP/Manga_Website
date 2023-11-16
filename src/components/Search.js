import React, { useState } from 'react';
import axios from 'axios';
import { XCircleIcon } from "@heroicons/react/24/outline";

const categories = [
  "Action",
  "Adventure",
  "Comedy",
  "Drama",
  "Fantasy",
  "Horror",
  "Romance",
  "Sci-Fi",
  "Slice of Life",
  "Sports",
  "Thriller",
  "Historical",
  "Psychological",
  "School Life",
  "Shounen",
  "Shoujo",
  "Seinen",
  "Josei",
];

const statuses = ["Ongoing", "Completed"];

const orders = [
  { label: "Rating", value: "rating" },
  { label: "Year", value: "year" },
  { label: "Followed Count", value: "followedCount" },
];

const orderDirections = [
  { label: "Ascending", value: "asc" },
  { label: "Descending", value: "desc" },
];

const Search = ({ setMangas, setVis, setMangaVis, setLoading }) => {
  const [mangaName, setMangaName] = useState('');
  const [tags, setTags] = useState([]);
  const [status, setStatus] = useState('');
  const [order, setOrder] = useState('');
  const [orderDirection, setOrderDirection] = useState('');


  async function handleSearch() {
    const searchParams = {
      mangaName,
      includedTags: tags.filter((tag) => tag.type === 'include').map((tag) => tag.name),
      excludedTags: tags.filter((tag) => tag.type === 'exclude').map((tag) => tag.name),
      status,
      order,
      orderDirection,
    };

    setLoading(true);


    setVis(prevVis => !prevVis);
    setMangaVis(true);

    const tagsResponse = await axios.get(`https://manga-proxy-server.onrender.com/api?url=${encodeURIComponent(`https://api.mangadex.org/manga/tag`)}`);

    if (searchParams.mangaName) {
      const resp = await axios({
        method: 'GET',
        url: `https://manga-proxy-server.onrender.com/manga?url=${encodeURIComponent(`https://api.mangadex.org/manga`)}`,
        withCredentials: false,
        params: {
          title: searchParams.mangaName
        }
      });

      // console.log(resp.data.data);
      setMangas(resp.data.data);
      return;
    }

    const includedTagIDs = tagsResponse.data.data
      .filter(tag => searchParams.includedTags.includes(tag.attributes.name.en))
      .map(tag => tag.id);

    const excludedTagIDs = tagsResponse.data.data
      .filter(tag => searchParams.excludedTags.includes(tag.attributes.name.en))
      .map(tag => tag.id);

    const finalOrderQuery = {};

    for (const [key, value] of Object.entries(
      searchParams.order = "rating" ? { rating: "desc" }
        : searchParams.order = "followedCount" ? { followedCount: "desc" }
          : { year: "desc" })
    ) {
      finalOrderQuery[`order[${key}]`] = value;
    }

    const response = await axios({
      method: 'get',
      url: `https://manga-proxy-server.onrender.com/mangas?url=https://api.mangadex.org/manga`,
      withCredentials: false,
      params: {
        includedTags: includedTagIDs,
        excludedTags: excludedTagIDs,
        ...finalOrderQuery,
        limit: searchParams.limit,
      },
    });

    // console.log(response.data.data)
    setLoading(false);
    setMangas(response.data.data);
    return response.data.data;
  };


  const handleTagClick = (tagName) => {
    const existingTag = tags.find((tag) => tag.name === tagName);
    if (existingTag) {
      if (existingTag.type === 'include') {
        const updatedTags = tags.map((tag) =>
          tag.name === tagName ? { ...tag, type: 'exclude' } : tag
        );
        setTags(updatedTags);
      } else if (existingTag.type === 'exclude') {
        const updatedTags = tags.filter((tag) => tag.name !== tagName);
        setTags(updatedTags);
      }
    } else {
      setTags([...tags, { name: tagName, type: 'include' }]);
    }
  };

  const handleCloseSearch = () => {
    setMangaVis(true)
    setVis(prevVis => !prevVis)
  };

  const handleStatusClick = (selectedStatus) => {
    setStatus(selectedStatus === status ? '' : selectedStatus);
  };

  const handleOrderChange = (e) => {
    setOrder(e.target.value);
  };

  const handleOrderDirectionChange = (e) => {
    setOrderDirection(e.target.value);
  };

  const isMangaNameEmpty = mangaName.trim() === '';
  // const searchButtonText = isMangaNameEmpty ? 'Filter' : 'Search';

  return (
    <div className="w-[90%] md:w-[70%] p-7 mx-auto bg-white  border border-gray-300 rounded-lg relative">
      <button onClick={() => handleCloseSearch()}>
        <XCircleIcon className="w-7 h-7 text-black absolute top-2 right-2" />
      </button>
      <h2 className="mb-4 text-[20px] md:text-2xl font-bold">Search Manga</h2>
      <div className="mb-4">
        <label htmlFor="mangaName" className="block mb-1 text-[15px] md:text-sm">Manga Name:</label>
        <input
          type="text"
          id="mangaName"
          className="w-full px-3 py-2 border border-gray-300 rounded"
          value={mangaName}
          onChange={(e) => setMangaName(e.target.value)}
        />
      </div>
      <div className="mb-4">
        <h3 className="mb-2 font-bold text-[15px] md:text-lg">Tags:</h3>
        <div>
          {categories.map((tag) => {
            const existingTag = tags.find((t) => t.name === tag);
            const buttonClasses = existingTag
              ? existingTag.type === 'include'
                ? 'bg-blue-500 text-white'
                : 'bg-red-500 text-white'
              : 'bg-gray-300 text-gray-700';

            return (
              <button
                key={tag}
                className={`mr-2 mb-2 px-3 py-2 text-[10px] md:text-sm font-medium rounded ${buttonClasses}`}
                onClick={() => handleTagClick(tag)}
              >
                {tag}
                {existingTag && (
                  <span className="ml-2">
                    {existingTag.type === 'include' ? '✓' : '✕'}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
      <div className="mb-4">
        <h3 className="mb-2 font-bold text-[15px] md:text-lg">Status:</h3>
        <div>
          {statuses.map((statusOption) => (
            <button
              key={statusOption}
              className={`mr-2 mb-2 px-3 py-2 text-[10px] md:text-sm font-medium rounded ${status === statusOption ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-700'
                }`}
              onClick={() => handleStatusClick(statusOption)}
            >
              {statusOption}
              {status === statusOption && <span className="ml-2">✓</span>}
            </button>
          ))}
        </div>
      </div>
      <div className="mb-4">
        <label htmlFor="order" className="block mb-1 text-[15px] md:text-lg">Order:</label>
        <select
          id="order"
          className="w-full px-3 py-2 text-[10px] md:text-sm border border-gray-300 rounded"
          value={order}
          onChange={handleOrderChange}
        >
          <option value="">None</option>
          {orders.map((orderOption) => (
            <option key={orderOption.value} value={orderOption.value}>
              {orderOption.label}
            </option>
          ))}
        </select>
      </div>
      <div className="mb-4">
        <label htmlFor="orderDirection" className="block mb-1 text-[15px] md:text-lg">Order Direction:</label>
        <select
          id="orderDirection"
          className="w-full px-3 py-2 text-[10px] md:text-sm border border-gray-300 rounded"
          value={orderDirection}
          onChange={handleOrderDirectionChange}
        >
          <option value="">None</option>
          {orderDirections.map((orderDirectionOption) => (
            <option key={orderDirectionOption.value} value={orderDirectionOption.value}>
              {orderDirectionOption.label}
            </option>
          ))}
        </select>
      </div>
      <button
        className="px-4 py-2 text-white text-[10px] md:text-sm bg-blue-500 rounded hover:bg-blue-400"
        onClick={handleSearch}
      >
        {isMangaNameEmpty ? 'Filter' : 'Search'}
      </button>
    </div>
  );
}

export default Search;
