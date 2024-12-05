export type RootStackParamList = {
  Home: undefined;
  Topic: { topicId: number; topicTitle: string };
  Quiz: { levelId: number; topicId: number; levelTitle: string; topicTitle: string };
};