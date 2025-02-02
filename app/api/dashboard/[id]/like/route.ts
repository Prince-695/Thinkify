import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const filePath = path.join(process.cwd(), 'storage', 'data.json');
    const fileContents = await fs.readFile(filePath, 'utf8');
    const data = JSON.parse(fileContents);
    
    // Find and update the item
    const updatedData = data.map((item: any) => {
      if (item.id === params.id) {
        return { ...item, likes: (item.likes || 0) + 1 };
      }
      return item;
    });
    
    // Write back to file
    await fs.writeFile(filePath, JSON.stringify(updatedData, null, 2));
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update likes' },
      { status: 500 }
    );
  }
}