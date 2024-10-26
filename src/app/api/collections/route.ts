import { NextResponse } from 'next/server'
import { readData, writeData } from '@/utils/store'

export async function GET() {
  const data = await readData()
  return NextResponse.json(data.collections)
}

export async function POST(request: Request) {
  const { name } = await request.json()
  const data = await readData()

  const newCollection = {
    name,
    items: []
  }

  data.collections.push(newCollection)
  await writeData(data)

  return NextResponse.json(newCollection)
}