
import React from 'react';
import { Tag as AntdTag } from 'antd';
import type { TagProps as AntdTagProps } from 'antd';


export type TagProps = AntdTagProps;

export const Tag: React.FC<TagProps> = (props) => <AntdTag {...props} />;

