export const getScores = (
  totalScores: number,
  gameId: number,
  userId: number,
) => {
  return Array.from({ length: totalScores }).map((_, index) => {
    return {
      userId,
      gameId,
      score: Math.round(Math.random() * 999 + 1),
      round: index + 1,
    };
  });
};
