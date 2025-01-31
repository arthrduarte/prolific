'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Topic, Course } from '../types/database.types';
import { supabase } from '../lib/supabase';

interface DataContextType {
  topics: Topic[];
  courses: Course[];
  isLoading: boolean;
  userName: string;
}

const DataContext = createContext<DataContextType>({
  topics: [],
  courses: [],
  isLoading: true,
  userName: '',
});

export const useData = () => useContext(DataContext);

interface DataProviderProps {
  children: ReactNode;
}

export const DataProvider: React.FC<DataProviderProps> = ({ children }) => {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch user data
        const { data: { user } } = await supabase.auth.getUser();
        if (user?.user_metadata?.full_name) {
          setUserName(user.user_metadata.full_name);
        }

        // Fetch topics and courses
        const [topicsResponse, coursesResponse] = await Promise.all([
          supabase.from('topics').select('*'),
          supabase.from('courses').select('*')
        ]);

        if (topicsResponse.error) throw topicsResponse.error;
        if (coursesResponse.error) throw coursesResponse.error;

        setTopics(topicsResponse.data);
        setCourses(coursesResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <DataContext.Provider value={{ topics, courses, isLoading, userName }}>
      {children}
    </DataContext.Provider>
  );
}; 