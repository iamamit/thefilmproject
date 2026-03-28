import { ProjectType } from '../types/enums';

export interface ProjectColorConfig {
  bg: string;
  light: string;
  label: string;
}

export const projectColors: Record<ProjectType, ProjectColorConfig> = {
  FILM:        { bg: '#0a66c2', light: '#e8f0fe', label: '🎬 Film Project' },
  MUSIC:       { bg: '#9b59b6', light: '#f3e8ff', label: '🎵 Music Project' },
  WRITING:     { bg: '#f39c12', light: '#fef3e2', label: '✍️ Writing Project' },
  PHOTOGRAPHY: { bg: '#1abc9c', light: '#e2faf5', label: '📸 Photography Project' },
  THEATRE:     { bg: '#e74c3c', light: '#fde8e8', label: '🎭 Theatre Project' },
  DIGITAL:     { bg: '#2ecc71', light: '#e2faeb', label: '🎮 Digital Project' },
};
