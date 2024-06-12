const length = 90;

export const PROFILE_DATA = Array.from({ length }).map((_, index) => {
  return {
    id: index + 1,
    userId: index + 1,
    birthdate: new Date('2005-01-01').toISOString(),
  };
});
