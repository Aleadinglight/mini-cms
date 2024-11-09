import { NextResponse } from 'next/server'
import { readData, writeData } from '@/utils/store'

export async function GET(
  request: Request,
  { params }: { params: { name: string } }
) {
  const data = await readData()
  const collection = data.collections.find(c => c.name === params.name)

  if (!collection) {
    return NextResponse.json({ error: 'Collection not found' }, { status: 404 })
  }

  return NextResponse.json(collection)
}

export async function POST(
  request: Request,
  { params }: { params: { name: string } }
) {
  try {
    const { url } = await request.json()
    const data = await readData()
    const collectionIndex = data.collections.findIndex(c => c.name === params.name)

    if (collectionIndex === -1) {
      return NextResponse.json({ error: 'Collection not found' }, { status: 404 })
    }

    const collection = data.collections[collectionIndex]

    // Check if the link already exists in the collection
    const linkExists = collection.items.some(item => item.url === url)
    if (linkExists) {
      return NextResponse.json({ error: 'Link already exists in the collection' }, { status: 403 })
    }

    const newItem = { url }
    collection.items.push(newItem)
    await writeData(data)

    return NextResponse.json({ message: 'Link saved successfully' }, { status: 200 })
  } catch (error) {
    console.error('Error saving link:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { name: string } }
) {
  const data = await readData()
  data.collections = data.collections.filter(c => c.name !== params.name)
  await writeData(data)

  return NextResponse.json({ success: true })
}