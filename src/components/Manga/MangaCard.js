import React, { useState, useContext, useEffect } from 'react';
import useMangaCover from "../../hooks/manga/useMangaCover";
import useMangaStatistics from "../../hooks/manga/useMangaStatistics";
import { VisibilityContext } from 'react-horizontal-scrolling-menu';
import MangaCardSkeleton from './MangaCardSkeleton';
import { Link } from "react-router-dom";


const MangaCard = React.memo(({ manga, setIsLastItem = () => { return false } }) => {
    const { id, attributes } = manga;

    const PROXY_SERVER_URL = 'https://yuki-proxy-server.netlify.app';

    const { isLastItemVisible } = useContext(VisibilityContext);

    useEffect(() => {
        setIsLastItem(isLastItemVisible);
    }, [isLastItemVisible])


    const [isHovered, setIsHovered] = useState(false);
    const [isClicked, setIsClicked] = useState(false);

    const handleMouseEnter = () => {
        setIsHovered(true);

    };

    const handleMouseLeave = () => {
        setIsHovered(false);
    };

    const handleClick = () => {
        setIsClicked(!isClicked);
    };

    const { data: coverFilename, isLoading: isCoverLoading, isError: isCoverError, error: coverError } = useMangaCover(id);
    const { data: statistics, isLoading: isStatsLoading, isError: isStatsError, error: statsError } = useMangaStatistics(id);

    if (isStatsLoading || isStatsError) {
        return (
            <MangaCardSkeleton />
        );
    }


    const imageUrl = coverFilename;

    const { rating, follows } = statistics;

    const getTitle = (language) => {
        const altTitle = attributes.altTitles.find((title) => title[language]);
        if (altTitle) {
            return altTitle[language];
        } else {
            return attributes.title.en;
        }
    };

    function truncateTitle(title) {
      if (!title) {
        return;
      }

      // Split the title into words
      const words = title?.split(" ");

      let truncatedTitle = "";
      let count = 0;

      if (words?.length < 2) {
        return (
          words[0].slice(0, 10) +
          (words[0].slice(0, 10).length > 10 ? "..." : "")
        );
      }

      // Loop through the words
      for (const word of words) {
        // Check if adding the current word will exceed 10 characters
        if (word?.length > 7) {
          // If adding this word would exceed 10 characters, add it and stop concatenating
          truncatedTitle += word?.slice(0, 7);
          break;
        }

        // Concatenate the word to the shortened title
        truncatedTitle += word + " ";
        count++;

        // Check if we have already added three words
        if (count >= 3) {
          // If we have added three words, stop concatenating
          break;
        }
      }

      // Remove the trailing space
      truncatedTitle = truncatedTitle.trim() + (words?.length >= 3 ? "..." : "");

      return truncatedTitle;
    }

    const title = attributes.title.en || getTitle('en') || getTitle('ja');

    

    return (
      <div
        className={`relative rounded-md md:rounded-lg cursor-pointer w-[120px] h-[170px] xm:w-[160px] xm:h-[200px] md:w-[300px] md:h-[300px] lg:w-[300px] lg:h-[530px]  overflow-hidden shadow-lg bg-white transform transition-transform `}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
      >
        <div className="flex justify-center items-center h-[200px] w-[100%] md:h-[300px] overflow-hidden">
          {isCoverLoading || isCoverError ? (
            <div className="h-[200px] w-[100%] md:h-[300px] bg-gray-200 animate-pulse" />
          ) : (
            <img
              src={`${PROXY_SERVER_URL}/images/${id}/${encodeURIComponent(
                imageUrl
              )}`}
              alt={attributes.title.en}
              decoding="async"
              fetchPriority="high"
              loading="eager"
              className="h-[200px] w-[100%] md:h-[300px] object-fill md:object-cover transition ease-in-out delay-150 lg:hover:-translate-y-1 lg:hover:scale-110 cursor-pointer duration-300"
            />
          )}
        </div>
        <div
          className={`absolute top-0 left-0 right-0 bottom-0 hidden lg:flex bg-[#1F1F1F] bg-opacity-80 flex-col items-center justify-center ${
            isHovered ? "opacity-100 scale-105" : "opacity-0"
          } transition-opacity duration-300`}
        >
          <p className="p-4 mb-3 text-center text-white">
            {attributes.description.en
              ? attributes.description.en.split(" ").slice(0, 20).join(" ")
              : attributes.title.en}
            ...
          </p>
          <div className="mx-auto list-none">
            <Link
              to={`/manga/${manga.id}/overview`}
              className="flex justify-center items-center btn text-white font-bold bg-[#1B6FA8] hover:bg-[#E40066] border border-[#1F1F1F] w-max px-4 py-3 rounded"
            >
              <span className="z-20"> Read Now</span>
            </Link>
          </div>
        </div>
        <div
          className={`absolute -bottom-1 lg:hidden py-1 border-t-[5px] border-[#1B6FA8] w-full bg-[#1F1F1F] bg-opacity-80 ${
            isClicked ? "" : ""
          }`}
        >
          <p className="text-[12px] text-white text-center font-semibold">
            {title.split(" ").slice(0, 2).join(" ")}...
          </p>
        </div>

        <div
          className={`absolute -bottom-1 left-0 right-0 lg:hidden h-[manx-content] w-[102%] pb-6 md:pb-5 bg-[#1F1F1F] bg-opacity-80 text-white text-center ${
            isHovered ? "opacity-100" : "opacity-0"
          } transition-opacity duration-300`}
        >
          <p className="p-2 text-[12px] font-semibold">
            {title.split(" ").slice(0, 2).join(" ")}
          </p>
          <div className="flex items-center justify-center pb-2">
            <span className="text-gray-500">Rating:</span>
            <div className="flex items-center ml-1">
              <span className="mr-1 text-yellow-500">
                {rating.average
                  ? rating?.average.toString().slice(0, 3)
                  : "N/A"}
              </span>
              ⭐
            </div>
          </div>
          <Link
            className="mx-auto list-none text-white text-[13px] font-bold bg-[#1B6FA8] hover:bg-[#E40066] border border-[#1F1F1F] w-[80%] px-2 py-2 mb-2 rounded"
            to={`/manga/${manga.id}/overview`}
          >
            Read Now
          </Link>
        </div>
        <div className="bg-[#1B6FA8] hidden lg:flex p-2 flex-col items-center justify-center border-y-2 border-[#1F1F1F]">
          <h3 className="text-lg text-white text-center tracking-[0.2em] mb-1">
            {truncateTitle(title)}
          </h3>
          <p className="text-[16px] text-white"></p>
        </div>
        <div className="hidden px-2 py-2 lg:block">
          <div className="flex flex-col px-2 mt-1 mb-2">
            <div className="mb-2">
              <span className="mb-2 mr-2 text-gray-500">
                {follows.toLocaleString()}
              </span>
              <span className="text-[#1F1F1F] mb-2 font-bold">follows</span>
            </div>
            <div className="flex flex-wrap gap-1">
              <span className="mt-2 mr-2 text-gray-500">Genres:</span>
              {attributes.tags.slice(0, 2).map((item, index) => (
                <span
                  key={index}
                  className="text-[#1F1F1F] text-[12px] overflow-wrap rounded-md py-1 px-2 mr-1 flex justify-center items-center bg-gray-300"
                >
                  {item.attributes.name.en}
                </span>
              ))}
            </div>
          </div>
          <div className="flex items-center px-2 mb-2">
            <span className="text-gray-500">Rating:</span>
            <div className="flex items-center ml-1">
              <span className="mr-1 text-yellow-500">
                {rating.average
                  ? rating?.average.toString().slice(0, 3)
                  : "N/A"}
              </span>
              ⭐
            </div>
          </div>
          <div className="flex items-center px-2 mb-2">
            <span className="mr-2 text-gray-500">status:</span>
            <span className="px-2 text-[12px] text-[#1F1F1F] rounded-md p-1 w-min flex justify-center items-center bg-gray-300">
              {attributes.status}
            </span>
          </div>
        </div>
      </div>
    );
});

export default MangaCard;
