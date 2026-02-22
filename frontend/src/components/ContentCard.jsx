import React from 'react'
import { ExternalLink, Archive, Copy } from 'lucide-react'
import { formatDate, truncate, getPlatformIcon, getCategoryColor } from '../utils/helpers'

export function ContentCard({ content, onArchive, onOpenLink }) {
  const [copied, setCopied] = React.useState(false)

  const handleCopyLink = () => {
    navigator.clipboard.writeText(content.original_url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition hover:scale-105 transform duration-300">
      {/* Thumbnail */}
      {content.thumbnail_url && (
        <div className="h-40 bg-gray-200 overflow-hidden">
          <img
            src={content.thumbnail_url}
            alt={content.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.style.display = 'none'
            }}
          />
        </div>
      )}

      {/* Content Body */}
      <div className="p-5">
        {/* Platform Badge */}
        <div className="flex items-center gap-2 mb-3">
          <span className="text-2xl">{getPlatformIcon(content.platform)}</span>
          <span className="text-xs font-semibold text-gray-500 uppercase">
            {content.platform}
          </span>
          <span className="ml-auto text-xs text-gray-400">{formatDate(content.created_at)}</span>
        </div>

        {/* Title */}
        {content.title && (
          <h3 className="font-bold text-gray-900 text-lg mb-2 line-clamp-2">
            {content.title}
          </h3>
        )}

        {/* Summary */}
        {content.summary && (
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
            {content.summary}
          </p>
        )}

        {/* Category Badge */}
        {content.category && (
          <div className="mb-3">
            <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getCategoryColor(content.category)}`}>
              {content.category}
            </span>
          </div>
        )}

        {/* Caption */}
        {content.caption && (
          <p className="text-gray-500 text-xs mb-3 line-clamp-1 italic">
            {truncate(content.caption, 100)}
          </p>
        )}

        {/* Hashtags */}
        {content.hashtags && (
          <div className="mb-4">
            <div className="flex flex-wrap gap-1">
              {content.hashtags.split(',').slice(0, 3).map((tag, idx) => (
                <span key={idx} className="text-xs text-primary-600 font-semibold">
                  {tag.trim()}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2 pt-3 border-t border-gray-100">
          <button
            onClick={() => onOpenLink(content.original_url)}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm font-semibold text-primary-600 hover:bg-primary-50 rounded-lg transition"
          >
            <ExternalLink size={16} />
            Open
          </button>
          <button
            onClick={handleCopyLink}
            className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm font-semibold rounded-lg transition ${
              copied
                ? 'bg-green-50 text-green-600'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Copy size={16} />
            {copied ? 'Copied' : 'Copy'}
          </button>
          <button
            onClick={() => onArchive(content.id)}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm font-semibold text-gray-600 hover:bg-red-50 hover:text-red-600 rounded-lg transition"
          >
            <Archive size={16} />
            Archive
          </button>
        </div>
      </div>
    </div>
  )
}

export function ContentGrid({ contents, onArchive, onOpenLink, isLoading }) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-white rounded-xl shadow-lg animate-pulse h-96" />
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {contents.map((content) => (
        <ContentCard
          key={content.id}
          content={content}
          onArchive={onArchive}
          onOpenLink={onOpenLink}
        />
      ))}
    </div>
  )
}
