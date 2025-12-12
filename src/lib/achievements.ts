export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  rarity: "common" | "rare" | "epic" | "legendary";
  points: number;
  unlocked: boolean;
  unlockedAt?: Date;
  condition: (stats: GameStats) => boolean;
}

export interface GameStats {
  tictactoeWins: number;
  tictactoePlayed: number;
  game2048HighScore: number;
  game2048Played: number;
  puzzle15Completed: number;
  puzzle15BestTime: number;
  totalGamesPlayed: number;
  totalWins: number;
}

export const achievements: Achievement[] = [
  {
    id: "first_win",
    title: "Первая победа",
    description: "Выиграй свою первую игру",
    icon: "Trophy",
    rarity: "common",
    points: 10,
    unlocked: false,
    condition: (stats) => stats.totalWins >= 1,
  },
  {
    id: "tictactoe_master",
    title: "Мастер крестиков",
    description: "Победи ИИ в крестики-нолики 5 раз",
    icon: "Target",
    rarity: "rare",
    points: 25,
    unlocked: false,
    condition: (stats) => stats.tictactoeWins >= 5,
  },
  {
    id: "game_2048_512",
    title: "Начинающий",
    description: "Достигни плитки 512 в 2048",
    icon: "Zap",
    rarity: "common",
    points: 15,
    unlocked: false,
    condition: (stats) => stats.game2048HighScore >= 512,
  },
  {
    id: "game_2048_2048",
    title: "Чемпион 2048",
    description: "Достигни плитки 2048",
    icon: "Star",
    rarity: "epic",
    points: 50,
    unlocked: false,
    condition: (stats) => stats.game2048HighScore >= 2048,
  },
  {
    id: "puzzle_speedrun",
    title: "Спидраннер",
    description: "Собери пазл 15 быстрее чем за 2 минуты",
    icon: "Rocket",
    rarity: "rare",
    points: 30,
    unlocked: false,
    condition: (stats) => stats.puzzle15BestTime > 0 && stats.puzzle15BestTime <= 120,
  },
  {
    id: "puzzle_completionist",
    title: "Любитель пазлов",
    description: "Собери пазл 15 три раза",
    icon: "Grid3x3",
    rarity: "common",
    points: 20,
    unlocked: false,
    condition: (stats) => stats.puzzle15Completed >= 3,
  },
  {
    id: "marathon_player",
    title: "Марафонец",
    description: "Сыграй 20 игр",
    icon: "Flame",
    rarity: "rare",
    points: 35,
    unlocked: false,
    condition: (stats) => stats.totalGamesPlayed >= 20,
  },
  {
    id: "dedication",
    title: "Преданность",
    description: "Сыграй 50 игр",
    icon: "Heart",
    rarity: "epic",
    points: 75,
    unlocked: false,
    condition: (stats) => stats.totalGamesPlayed >= 50,
  },
  {
    id: "perfectionist",
    title: "Перфекционист",
    description: "Разблокируй все достижения",
    icon: "Crown",
    rarity: "legendary",
    points: 100,
    unlocked: false,
    condition: (stats, unlockedCount) => unlockedCount === 8,
  },
];

export const getRarityColor = (rarity: Achievement["rarity"]) => {
  switch (rarity) {
    case "common":
      return "bg-gray-500/20 text-gray-300 border-gray-500/30";
    case "rare":
      return "bg-blue-500/20 text-blue-400 border-blue-500/30";
    case "epic":
      return "bg-purple-500/20 text-purple-400 border-purple-500/30";
    case "legendary":
      return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
  }
};

const STORAGE_KEY = "gamehub_stats";

export const loadStats = (): GameStats => {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    return JSON.parse(saved);
  }
  return {
    tictactoeWins: 0,
    tictactoePlayed: 0,
    game2048HighScore: 0,
    game2048Played: 0,
    puzzle15Completed: 0,
    puzzle15BestTime: 0,
    totalGamesPlayed: 0,
    totalWins: 0,
  };
};

export const saveStats = (stats: GameStats) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
};

export const updateStats = (
  updates: Partial<GameStats>
): { stats: GameStats; newAchievements: Achievement[] } => {
  const currentStats = loadStats();
  const newStats = { ...currentStats, ...updates };
  saveStats(newStats);

  const savedAchievements = loadAchievements();
  const unlockedCount = savedAchievements.filter((a) => a.unlocked).length;
  
  const newAchievements: Achievement[] = [];

  savedAchievements.forEach((achievement) => {
    if (!achievement.unlocked) {
      const shouldUnlock =
        achievement.id === "perfectionist"
          ? achievement.condition(newStats, unlockedCount)
          : achievement.condition(newStats);

      if (shouldUnlock) {
        achievement.unlocked = true;
        achievement.unlockedAt = new Date();
        newAchievements.push(achievement);
      }
    }
  });

  if (newAchievements.length > 0) {
    saveAchievements(savedAchievements);
  }

  return { stats: newStats, newAchievements };
};

const ACHIEVEMENTS_KEY = "gamehub_achievements";

export const loadAchievements = (): Achievement[] => {
  const saved = localStorage.getItem(ACHIEVEMENTS_KEY);
  if (saved) {
    return JSON.parse(saved);
  }
  return achievements.map((a) => ({ ...a }));
};

export const saveAchievements = (achievementsList: Achievement[]) => {
  localStorage.setItem(ACHIEVEMENTS_KEY, JSON.stringify(achievementsList));
};

export const getTotalPoints = (): number => {
  const achievementsList = loadAchievements();
  return achievementsList
    .filter((a) => a.unlocked)
    .reduce((sum, a) => sum + a.points, 0);
};
