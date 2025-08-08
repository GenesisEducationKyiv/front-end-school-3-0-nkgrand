import React from 'react';
import { Button as AntdButton } from 'antd';
import type { ButtonProps as AntButtonProps } from 'antd';

export type ButtonProps = AntButtonProps;

export const Button: React.FC<ButtonProps> = (props) => {
  return <AntdButton {...props} />;
};
