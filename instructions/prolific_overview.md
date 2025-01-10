# Prolific - Interactive Learning Platform

## Project Overview
Prolific is a React Native mobile application built with Expo, designed to provide interactive learning experiences through structured courses and exercises. The app features a modular learning path system with topics, courses, and exercises that incorporate multiple types of interactive content including text, audio, and various question formats.

## Technical Stack
- React Native with Expo
- TypeScript
- Supabase for backend and authentication
- React Navigation for routing
- Various React Native UI libraries (UI Lib, Elements)

## Core Features

### Authentication System
- Email-based authentication
- Session management
- Protected routes

### Learning Structure
1. Topics (Main categories)
2. Courses (Within topics)
3. Exercises (Within courses)
4. Steps (Individual learning units within exercises)

### Interactive Question Types
- Multiple Choice
- True/False
- Text Input
- Content-only steps (for information delivery)

### Audio Integration
- Voice mode support for questions and explanations
- Audio preloading system for smooth playback

### UI/UX Features
- Animated content transitions
- Progress tracking
- Interactive feedback system
- Responsive design
- Safe area handling for different devices


## Key Components

### Navigation
- Bottom tab navigation
- Stack navigation for learning flow
- Protected routes based on authentication state

### Question Component
- Complex component handling multiple question types
- Animated transitions
- Audio integration
- Rich content support (tables, etc.)
- Interactive feedback system

### Settings Management
- Voice mode toggle
- User preferences
- Authentication state

## State Management
- Context API for preferences
- Local state for component-level management
- AsyncStorage for persistent settings

## Styling Approach
- StyleSheet.create for component styles
- Consistent color scheme
- Typography system
- Responsive layouts

## Environment Configuration
- Dotenv support
- Supabase configuration
- TypeScript configuration

## Development Guidelines
1. Use functional components with hooks
2. Implement proper type checking
3. Follow consistent naming conventions
4. Optimize performance with proper hooks usage
5. Maintain modular component structure

## Future Considerations
1. Offline support
2. Enhanced progress tracking
3. Social features
4. Performance optimization
5. Additional question types
6. Expanded content management system