import React from 'react';
import CardListItem from './CardListItem';
import Image from 'next/image';

interface CardListProps {
  children?: React.ReactNode;
}

export default function CardList({ children }: CardListProps) {
  return <div>{children}</div>;
}
