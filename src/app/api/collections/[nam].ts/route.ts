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
  const { url } = await request.json()
  const data = await readData()
  const collectionIndex = data.collections.findIndex(c => c.name === params.name)

  if (collectionIndex === -1) {
    return NextResponse.json({ error: 'Collection not found' }, { status: 404 })
  }

  const newItem = { url }
  data.collections[collectionIndex].items.push(newItem)
  await writeData(data)

  return NextResponse.json(newItem)
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