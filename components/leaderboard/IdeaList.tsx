'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ThumbsUp, MessageCircle, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { IdeaWithStats } from '@/lib/types';
import { ideaStorage } from '@/storage/index';

// Interface for the idea item, extending from your data structure
interface DataItem {
  id: string;
  likes: number;
}

export function IdeaList() {
  const [data, setData] = useState<DataItem[]>([]);
  const [ideas, setIdeas] = useState<IdeaWithStats[]>([]);

  // Fetch ideas on component mount
  useEffect(() => {
    const fetchIdeas = async () => {
      try {
        const ideasFromStorage = await ideaStorage.getAllIdeas();
        setIdeas(ideasFromStorage);
      } catch (error) {
        console.error('Error fetching ideas:', error);
      }
    };

    fetchIdeas();
  }, []);

  // Handle liking an idea
  const handleLike = async (id: string) => {
    try {
      const response = await fetch(`/api/dashboard/${id}/like`, {
        method: 'POST',
      });
      if (!response.ok) {
        throw new Error('Failed to update likes');
      }

      // Update the likes count in state
      setData((prevData) =>
        prevData.map((item) =>
          item.id === id ? { ...item, likes: item.likes + 1 } : item
        )
      );

      // Update the list of ideas as well
      const updatedIdeas = ideas.map((idea) =>
        idea.id === id ? { ...idea, likes: idea.likes + 1 } : idea
      );
      setIdeas(updatedIdeas);
    } catch (err) {
      console.error('Error updating likes:', err);
    }
  };

  return (
    <div className="space-y-6">
      {ideas.map((idea) => (
        <motion.div
          key={idea.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl p-6 shadow-sm"
        >
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                <User className="w-6 h-6 text-purple-600" />
              </div>
            </div>

            <div className="flex-1">
              <h3 className="text-xl font-semibold mb-2">{idea.title}</h3>
              <p className="text-gray-600 mb-4">{idea.description}</p>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleLike(idea.id);
                    }}
                    className="flex items-center gap-2"
                  >
                    <ThumbsUp className="h-4 w-4" />
                    <span>{idea.likes}</span>
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex items-center gap-2 text-gray-600"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>{idea.interactions}</span>
                  </Button>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                    {idea.category}
                  </span>
                  <span className="text-sm text-gray-500">
                    {new Date(idea.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
