import calculateDistance from './calculateDistance';

const WORLD_MAP_SCORE_FACTOR = 1000;

export const calculateMapScoreFactor = ({ location, marker }) => {
  const distance = calculateDistance(location, marker, 'metric');

  const scoreFactor = WORLD_MAP_SCORE_FACTOR - Number(distance) * 2;

  if (scoreFactor < 0) {
    return 0;
  }

  return scoreFactor;
};
