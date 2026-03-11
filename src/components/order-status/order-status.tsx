import React, { FC } from 'react';
import { OrderStatusProps } from './type';
import { OrderStatusUI } from '@ui';

const statusText: { [key: string]: string } = {
  pending: 'Готовится',
  done: 'Выполнен',
  created: 'Создан'
};

const statusColor: { [key: string]: string } = {
  pending: '#E52B1A',
  done: '#00CCCC',
  created: '#F2F2F3'
};

export const OrderStatus: FC<OrderStatusProps> = ({ status }) => {
  const text = statusText[status] || 'Неизвестно';
  const color = statusColor[status] || '#F2F2F3';

  return <OrderStatusUI textStyle={color} text={text} />;
};
