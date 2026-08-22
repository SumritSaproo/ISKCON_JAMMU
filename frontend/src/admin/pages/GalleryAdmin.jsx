import { useState, useRef } from 'react';
import { useGallery, useUploadGalleryImage, useDeleteGalleryImage } from '../../api/content';

export default function GalleryAdmin() {
  const { data: images, isLoading } = useGallery({ limit: 50 });
  const uploadImage = useUploadGalleryImage();
  const deleteImage = useDeleteGalleryImage();
  const fileRef = useRef(null);
  const [caption, setCaption] = useState('');
  const [tags, setTags] = useState('');
  const [error, setError] = useState('');

  function handleUpload(e) {
    e.preventDefault();
    setError('');
    const file = fileRef.current?.files?.[0];
    if (!file) {
      setError('Please choose an image file.');
      return;
    }
    const formData = new FormData();
    formData.append('image', file);
    if (caption) formData.append('caption', caption);
    if (tags) formData.append('tags', tags);

    uploadImage.mutate(formData, {
      onSuccess: () => {
        setCaption('');
        setTags('');
        fileRef.current.value = '';
      },
      onError: (err) =>
        setError(err?.response?.data?.message || 'Upload failed — check Cloudinary credentials.'),
    });
  }

  return (
    <div>
      <div className="font-display font-semibold text-lg text-indigo mb-5">Gallery</div>

      <form onSubmit={handleUpload} className="bg-white border border-indigo/10 rounded-lg p-5 mb-6">
        <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp,image/gif" className="text-xs mb-2.5 block" />
        <div className="flex gap-2.5 mb-3">
          <input
            placeholder="Caption (optional)"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            className="flex-1 border border-indigo/15 rounded px-3 py-2 text-xs"
          />
          <input
            placeholder="Tags, comma separated"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            className="flex-1 border border-indigo/15 rounded px-3 py-2 text-xs"
          />
        </div>
        {error && <p className="text-[11px] text-vermilion mb-2">{error}</p>}
        <button
          disabled={uploadImage.isPending}
          className="bg-indigo text-ivory text-xs font-semibold px-4 py-2 rounded disabled:opacity-60"
        >
          {uploadImage.isPending ? 'Uploading…' : 'Upload Image'}
        </button>
      </form>

      {isLoading ? (
        <p className="text-xs text-indigo/50">Loading…</p>
      ) : (
        <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
          {images?.map((img) => (
            <div key={img._id} className="relative aspect-square rounded overflow-hidden bg-indigo-deep">
              <img
                src={img.thumbnailUrl || img.imageUrl}
                alt={img.caption || ''}
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                aria-label={`Delete ${img.caption || 'gallery image'}`}
                disabled={deleteImage.isPending}
                onClick={() => {
                  if (window.confirm('Delete this image from the gallery?')) deleteImage.mutate(img._id);
                }}
                className="absolute right-1 top-1 rounded bg-vermilion/90 px-2 py-1 text-xs text-ivory disabled:opacity-60"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
