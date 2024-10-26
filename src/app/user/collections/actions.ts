'use server'

export async function saveLink(collector: string, link: string) {
  // Here you would typically save the link to your database
  // For this example, we'll just log the data
  console.log(`Saving link "${link}" to collector "${collector}"`)

  // Simulate a delay
  await new Promise(resolve => setTimeout(resolve, 1000))

  // Return a success message
  return { success: true, message: 'Link saved successfully' }
}