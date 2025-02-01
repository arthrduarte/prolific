'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Topic, Course } from '../types/database.types';
import { supabase } from '../utils/supabase/client';

interface DataContextType {
  topics: Topic[];
  courses: Course[];
  isLoading: boolean;
  lastFetched: number | null;
  error: string | null;
}

const DataContext = createContext<DataContextType>({
  topics: [],
  courses: [],
  isLoading: true,
  lastFetched: null,
  error: null,
});

interface DataProviderProps {
  children: ReactNode;
}

export const useData = () => useContext(DataContext);

export const DataProvider: React.FC<DataProviderProps> = ({ children }) => {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastFetched, setLastFetched] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Check if we need to fetch new data (24 hours cache)
        const now = Date.now();
        if (lastFetched && now - lastFetched < 24 * 60 * 60 * 1000) {
          setIsLoading(false);
          return;
        }

        setIsLoading(true);
        setError(null);

        // Fetch all topics
        const { data: topicsData, error: topicsError } = await supabase
          .from('topics')
          .select('*');

        if (topicsError) {
          throw new Error(`Failed to fetch topics: ${topicsError.message}`);
        }

        if (topicsData) {
          setTopics(topicsData);
        }

        // Fetch all courses
        const { data: coursesData, error: coursesError } = await supabase
          .from('courses')
          .select('*');

        if (coursesError) {
          throw new Error(`Failed to fetch courses: ${coursesError.message}`);
        }

        if (coursesData) {
          setCourses(coursesData);
        }

        setLastFetched(now);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
        console.error('Error fetching data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [lastFetched]);

  return (
    <DataContext.Provider value={{ topics, courses, isLoading, lastFetched, error }}>
      {children}
    </DataContext.Provider>
  );
}; 