'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Clipboard } from "lucide-react"
import { saveLink, createCollection } from './actions'
import { useToast } from "@/hooks/use-toast"

interface Collection {
  name: string
  items: { url: string }[]
}

export default function LinkCollection() {
  const [collections, setCollections] = useState<string[]>([])
  const [selectedCollection, setSelectedCollection] = useState('')
  const [link, setLink] = useState('')
  const [isNewCollectionModalOpen, setIsNewCollectionModalOpen] = useState(false)
  const [newCollectionName, setNewCollectionName] = useState('')
  const [isPasteSupported, setIsPasteSupported] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const router = useRouter()

  useEffect(() => {
    setIsPasteSupported(navigator.clipboard && typeof navigator.clipboard.readText === 'function')

    async function loadCollections() {
      const response = await fetch('/api/collections')
      const data: Collection[] = await response.json()
      setCollections(data.map((c: Collection) => c.name))
    }
    loadCollections()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedCollection) {
      toast({
        title: "Error",
        description: "Please select a collection.",
        variant: "destructive",
      })
      return
    }
    if (!link) {
      toast({
        title: "Error",
        description: "Please enter a link.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)
    try {
      await saveLink(selectedCollection, link)
      setLink('')
      setSelectedCollection('')
      toast({
        title: "Success",
        description: "Link saved successfully!",
      })
      router.refresh()
    } catch (error) {
      console.error('Failed to save link:', error)
      toast({
        title: "Error",
        description: "Failed to save link. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleNewCollection = async () => {
    if (newCollectionName) {
      try {
        await createCollection(newCollectionName)
        setCollections([...collections, newCollectionName])
        setSelectedCollection(newCollectionName)
        setNewCollectionName('')
        setIsNewCollectionModalOpen(false)
        toast({
          title: "Success",
          description: "Collection created successfully!",
        })
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to create collection.",
          variant: "destructive",
        })
      }
    }
  }

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText()
      setLink(text)
    } catch (err) {
      console.error('Failed to read clipboard contents: ', err)
      toast({
        title: "Error",
        description: "Failed to paste from clipboard. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md bg-background rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold mb-6 text-center">Save Link to Collection</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="collection">Choose Collection</Label>
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
              <Select value={selectedCollection} onValueChange={setSelectedCollection}>
                <SelectTrigger id="collection" className="flex-grow">
                  <SelectValue placeholder="Select a collection" />
                </SelectTrigger>
                <SelectContent>
                  {collections.map((collection) => (
                    <SelectItem key={collection} value={collection}>
                      {collection}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button type="button" onClick={() => setIsNewCollectionModalOpen(true)} className="w-full sm:w-auto">
                New
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="link">Link</Label>
            <div className="flex space-x-2">
              <Input
                id="link"
                type="url"
                placeholder="Paste your link here"
                value={link}
                onChange={(e) => setLink(e.target.value)}
                required
                className="flex-grow"
              />
              {isPasteSupported && (
                <Button
                  type="button"
                  onClick={handlePaste}
                  aria-label="Paste from clipboard"
                >
                  <Clipboard className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : 'Save Link'}
          </Button>
        </form>
      </div>

      {isNewCollectionModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-background p-6 rounded-lg w-full max-w-sm">
            <h2 className="text-xl font-bold mb-4">Create New Collection</h2>
            <Input
              type="text"
              placeholder="New collection name"
              value={newCollectionName}
              onChange={(e) => setNewCollectionName(e.target.value)}
              className="mb-4"
            />
            <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-2">
              <Button onClick={() => setIsNewCollectionModalOpen(false)} variant="outline" className="w-full sm:w-auto">
                Cancel
              </Button>
              <Button onClick={handleNewCollection} className="w-full sm:w-auto">Create</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}