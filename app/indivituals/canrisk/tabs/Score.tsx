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
    <div className='border border-gray-200 p-6 rounded-xl bg-white text-slate-800'>
      <h2 className='text-xl font-bold'>My risk score</h2>
      <p className='mt-4'>Your score: <b>{score ?? '-'}</b></p>
      <button className='mt-4 px-4 py-2 bg-blue-500 text-white rounded' onClick={onNext}>
        Next: More Information
      </button>
    </div>
  );
};

export default Score;