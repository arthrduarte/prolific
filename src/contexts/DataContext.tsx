import React, { createContext, useContext, useEffect, useState } from 'react';
import { Topic, Course } from '../types/database.types';
import { supabase } from '../lib/supabase';

interface DataContextType {
  topics: Topic[];
  courses: Course[];
  isLoading: boolean;
  lastFetched: number | null;
}

const DataContext = createContext<DataContextType>({
  topics: [],
  courses: [],
  isLoading: true,
  lastFetched: null,
});

export const useData = () => useContext(DataContext);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastFetched, setLastFetched] = useState<number | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      // Check if we need to fetch new data (24 hours cache)
      const now = Date.now();
      if (lastFetched && now - lastFetched < 24 * 60 * 60 * 1000) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);

      // Fetch all topics
      const { data: topicsData } = await supabase
        .from('topics')
        .select('*');

      if (topicsData) {
        setTopics(topicsData);
      }

      // Fetch all courses
      const { data: coursesData } = await supabase
        .from('courses')
        .select('*');

      if (coursesData) {
        setCourses(coursesData);
      }

      setLastFetched(now);
      setIsLoading(false);
    };

    fetchData();
  }, [lastFetched]);

  return (
    <DataContext.Provider value={{ topics, courses, isLoading, lastFetched }}>
      {children}
    </DataContext.Provider>
  );
}; 