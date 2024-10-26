import { promises as fs } from 'fs'
import path from 'path'

const DATA_FILE = path.join(process.cwd(), 'data', 'collections.json')

export interface DataStore {
  collections: {
    name: string
    items: { url: string }[]
  }[]
}

export async function readData(): Promise<DataStore> {
  try {
    const data = await fs.readFile(DATA_FILE, 'utf8')
    return JSON.parse(data)
  } catch (error) {
    return { collections: [] }
  }
}

export async function writeData(data: DataStore): Promise<void> {
  await fs.mkdir(path.dirname(DATA_FILE), { recursive: true })
  await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2))
}