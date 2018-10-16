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
      };
      const errors = [
        '\'evalSubStatus\' should be in \'Missing Docs\'',
        '\'resolutionSubStatus\' should be one of \'first\', \'second\'',
      ];
      expect(Disposition.getErrorMessages(discrepancies)).toEqual(errors);
    });
  });
});
