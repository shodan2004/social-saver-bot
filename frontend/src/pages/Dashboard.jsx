import React, { useState, useEffect, useCallback } from 'react'
import { SearchBar, FilterBar, EmptyState } from '../components/SearchBar'
import { ContentGrid as ContentGridComponent } from '../components/ContentCard'
import { SetupGuide } from '../components/SetupGuide'
import { contentAPI } from '../utils/api'
import { getUserIdFromStorage, setUserIdInStorage } from '../utils/helpers'

export function DashboardPage() {
  const [userId, setUserId] = useState(getUserIdFromStorage())
  const [contents, setContents] = useState([])
  const [filteredContents, setFilteredContents] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [selectedPlatform, setSelectedPlatform] = useState(null)
  const [categories, setCategories] = useState([])
  const [platforms, setPlatforms] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [showSetup, setShowSetup] = useState(true)

  // Fetch content
  const fetchContent = useCallback(async () => {
    setIsLoading(true)
    try {
      let activeUserId = userId
      let response = await contentAPI.getUserContent(activeUserId, 0, 100)
      let data = response.data || []

      // If this browser has a random user_id with no data, auto-switch to a real one.
      if (data.length === 0) {
        const usersRes = await contentAPI.getUsers()
        const users = usersRes.data || []
        if (users.length > 0 && users[0] !== activeUserId) {
          activeUserId = users[0]
          setUserId(activeUserId)
          setUserIdInStorage(activeUserId)
          response = await contentAPI.getUserContent(activeUserId, 0, 100)
          data = response.data || []
        }
      }

      setContents(data)
      setFilteredContents(data)

      // Fetch filters
      if (data.length > 0) {
        const [catsRes, platRes] = await Promise.all([
          contentAPI.getCategories(activeUserId),
          contentAPI.getPlatforms(activeUserId),
        ])
        setCategories(catsRes.data || [])
        setPlatforms(platRes.data || [])
      }
    } catch (error) {
      console.error('Error fetching content:', error)
    } finally {
      setIsLoading(false)
    }
  }, [userId])

  useEffect(() => {
    fetchContent()
  }, [fetchContent])

  // Handle search
  const handleSearch = useCallback(async () => {
    if (!searchQuery.trim()) {
      setFilteredContents(contents)
      return
    }

    setIsLoading(true)
    try {
      const response = await contentAPI.searchContent(
        userId,
        searchQuery,
        selectedCategory,
        selectedPlatform
      )
      setFilteredContents(response.data || [])
    } catch (error) {
      console.error('Error searching:', error)
    } finally {
      setIsLoading(false)
    }
  }, [userId, searchQuery, selectedCategory, selectedPlatform, contents])

  // Handle clear
  const handleClear = () => {
    setSearchQuery('')
    setSelectedCategory(null)
    setSelectedPlatform(null)
    setFilteredContents(contents)
  }

  // Handle archive
  const handleArchive = async (id) => {
    try {
      await contentAPI.deleteContent(userId, id)
      setContents(contents.filter((c) => c.id !== id))
      setFilteredContents(filteredContents.filter((c) => c.id !== id))
    } catch (error) {
      console.error('Error archiving:', error)
    }
  }

  // Handle open link
  const handleOpenLink = (url) => {
    window.open(url, '_blank')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <main className="max-w-7xl mx-auto px-4 py-12">
        {/* Setup Guide */}
        {showSetup && contents.length === 0 && (
          <div className="mb-8">
            <SetupGuide userId={userId} />
            <button
              onClick={() => setShowSetup(false)}
              className="text-sm text-gray-500 hover:text-gray-700 underline"
            >
              Hide setup guide
            </button>
          </div>
        )}

        {/* Search */}
        <div className="mb-8">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            onSearch={handleSearch}
            onClear={handleClear}
            isLoading={isLoading}
          />
        </div>

        {/* Filters */}
        {(categories.length > 0 || platforms.length > 0) && (
          <div className="mb-8">
            <FilterBar
              categories={categories}
              platforms={platforms}
              selectedCategory={selectedCategory}
              selectedPlatform={selectedPlatform}
              onCategoryChange={setSelectedCategory}
              onPlatformChange={setSelectedPlatform}
            />
          </div>
        )}

        {/* Content Grid */}
        {filteredContents.length > 0 ? (
          <ContentGridComponent
            contents={filteredContents}
            onArchive={handleArchive}
            onOpenLink={handleOpenLink}
            isLoading={isLoading}
          />
        ) : (
          <EmptyState message="Forward links from Instagram, Twitter, or blogs to your WhatsApp bot to get started!" />
        )}
      </main>
    </div>
  )
}
