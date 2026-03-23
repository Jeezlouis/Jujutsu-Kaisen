/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Character {
  id: string;
  name: string;
  grade: string;
  image: string;
  story: string;
  color: string;
  glowColor: string;
  particleColor: string;
  fontWeight: number;
}

export interface Technique {
  id: string;
  name: string;
  user: string;
  description: string;
  domain: string;
  image: string;
}

export interface TimelineEvent {
  id: string;
  year: string;
  arc: string;
  description: string;
  image?: string;
}
