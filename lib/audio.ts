import { Audio } from 'expo-av';
import * as Speech from 'expo-speech';

let currentSound: Audio.Sound | null = null;

export async function playSound(soundFile: any): Promise<void> {
  try {
    if (currentSound) {
      await currentSound.unloadAsync();
      currentSound = null;
    }

    const { sound } = await Audio.Sound.createAsync(soundFile);
    currentSound = sound;
    await sound.playAsync();

    sound.setOnPlaybackStatusUpdate((status) => {
      if (status.isLoaded && status.didJustFinish) {
        sound.unloadAsync();
        if (currentSound === sound) {
          currentSound = null;
        }
      }
    });
  } catch (error) {
    console.error('Failed to play sound:', error);
  }
}

export async function stopSound(): Promise<void> {
  if (currentSound) {
    await currentSound.unloadAsync();
    currentSound = null;
  }
  Speech.stop();
}

/**
 * Speak text in friendly Indonesian voice for toddlers
 */
export function speakText(text: string): void {
  try {
    Speech.stop();
    // Clean emojis for speech output
    const cleanText = text.replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '');
    Speech.speak(cleanText, {
      language: 'id-ID',
      pitch: 1.1,
      rate: 0.9,
    });
  } catch (error) {
    console.error('Failed to speak text:', error);
  }
}
