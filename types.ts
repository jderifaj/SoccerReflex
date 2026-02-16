export type TrainingColor = "Red" | "Orange" | "Green" | "Yellow" | "Blue";

export interface ColorDefinition {
  name: TrainingColor;
  bgClass: string;
  hex: string;
}

export interface TrainingConfig {
  selectedColors: TrainingColor[];
  delaySeconds: number;
  voiceEnabled: boolean;
}

export interface FavoriteCombo extends TrainingConfig {
  id: string;
  name: string;
  createdAt: number;
}

export enum AppState {
  SETUP = "SETUP",
  TRAINING = "TRAINING",
}
