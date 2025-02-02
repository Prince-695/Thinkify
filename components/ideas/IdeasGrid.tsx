'use client';

import React, { useState, useEffect } from 'react';
import { Plus, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { IdeaChat } from '@/components/chat/IdeaChat';
import { IoMdClose as X } from "react-icons/io";
import { ideaStorage } from '@/storage/index';

interface Idea {
  id: string;
  userInput: string;
  aiOutput: string;
  likes: number;
}

export function IdeasGrid() {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [isAddingIdea, setIsAddingIdea] = useState(false);
  const [selectedIdea, setSelectedIdea] = useState<Idea | null>(null);

  useEffect(() => {
    async function fetchIdeas() {
      const storedIdeas = await ideaStorage.getAllIdeas();
      setIdeas(storedIdeas);
    }
    fetchIdeas();
  }, []);

  const handleIdeaComplete = async (newIdea: { userInput: string; aiOutput: string }) => {
    const idea: Idea = await ideaStorage.addIdea(newIdea);
    setIdeas([idea, ...ideas]);
    setIsAddingIdea(false);
  };

  return (
    <div>
      <div className="flex justify-end mb-6">
        <Button
          onClick={() => setIsAddingIdea(true)}
          className="bg-purple-600 text-white hover:bg-purple-700"
        >
          <Plus className="h-5 w-5 mr-2" />
          New Idea
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <motion.div
          className="relative h-64 rounded-xl border-2 border-dashed border-gray-300 hover:border-purple-400 transition-colors cursor-pointer bg-gray-50 hover:bg-gray-100"
          onClick={() => setIsAddingIdea(true)}
          whileHover={{ scale: 1.02 }}
        >
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <Plus className="h-12 w-12 text-gray-400" />
            <p className="mt-2 text-sm text-gray-500">Add New Idea</p>
          </div>
        </motion.div>

        {ideas.map((idea) => (
          <motion.div
            key={idea.id}
            className="relative h-64 rounded-xl border border-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow cursor-pointer p-6"
            onClick={() => setSelectedIdea(idea)}
            whileHover={{ scale: 1.02 }}
          >
            <div className="h-full flex flex-col">
              <h3 className="text-xl font-semibold mb-2 line-clamp-2">{idea.userInput}</h3>
              <p className="text-gray-600 text-sm mb-4 line-clamp-3">{idea.aiOutput}</p>
              <div className="mt-auto">
                <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                  {idea.likes} Likes
                </span>
              </div>
              <ChevronRight className="absolute bottom-4 right-4 h-5 w-5 text-gray-400" />
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {isAddingIdea && (
          <IdeaChat
            onComplete={handleIdeaComplete}
            onClose={() => setIsAddingIdea(false)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
      {selectedIdea && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
        >
          <div className="bg-white rounded-xl w-full max-w-2xl h-[80vh] flex flex-col shadow-lg">
            <div className="p-4 border-b flex justify-between items-center">
              <h2 className="text-xl font-semibold">Idea Details</h2>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setSelectedIdea(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              <div>
                <h3 className="font-semibold mb-2">User Input:</h3>
                <p className="bg-gray-50 p-4 rounded-lg whitespace-pre-wrap">{selectedIdea.userInput}</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">AI Output:</h3>
                <p className="bg-gray-50 p-4 rounded-lg whitespace-pre-wrap">{selectedIdea.aiOutput}</p>
              </div>
            </div>
          </div>
        </motion.div>
      )}
      </AnimatePresence>
    </div>
  );
}
