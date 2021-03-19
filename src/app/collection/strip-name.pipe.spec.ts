import { StripNamePipe } from './strip-name.pipe';

describe('StripNamePipe', () => {
  it('create an instance', () => {
    const pipe = new StripNamePipe();
    expect(pipe).toBeTruthy();
  });
});
