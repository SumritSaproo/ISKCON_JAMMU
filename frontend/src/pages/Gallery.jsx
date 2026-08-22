import { useEffect, useState } from 'react';
import { useGallery } from '../api/content';

function isVideo(item) {
  return item.mediaType === 'video' || /\.(mp4|webm|ogg)(\?|$)/i.test(item.imageUrl || '');
}

export default function Gallery() {
  const [tag, setTag] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(null);
  const { data: images, isLoading } = useGallery(tag ? { tag } : {});
  const selectedImage = selectedIndex === null ? null : images?.[selectedIndex];

  useEffect(() => {
    if (selectedIndex === null) return undefined;

    function handleKeyDown(event) {
      if (event.key === 'Escape') setSelectedIndex(null);
      if (event.key === 'ArrowLeft') {
        setSelectedIndex((current) => (current - 1 + images.length) % images.length);
      }
      if (event.key === 'ArrowRight') {
        setSelectedIndex((current) => (current + 1) % images.length);
      }
    }

    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [images, selectedIndex]);

  function showPrevious() {
    setSelectedIndex((current) => (current - 1 + images.length) % images.length);
  }

  function showNext() {
    setSelectedIndex((current) => (current + 1) % images.length);
  }

  return (
    <div
      className="px-4 sm:px-6 lg:px-10 py-10 sm:py-14"
      onContextMenu={(event) => event.preventDefault()}
    >
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
          {images.map((img, index) => (
            <button
              key={img._id}
              type="button"
              onClick={() => setSelectedIndex(index)}
              className="rounded overflow-hidden aspect-square bg-indigo-deep cursor-zoom-in"
              aria-label={`Open ${img.caption || 'temple photo'}`}
            >
              {isVideo(img) ? (
                <video
                  src={img.thumbnailUrl || img.imageUrl}
                  aria-label={img.caption || 'Temple video'}
                  className="w-full h-full object-cover"
                  muted
                  preload="metadata"
                  controlsList="nodownload noremoteplayback"
                  disablePictureInPicture
                />
              ) : (
                <img
                  src={img.thumbnailUrl || img.imageUrl}
                  alt={img.caption || 'Temple photo'}
                  className="w-full h-full object-cover"
                  loading="lazy"
                  draggable="false"
                />
              )}
            </button>
          ))}
        </div>
      )}

      {selectedImage && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={selectedImage.caption || 'Gallery viewer'}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          onClick={() => setSelectedIndex(null)}
        >
          <button
            type="button"
            onClick={() => setSelectedIndex(null)}
            className="absolute right-4 top-4 text-ivory text-3xl leading-none"
            aria-label="Close gallery viewer"
            title="Close"
          >
            X
          </button>
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              showPrevious();
            }}
            className="absolute left-3 sm:left-8 text-ivory text-3xl px-3 py-2"
            aria-label="Previous gallery item"
            title="Previous"
          >
            &lt;
          </button>
          <div className="max-w-6xl max-h-full" onClick={(event) => event.stopPropagation()}>
            {isVideo(selectedImage) ? (
              <video
                src={selectedImage.imageUrl}
                className="max-h-[85vh] max-w-full"
                controls
                controlsList="nodownload noremoteplayback"
                disablePictureInPicture
                autoPlay
                onContextMenu={(event) => event.preventDefault()}
              />
            ) : (
              <img
                src={selectedImage.imageUrl}
                alt={selectedImage.caption || 'Temple photo'}
                className="max-h-[85vh] max-w-full object-contain select-none"
                draggable="false"
                onContextMenu={(event) => event.preventDefault()}
              />
            )}
          </div>
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              showNext();
            }}
            className="absolute right-3 sm:right-8 text-ivory text-3xl px-3 py-2"
            aria-label="Next gallery item"
            title="Next"
          >
            &gt;
          </button>
        </div>
      )}
    </div>
  );
}
