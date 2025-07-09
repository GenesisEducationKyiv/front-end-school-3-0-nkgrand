import React from 'react';
import Search from 'antd/es/input/Search';

export interface SearchInputProps extends React.ComponentProps<typeof Search> {
  entity: string;
}

export const SearchInput: React.FC<SearchInputProps> = ({
  entity,
  ...props
}) => (
  <Search
    allowClear
    placeholder={entity ? `Search ${entity}` : 'Search'}
    {...props}
  />
);
