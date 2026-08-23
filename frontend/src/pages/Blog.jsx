import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useBlogPosts, useBlogPost } from '../api/content';
import BackButton from '../components/BackButton';

export default function Blog() {
  const { slug } = useParams();
  const [language, setLanguage] = useState('en');
  const { data: posts, isLoading } = useBlogPosts({ language });
  const { data: post } = useBlogPost(slug);

  if (slug && post) {
    return (
      <div className="px-4 sm:px-6 lg:px-10 py-10 sm:py-14 max-w-2xl">
        <BackButton />
        <div className="text-[10px] text-vermilion font-semibold">
          {new Date(post.publishedAt).toLocaleDateString('en-IN', {
            month: 'long',
            day: 'numeric',
            year: 'numeric',
          })}
        </div>
        <h1 className="font-display font-semibold text-2xl text-indigo mt-2 mb-4">{post.title}</h1>
        <div
          className="prose prose-sm text-indigo/80 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: post.contentHtml }}
        />
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-10 py-10 sm:py-14 flex gap-9 flex-wrap">
      <div className="flex-[2] min-w-[280px]">
        <span className="text-[10.5px] tracking-widest uppercase text-vermilion font-semibold block mb-2">
          Reading Room
        </span>
        <h1 className="font-display font-semibold text-2xl text-indigo mb-1">Blog</h1>
        <div className="h-[3px] w-14 bg-marigold rounded mb-5" />

        {isLoading ? (
          <p className="text-sm text-indigo/60">Loading articles…</p>
        ) : !posts?.length ? (
          <p className="text-sm text-indigo/60">No articles published yet.</p>
        ) : (
          posts.map((p) => (
            <Link
              key={p._id}
              to={`/blog/${p.slug}`}
              className="flex gap-4 py-4 border-b border-indigo/10 last:border-0"
            >
              <div className="w-28 h-20 rounded bg-gradient-to-br from-indigo to-indigo-deep flex-shrink-0" />
              <div>
                <div className="text-[10px] text-vermilion font-semibold">
                  {p.tags?.[0]?.toUpperCase() || 'BHAKTI'}
                </div>
                <div className="font-display font-semibold text-sm text-indigo my-1">{p.title}</div>
              </div>
            </Link>
          ))
        )}
      </div>

      <div className="flex-1 min-w-[180px]">
        <div className="bg-ivory-dim/75 rounded-lg p-5">
          <div className="font-display font-semibold text-[13px] text-indigo mb-3">Language</div>
          <div className="flex gap-2">
            {[
              ['en', 'English'],
              ['hi', 'हिन्दी'],
            ].map(([code, label]) => (
              <button
                key={code}
                onClick={() => setLanguage(code)}
                className={`text-[11px] px-3.5 py-1.5 rounded-full ${
                  language === code ? 'bg-indigo text-ivory' : 'border border-indigo/15 text-indigo'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
