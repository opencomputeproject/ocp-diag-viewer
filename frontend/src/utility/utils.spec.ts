import {timeDiff} from './utils';

describe('Utils', () => {
  describe('timeDiff', () => {
    it('should be returning time difference', () => {
      expect(timeDiff(
                 '2021-10-12T14:09:23.549303038Z',
                 '2021-10-15T14:19:32.563567905Z'))
          .toBe('72:10:09');
    });
  });
});
