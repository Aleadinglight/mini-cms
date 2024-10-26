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
import { saveLink } from './actions'
import { useToast } from "@/hooks/use-toast"

export default function LinkCollector() {
  const [collectors, setCollectors] = useState(['Work', 'Personal', 'Shopping'])
  const [selectedCollector, setSelectedCollector] = useState('')
  const [link, setLink] = useState('')
  const [isNewCollectorModalOpen, setIsNewCollectorModalOpen] = useState(false)
  const [newCollectorName, setNewCollectorName] = useState('')
  const [isPasteSupported, setIsPasteSupported] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const router = useRouter()

  useEffect(() => {
    setIsPasteSupported(navigator.clipboard && typeof navigator.clipboard.readText === 'function')
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedCollector || !link) {
      toast({
        title: "Error",
        description: "Please select a collector and enter a link.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)
    try {
      await saveLink(selectedCollector, link)
      setLink('')
      setSelectedCollector('')
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

  const handleNewCollector = () => {
    if (newCollectorName) {
      setCollectors([...collectors, newCollectorName])
      setSelectedCollector(newCollectorName)
      setNewCollectorName('')
      setIsNewCollectorModalOpen(false)
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
        <h1 className="text-2xl font-bold mb-6 text-center">Save Link to Collector</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="collector">Choose Collector</Label>
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
              <Select value={selectedCollector} onValueChange={setSelectedCollector}>
                <SelectTrigger id="collector" className="flex-grow">
                  <SelectValue placeholder="Select a collector" />
                </SelectTrigger>
                <SelectContent>
                  {collectors.map((collector) => (
                    <SelectItem key={collector} value={collector}>
                      {collector}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button type="button" onClick={() => setIsNewCollectorModalOpen(true)} className="w-full sm:w-auto">
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

      {isNewCollectorModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-background p-6 rounded-lg w-full max-w-sm">
            <h2 className="text-xl font-bold mb-4">Create New Collector</h2>
            <Input
              type="text"
              placeholder="New collector name"
              value={newCollectorName}
              onChange={(e) => setNewCollectorName(e.target.value)}
              className="mb-4"
            />
            <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-2">
              <Button onClick={() => setIsNewCollectorModalOpen(false)} variant="outline" className="w-full sm:w-auto">
                Cancel
              </Button>
              <Button onClick={handleNewCollector} className="w-full sm:w-auto">Create</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}