import Disposition from '.';

describe('Model :: Disposition', () => {
  describe('getErrorMessages', () => {
    it('returns empty array when the argument is falsy', () => {
      expect(Disposition.getErrorMessages()).toEqual([]);
    });

    it('returns a list of error message', () => {
      const discrepancies = {
        evalSubStatus: {
          expected: 'Missing Docs',
        },
        resolutionSubStatus: {
          expected: ['first', 'second'],
        },
        evalStatus: {
          expected: ['first'],
        },
      };
      const errors = [
        '\'EvalSubStatus\' should not be \'Missing Docs\'',
        '\'ResolutionSubStatus\' should not be \'First\' or \'Second\'',
        '\'EvalStatus\' should not be \'First\'',
      ];
      expect(Disposition.getErrorMessages(discrepancies)).toEqual(errors);
    });
  });
});
