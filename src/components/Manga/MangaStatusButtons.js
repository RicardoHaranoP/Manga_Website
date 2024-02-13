import { Circles } from 'react-loader-spinner'


// Manga Status Buttons Component
const MangaStatusButtons = ({ myList, selectedReading, handleReadingSelect, loadingReadingList }) => {
    return (
        <div className='mt-6'>
            <p className='text-[20px]'>My List</p>
            <div className='flex flex-wrap mt-4 border-box'>
                {myList.map((item, index) => (
                    <button
                        className={`flex items-center justify-center md:basis-1/5 mr-1 md:mr-2 grow my-1 px-3 py-1 rounded-md font-semibold text-center text-[10px] md:text-[12px] tracking-[0.1em] ${item === "Remove form list" && selectedReading !== "Remove form list" && "bg-white text-red-500"}
                            ${selectedReading === "Remove form list" && item === "Remove form list" ? "bg-red-500 text-white"
                                : selectedReading === item
                                    ? "bg-blue-500 text-white"
                                    : "bg-gray-200 text-[#1F1F1F]"
                            }`}
                        key={index}
                        disabled={loadingReadingList || selectedReading === item}
                        onClick={() => handleReadingSelect(item)}
                    >
                        {loadingReadingList && selectedReading === item ? (
                            <Circles
                                height="20"
                                width="20"
                                color="#ffffff"
                                ariaLabel="circles-loading"
                                wrapperStyle={{}}
                                wrapperClass=""
                                visible={true}
                            />
                        )
                            :
                            item
                        }
                    </button>
                ))}
            </div>
        </div >
    );
};

export default MangaStatusButtons;