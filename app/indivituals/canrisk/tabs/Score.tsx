/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import type { InputData } from './Questionair';

type ScoreProps = {
  score: number | null;
  data: InputData | null;
  onNext: () => void;
};

const Score: React.FC<ScoreProps> = ({ score, data, onNext }) => {
  return (
    <div className='rounded-[24px] bg-[#F6F3EE] p-6 text-[#003E48]'>
      <h2 className='text-xl font-bold'>My risk <span className="font-accent">score</span></h2>
      <p className='mt-4'>Your score: <b>{score ?? '-'}</b></p>
      <button className='press-btn press-btn--sm mt-4' onClick={onNext}>
        Next: More Information
      </button>
    </div>
  );
};

export default Score;