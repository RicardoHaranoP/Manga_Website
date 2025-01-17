import React, { useState } from 'react';
import MangaCategories from './MangaCategories';
import MangaStatusButtons from './MangaStatusButtons';
import MangaDetailsSection from '../../components/Manga/MangaDetailsSection';
import useMangaCover from "../../hooks/manga/useMangaCover";

// Manga Image and Description Section Component
const MangaImageAndDescriptionSection = ({ id, mangaData, statistics, isStatsLoading, selectedReading, loadingReadingList, handleReadingSelect }) => {
    const [showFullDescription, setShowFullDescription] = useState(false);
    const { data: coverFilename, isLoading: isCoverLoading } = useMangaCover(id);

    const PROXY_SERVER_URL = 'https://yuki-proxy-server.netlify.app';


    const authorRelationship = mangaData.relationships.find(
        (relationship) => relationship.type === 'author'
    );

    const artistRelationship = mangaData.relationships.find(
        (relationship) => relationship.type === 'artist'
    );


    const authorAttributes = authorRelationship?.attributes;
    const artistAttributes = artistRelationship?.attributes;

    const artistName = artistAttributes?.name;
    const authorName = authorAttributes?.name;

    const toggleDescription = () => {
        setShowFullDescription(!showFullDescription);
    };

    const truncatedDescription = mangaData?.attributes.description.en ? mangaData?.attributes.description.en.slice(0, 200) : '';

    return (
        <>
            <MangaDetailsSection id={id} mangaData={mangaData} statistics={statistics} isStatsLoading={isStatsLoading} />

            <div className='flex flex-col items-center justify-between mt-3 mb-6 md:mt-8 md:flex-row md:items-start md:space-x-10'>
                {
                    isCoverLoading ?
                        <div className='h-[100%] w-[90%] md:w-[max-content] shadow-yellow rounded-md mx-auto mt-8 mb-12 sm:m-0'>
                            <div className="animate-pulse bg-white bg-opacity-40 h-[400px] md:h-[310px] lg:h-[450px] min-w-[250px] lg:w-[273px] rounded-md" />
                        </div> :
                        <div className='h-[350px] md:h-[310px] lg:h-[450px] w-[90%] bg-white bg-opacity-40 md:w-[400px] mt-6 sm:m-0 shadow-yellow rounded-md'>
                            <img src={`${PROXY_SERVER_URL}/images/${id}/${encodeURIComponent(coverFilename)}`} alt={mangaData?.attributes.title.en} decoding='async' fetchPriority='high' loading='eager' className="w-full h-full bg-top bg-auto rounded-md" />
                        </div>
                }
                <div className='mt-4 md:mt-0 w-[95%] md:w-full'>
                    <h2 className='mb-3 mt-5 md:mt-0 text-[25px] md:text-[30px] font-bold text-start text-white'>{mangaData?.attributes.title.en}</h2>
                    <div className="mb-3 mt-5 md:mt-0 text-[14px]">
                        <span className='mr-1 text-white text-start'> {showFullDescription ? mangaData?.attributes.description.en : truncatedDescription} </span>
                        {mangaData?.attributes?.description?.en?.length > 200 && (
                            <span className="text-blue-500 cursor-pointer" onClick={toggleDescription}>
                                {showFullDescription ? 'See Less' : 'See More'}
                            </span>
                        )}
                    </div>
                    <div className='flex flex-col items-start gap-2 mt-5 mb-3 md:mt-0 md:items-center md:flex-row'>
                        {authorName && <p className="text-[17px] text-start text-white"><span className='text-[20px] font-semibold'>Author: </span> {authorName}</p>}
                        {artistName && <p className=" text-[17px] text-start text-white"><span className='text-[20px] font-semibold'>Artist: </span> {artistName}</p>}
                    </div>

                    <MangaCategories mangaData={mangaData} />
                    <MangaStatusButtons selectedReading={selectedReading} handleReadingSelect={handleReadingSelect} loadingReadingList={loadingReadingList} />
                </div>
            </div></>
    );
};

export default MangaImageAndDescriptionSection;
