'use server'

export async function saveLink(collector: string, link: string) {
  try {
    const response = await fetch(`/api/collections/${collector}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: link })
    })

    if (!response.ok) throw new Error('Failed to save link')
    return { success: true, message: 'Link saved successfully' }
  } catch (error) {
    console.error('Error saving link:', error)
    throw error
  }
}

export async function createCollection(name: string) {
  try {
    const response = await fetch('/api/collections', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name })
    })

    if (!response.ok) throw new Error('Failed to create collection')
    return { success: true, message: 'Collection created successfully' }
  } catch (error) {
    console.error('Error creating collection:', error)
    throw error
  }
}