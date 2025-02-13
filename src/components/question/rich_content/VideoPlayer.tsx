import { useEvent } from 'expo';
import { useVideoPlayer, VideoView } from 'expo-video'
import { View, Button, StyleSheet, Dimensions } from 'react-native';

const videoSource =
  'https://hqxndbfvgznviymezjta.supabase.co/storage/v1/object/public/video//yellow_coat_lady.mp4';

export default function VideoScreen({videoUrl}: {videoUrl: string}) {
  const player = useVideoPlayer(videoUrl, player => {
    player.loop = true;
    player.play();
  });

  const { isPlaying } = useEvent(player, 'playingChange', { isPlaying: player.playing });

  return (
    <View style={styles.contentContainer}>
      <VideoView style={styles.video} player={player} allowsFullscreen allowsPictureInPicture />
    </View>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 50,
  },
  video: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  controlsContainer: {
    padding: 10,
  },
});
