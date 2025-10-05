/**
 * Game Models
 * Модели данных для игр
 */

export type GameCategory = 'slots' | 'table' | 'live' | 'crash' | 'arcade' | 'baccarat' | 'bingo' | 'blackjack' | 'buy-bonus' | 'crash-game' | 'dice' | 'fishing-shooting' | 'free-bonus' | 'jackpot' | 'live-casino' | 'lottery' | 'mines' | 'other' | 'plinko' | 'poker' | 'progression-feature' | 'roulette' | 'scratch-cards' | 'table-games' | 'show-games' | 'grow-bonus';

export type GameProvider = 'pragmatic' | 'evolution' | 'netent' | 'playtech' | 'microgaming' | 'red-tiger' | 'yggdrasil' | 'thunderkick' | 'quickspin' | 'nlc' | 'booming' | 'relax' | 'hacksaw' | 'push' | 'nucleus' | 'bgaming' | 'spribe' | 'pragmatic-play' | 'evolution-gaming' | 'netent' | 'playtech' | 'microgaming' | 'red-tiger-gaming' | 'yggdrasil-gaming' | 'thunderkick-gaming' | 'quickspin-gaming' | 'nlc-gaming' | 'booming-games' | 'relax-gaming' | 'hacksaw-gaming' | 'push-gaming' | 'nucleus-gaming' | 'bgaming-gaming' | 'spribe-gaming';

export type GameStatus = 'active' | 'inactive' | 'maintenance' | 'coming-soon';
export type GameType = 'slot' | 'table' | 'live' | 'crash' | 'arcade' | 'lottery' | 'sports';

export interface Game {
  id: string;
  name: string;
  category: GameCategory;
  provider: GameProvider;
  type: GameType;
  status: GameStatus;
  minBet: number;
  maxBet: number;
  rtp?: number;
  volatility?: 'low' | 'medium' | 'high';
  features?: string[];
  tags?: string[];
  isNew?: boolean;
  isPopular?: boolean;
  isHot?: boolean;
  isFavorite?: boolean;
  imageUrl?: string;
  demoUrl?: string;
  playUrl?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface GameResult {
  gameId: string;
  betAmount: number;
  winAmount: number;
  timestamp: Date;
  sessionId?: string;
  roundId?: string;
  multiplier?: number;
  isWin: boolean;
}

export interface GameSession {
  gameId: string;
  sessionId: string;
  startTime: Date;
  endTime?: Date;
  totalBet: number;
  totalWin: number;
  roundsPlayed: number;
  isActive: boolean;
}

export interface GameStats {
  gameId: string;
  totalPlays: number;
  totalBet: number;
  totalWin: number;
  averageBet: number;
  winRate: number;
  lastPlayed?: Date;
  favoriteCount: number;
}

