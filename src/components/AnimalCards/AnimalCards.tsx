import React, { FC } from 'react';
import cn from 'clsx';
import { Animal } from 'src/server.types';
import { AnimalCard } from 'src/components/AnimalCard';
import s from './AnimalCards.sass';

export type AnimalsPanelProps = {
  className?: string;
  value: Animal[];
};

export const AnimalCards: FC<AnimalsPanelProps> = ({ className, value }) => (
  <div className={cn(s.root, className)}>
    {value?.map((item) => (
      <AnimalCard value={item} key={item.id} />
    ))}
  </div>
);