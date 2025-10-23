import { useState } from 'react'
import ReactPlayer from 'react-player'
import { dummyTrailers } from '../assets/assets'
import BlurCircle from './BlurCircle'
import { FaPlay } from 'react-icons/fa'   // play icon

const TrailersSection = () => {
  const [currentTrailer, setCurrentTrailer] = useState(0);
  const { videoUrl, image } = dummyTrailers[currentTrailer];

  return (
    <div className=" px-6 md:px-16 lg:px-24 xl:px-44 py-20 overflow-hidden text-white">
      <p className="text-red-600 font-medium text-lg">Trailers</p>

      {/* ─────── Thumbnail Row ─────── */}
      <div className="flex flex-wrap justify-center gap-6 mt-10">
        {dummyTrailers.map((t, i) => (
          <a
            key={i}
            href={t.videoUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => {
              e.preventDefault();
              setCurrentTrailer(i);
              window.open(t.videoUrl, "_blank");
            }}
            className={`relative group h-24 w-40 rounded-md overflow-hidden shadow-md transition-all duration-200 hover:scale-105 
            ${i === currentTrailer ? '' : ''}`}
          >
            {/* Thumbnail Image */}
            <img
              src={t.image}
              alt={`Trailer ${i + 1}`}
              className="h-full w-full object-cover"
            />

            {/* Dark overlay */}
            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition" />

            {/* Play icon */}
            <div className="absolute inset-0 flex items-center justify-center text-white-500">
              <FaPlay className="text-xl opacity-80 group-hover:scale-110 transition-transform" />
            </div>

            {/* Trailer label (only if available) */}
            {t.label && (
              <div className="absolute bottom-1 left-1 right-1 text-xs text-white font-semibold text-center bg-black/60 px-1 py-0.5 rounded">
                {t.label}
              </div>
            )}
          </a>
        ))}
      </div>
    </div>
  );
};

export default TrailersSection;
