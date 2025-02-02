// app/api/ideas/route.ts
import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const DATA_FILE_PATH = path.join(process.cwd(), 'storage', 'data.json');

// Ensure the storage directory exists
const ensureDirectoryExists = () => {
  const dir = path.join(process.cwd(), 'storage');
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }
};

// Ensure data.json exists with initial empty array
const ensureFileExists = () => {
  if (!fs.existsSync(DATA_FILE_PATH)) {
    fs.writeFileSync(DATA_FILE_PATH, JSON.stringify([], null, 2));
  }
};

// Initialize storage
ensureDirectoryExists();
ensureFileExists();

export async function GET() {
  try {
    const data = fs.readFileSync(DATA_FILE_PATH, 'utf-8');
    return NextResponse.json(JSON.parse(data));
  } catch (error) {
    return NextResponse.json({ error: 'Failed to read ideas' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const data = fs.readFileSync(DATA_FILE_PATH, 'utf-8');
    const ideas = JSON.parse(data);
    
    const newIdea = {
      id: crypto.randomUUID(),
      ...body,
      likes: 0,
      createdAt: new Date().toISOString()
    };
    
    ideas.push(newIdea);
    fs.writeFileSync(DATA_FILE_PATH, JSON.stringify(ideas, null, 2));
    
    return NextResponse.json(newIdea);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to save idea' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const { id } = await request.json();
    const data = fs.readFileSync(DATA_FILE_PATH, 'utf-8');
    const ideas = JSON.parse(data);
    
    const ideaIndex = ideas.findIndex((idea: any) => idea.id === id);
    if (ideaIndex === -1) {
      return NextResponse.json({ error: 'Idea not found' }, { status: 404 });
    }
    
    ideas[ideaIndex].likes += 1;
    fs.writeFileSync(DATA_FILE_PATH, JSON.stringify(ideas, null, 2));
    
    return NextResponse.json(ideas[ideaIndex]);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update likes' }, { status: 500 });
  }
}