import { useState } from 'react';
import { useBlogPosts } from '../../api/content';
import { useCreateBlogPost, useDeleteBlogPost } from '../../api/admin';

export default function BlogAdmin() {
  const { data: posts, isLoading } = useBlogPosts({});
  const createPost = useCreateBlogPost();
  const deletePost = useDeleteBlogPost();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', contentHtml: '', language: 'en', tags: '' });

  function handleCreate(e) {
    e.preventDefault();
    const slug = form.title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-');
    createPost.mutate(
      {
        ...form,
        slug,
        tags: form.tags ? form.tags.split(',').map((t) => t.trim()) : [],
      },
      {
        onSuccess: () => {
          setForm({ title: '', contentHtml: '', language: 'en', tags: '' });
          setShowForm(false);
        },
      }
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-5">
        <div className="font-display font-semibold text-lg text-indigo">Blog</div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-vermilion text-ivory text-xs font-semibold px-4 py-2 rounded"
        >
          {showForm ? 'Cancel' : '+ New Post'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="bg-white border border-indigo/10 rounded-lg p-5 mb-6">
          <input
            required
            placeholder="Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="w-full border border-indigo/15 rounded px-3 py-2 text-xs mb-2.5"
          />
          <textarea
            required
            placeholder="Content (HTML allowed)"
            rows={6}
            value={form.contentHtml}
            onChange={(e) => setForm({ ...form, contentHtml: e.target.value })}
            className="w-full border border-indigo/15 rounded px-3 py-2 text-xs mb-2.5 font-mono"
          />
          <div className="flex gap-2.5 mb-3">
            <select
              value={form.language}
              onChange={(e) => setForm({ ...form, language: e.target.value })}
              className="border border-indigo/15 rounded px-3 py-2 text-xs"
            >
              <option value="en">English</option>
              <option value="hi">Hindi</option>
            </select>
            <input
              placeholder="Tags (comma separated)"
              value={form.tags}
              onChange={(e) => setForm({ ...form, tags: e.target.value })}
              className="flex-1 border border-indigo/15 rounded px-3 py-2 text-xs"
            />
          </div>
          <button
            disabled={createPost.isPending}
            className="bg-indigo text-ivory text-xs font-semibold px-4 py-2 rounded disabled:opacity-60"
          >
            {createPost.isPending ? 'Publishing…' : 'Publish Post'}
          </button>
        </form>
      )}

      <div className="bg-white border border-indigo/10 rounded-lg overflow-hidden">
        {isLoading ? (
          <div className="p-4 text-xs text-indigo/50">Loading…</div>
        ) : !posts?.length ? (
          <div className="p-4 text-xs text-indigo/50">No posts yet.</div>
        ) : (
          posts.map((p) => (
            <div
              key={p._id}
              className="flex justify-between items-center px-4.5 py-3 border-b border-indigo/10 last:border-0 text-xs"
            >
              <div>
                <div className="font-semibold text-indigo">{p.title}</div>
                <div className="text-indigo/50">
                  {p.language?.toUpperCase()} &middot;{' '}
                  {new Date(p.publishedAt).toLocaleDateString('en-IN')}
                </div>
              </div>
              <button
                onClick={() => confirm(`Delete "${p.title}"?`) && deletePost.mutate(p._id)}
                className="text-vermilion text-[11px]"
              >
                Delete
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
