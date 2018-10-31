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
        '\'EvalSubStatus\' should be \'Missing Docs\'',
        '\'ResolutionSubStatus\' should be \'First\' or \'Second\'',
        '\'EvalStatus\' should be \'First\'',
      ];
      expect(Disposition.getErrorMessages(discrepancies)).toEqual(errors);
    });
  });
});
