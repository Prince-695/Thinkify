'use client';

import React, { useEffect, useState } from 'react';
import { TrendingUp, ThumbsUp, MessageSquare, Award } from 'lucide-react';
import { motion } from 'framer-motion';
import { ideaStorage } from '@/storage/index';

interface Idea {
  id: string;
  title: string;
  description: string;
  author: {
    name: string;
    avatar: string;
  };
  likes: number;
  comments: number;
  category: string;
  trending_score: number;
}

export function TrendingIdeas() {
  const [trendingIdeas, setTrendingIdeas] = useState<Idea[]>([]);
  const avatars = [
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Alice',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Bob',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Charlie',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=David',
  ];

  useEffect(() => {
    const fetchTrendingIdeas = async () => {
      const storedIdeas = await ideaStorage.getAllIdeas();
      const formattedIdeas = storedIdeas.map((idea, index) => ({
        id: idea.id,
        title: idea.userInput,
        description: idea.aiOutput,
        author: {
          name: `User ${index + 1}`,
          avatar: avatars[index % avatars.length], // Rotate avatars
        },
        likes: idea.likes || Math.floor(Math.random() * 200),
        comments: Math.floor(Math.random() * 50),
        category: 'General',
        trending_score: Math.floor(Math.random() * 100),
      }));

      // Merge with mock trending ideas
      const allIdeas = [
        ...formattedIdeas,
        {
          id: '1',
          title: 'AI-Powered Smart City Infrastructure',
          description:
            'Using artificial intelligence to optimize city resources and improve citizen life quality.',
          author: {
            name: 'John Doe',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
          },
          likes: 156,
          comments: 32,
          category: 'Technology',
          trending_score: 98,
        },
        {
          id: '2',
          title: 'Sustainable Energy Grid',
          description:
            'A decentralized energy system that combines renewable sources with AI-driven optimization for maximum efficiency.',
          author: {
            name: 'Jane Smith',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jane',
          },
          likes: 142,
          comments: 28,
          category: 'Energy',
          trending_score: 92,
        },
      ];

      // Sort by trending score
      setTrendingIdeas(allIdeas.sort((a, b) => b.trending_score - a.trending_score));
    };

    fetchTrendingIdeas();
  }, []);

  return (
    <div className="p-6">
      <div className="flex items-center gap-2 mb-8">
        <TrendingUp className="h-8 w-8 text-purple-600" />
        <h1 className="text-3xl font-bold text-purple-600">Trending Ideas</h1>
      </div>

      <div className="space-y-6">
        {trendingIdeas.map((idea) => (
          <motion.div
            key={idea.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <img
                    src={idea.author.avatar}
                    alt={idea.author.name}
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <h3 className="text-lg font-semibold">{idea.title}</h3>
                    <p className="text-sm text-gray-600">by {idea.author.name}</p>
                  </div>
                </div>

                <p className="text-gray-600 mb-4">{idea.description}</p>

                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2 text-gray-500">
                    <ThumbsUp className="h-5 w-5" />
                    <span>{idea.likes}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-500">
                    <MessageSquare className="h-5 w-5" />
                    <span>{idea.comments}</span>
                  </div>
                  <span className="px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
                    {idea.category}
                  </span>
                </div>
              </div>

              <div className="flex flex-col items-center ml-6">
                <Award className="h-8 w-8 text-yellow-500 mb-1" />
                <span className="text-sm font-bold text-yellow-500">
                  #{idea.trending_score}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
