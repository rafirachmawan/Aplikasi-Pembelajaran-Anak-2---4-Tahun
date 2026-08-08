import AsyncStorage from '@react-native-async-storage/async-storage';

const PROGRESS_KEY = 'anak_belajar_progress';

export interface LevelProgress {
  completed: boolean;
  score: number;
  totalQuestions: number;
  lastAttempt: string; // ISO date string
}

export interface ModuleProgress {
  [levelId: string]: LevelProgress;
}

export interface AppProgress {
  colors: ModuleProgress;
  numbers: ModuleProgress;
  letters: ModuleProgress;
  shapes: ModuleProgress;
  animals: ModuleProgress;
  fruits: ModuleProgress;
  bodyparts: ModuleProgress;
  vehicles: ModuleProgress;
  jobs: ModuleProgress;
}

const DEFAULT_PROGRESS: AppProgress = {
  colors: {},
  numbers: {},
  letters: {},
  shapes: {},
  animals: {},
  fruits: {},
  bodyparts: {},
  vehicles: {},
  jobs: {},
};

export async function getProgress(): Promise<AppProgress> {
  try {
    const data = await AsyncStorage.getItem(PROGRESS_KEY);
    return data ? JSON.parse(data) : DEFAULT_PROGRESS;
  } catch {
    return DEFAULT_PROGRESS;
  }
}

export async function saveProgress(progress: AppProgress): Promise<void> {
  try {
    await AsyncStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
  } catch (error) {
    console.error('Failed to save progress:', error);
  }
}

export async function saveLevelProgress(
  module: keyof AppProgress,
  levelId: string,
  score: number,
  totalQuestions: number
): Promise<void> {
  const progress = await getProgress();
  const existing = progress[module][levelId];

  // Only update if new score is better or level hasn't been attempted
  if (!existing || score > existing.score) {
    progress[module][levelId] = {
      completed: true,
      score,
      totalQuestions,
      lastAttempt: new Date().toISOString(),
    };
    await saveProgress(progress);
  }
}

export async function getModuleStats(module: keyof AppProgress) {
  const progress = await getProgress();
  const moduleProgress = progress[module];
  const levels = Object.values(moduleProgress);

  return {
    levelsCompleted: levels.filter((l) => l.completed).length,
    totalScore: levels.reduce((sum, l) => sum + l.score, 0),
    totalQuestions: levels.reduce((sum, l) => sum + l.totalQuestions, 0),
  };
}
