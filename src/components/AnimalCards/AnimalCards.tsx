import React, { FC } from 'react';
import cn from 'clsx';
import { Animal } from 'src/server.types';
import { AnimalEditingCard } from 'src/components/AnimalEditingCard';
import s from './AnimalCards.sass';

export type AnimalsPanelProps = {
  className?: string;
  value: Animal[];
  empty?: React.ReactNode;
};

export const AnimalCards: FC<AnimalsPanelProps> = ({ className, value, empty }) => (
  <div className={cn(s.root, className)}>
    {value?.length ? value.map((item) => <AnimalEditingCard value={item} key={item.id} />) : empty}
  </div>
);
