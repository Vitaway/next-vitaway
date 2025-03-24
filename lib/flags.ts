import { flag } from 'flags/next';
 
export const blogsFlag = flag({
  key: 'blogs',
  decide: () => Math.random() > 0.5,
});