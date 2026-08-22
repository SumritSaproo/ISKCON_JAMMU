import { useState } from 'react';
import { useGallery } from '../api/content';

export default function Gallery() {
  const [tag, setTag] = useState('');
  const { data: images, isLoading } = useGallery(tag ? { tag } : {});

  return (
    <div className="px-4 sm:px-6 lg:px-10 py-10 sm:py-14">
      <span className="text-[10.5px] tracking-widest uppercase text-vermilion font-semibold block mb-2">
        Moments of Bhakti
      </span>
      <h1 className="font-display font-semibold text-2xl text-indigo mb-1">Gallery</h1>
      <div className="h-[3px] w-14 bg-marigold rounded mb-5" />

      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setTag('')}
          className={`text-xs px-3.5 py-1.5 rounded-full border ${
            !tag ? 'bg-indigo text-ivory border-indigo' : 'border-indigo/15 text-indigo'
          }`}
        >
          All
        </button>
      </div>

      {isLoading ? (
        <p className="text-sm text-indigo/60">Loading gallery…</p>
      ) : !images?.length ? (
        <p className="text-sm text-indigo/60">No photos uploaded yet — check back soon.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {images.map((img) => (
            <div key={img._id} className="rounded overflow-hidden aspect-square bg-indigo-deep">
              <img
                src={img.thumbnailUrl || img.imageUrl}
                alt={img.caption || 'Temple photo'}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
