import React, { useEffect } from 'react';
import { View, StyleSheet, Animated, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export const SkeletonLoading: React.FC = () => {
  const shimmerValue = new Animated.Value(0);

  useEffect(() => {
    const startShimmerAnimation = () => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(shimmerValue, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(shimmerValue, {
            toValue: 0,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    };

    startShimmerAnimation();
  }, []);

  const getAnimatedStyle = () => ({
    opacity: shimmerValue.interpolate({
      inputRange: [0, 1],
      outputRange: [0.3, 0.7],
    }),
  });

  return (
    <View style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <View style={styles.progressContainer}>
          <Animated.View 
            style={[
              styles.progressBar,
              getAnimatedStyle(),
            ]} 
          />
        </View>
        <Animated.View 
          style={[
            styles.titleSkeleton,
            getAnimatedStyle(),
          ]} 
        />
      </View>

      {/* Content Section */}
      <View style={styles.content}>
        {/* Question Text Skeletons */}
        <View style={styles.questionContainer}>
          <Animated.View 
            style={[
              styles.textLine,
              { width: '90%' },
              getAnimatedStyle(),
            ]} 
          />
          <Animated.View 
            style={[
              styles.textLine,
              { width: '75%' },
              getAnimatedStyle(),
            ]} 
          />
          <Animated.View 
            style={[
              styles.textLine,
              { width: '85%' },
              getAnimatedStyle(),
            ]} 
          />
        </View>

        {/* Options Container */}
        <View style={styles.optionsContainer}>
          {[1, 2, 3, 4].map((_, index) => (
            <Animated.View 
              key={index}
              style={[
                styles.optionSkeleton,
                getAnimatedStyle(),
              ]} 
            />
          ))}
        </View>

        {/* Submit Button */}
        <Animated.View 
          style={[
            styles.buttonSkeleton,
            getAnimatedStyle(),
          ]} 
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    paddingTop: 16,
    paddingHorizontal: 24,
    paddingBottom: 24,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f3f5',
  },
  progressContainer: {
    height: 4,
    backgroundColor: '#f1f3f5',
    borderRadius: 2,
    marginBottom: 16,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    width: '30%',
    backgroundColor: '#e9ecef',
    borderRadius: 2,
  },
  titleSkeleton: {
    height: 32,
    backgroundColor: '#e9ecef',
    borderRadius: 8,
    width: '60%',
  },
  content: {
    flex: 1,
    padding: 24,
  },
  questionContainer: {
    marginBottom: 32,
  },
  textLine: {
    height: 16,
    backgroundColor: '#e9ecef',
    borderRadius: 4,
    marginBottom: 12,
  },
  optionsContainer: {
    gap: 12,
    marginBottom: 32,
  },
  optionSkeleton: {
    height: 56,
    backgroundColor: '#e9ecef',
    borderRadius: 12,
    width: '100%',
  },
  buttonSkeleton: {
    height: 56,
    backgroundColor: '#e9ecef',
    borderRadius: 12,
    width: '100%',
    marginTop: 'auto',
  },
}); 