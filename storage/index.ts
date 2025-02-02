// storage/index.ts

// Define or import the Idea and IdeaInput types
interface Idea {
    id: string;
    userInput: string;
    aiOutput: string;
    likes: number;
  }
  
  interface IdeaInput {
    userInput: string;
    aiOutput: string;
  }
  
  class IdeaStorage {
    // Get all ideas from storage
    async getAllIdeas(): Promise<Idea[]> {
      const response = await fetch('/api/ideas');
      if (!response.ok) throw new Error('Failed to fetch ideas');
      return response.json();
    }
  
    // Add new idea
    async addIdea(ideaInput: IdeaInput): Promise<Idea> {
      const response = await fetch('/api/ideas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(ideaInput),
      });
      
      if (!response.ok) throw new Error('Failed to save idea');
      return response.json();
    }
  
    // Like an idea
    async likeIdea(ideaId: string): Promise<boolean> {
      const response = await fetch('/api/ideas', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: ideaId }),
      });
      
      return response.ok;
    }
  
    // Get leaderboard (sorted by likes)
    async getLeaderboard(): Promise<Idea[]> {
      const ideas = await this.getAllIdeas();
      return ideas.sort((a, b) => b.likes - a.likes);
    }
  
    // Search ideas
    async searchIdeas(query: string): Promise<Idea[]> {
      const ideas = await this.getAllIdeas();
      const lowercaseQuery = query.toLowerCase();
      
      return ideas.filter(idea => 
        idea.userInput.toLowerCase().includes(lowercaseQuery) ||
        idea.aiOutput.toLowerCase().includes(lowercaseQuery)
      );
    }
  }
  
  export const ideaStorage = new IdeaStorage();