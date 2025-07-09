import type { Meta, StoryObj } from '@storybook/react';
import { SearchInput } from './Search';

const meta: Meta<typeof SearchInput> = {
  title: 'Common/SearchInput',
  component: SearchInput,
  tags: ['autodocs'],
  argTypes: {
    entity: { control: 'text' },
    placeholder: { control: 'text' },
    disabled: { control: 'boolean' },
    allowClear: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof SearchInput>;

export const Default: Story = {
  args: {
    entity: 'tracks',
    placeholder: 'Search tracks',
    allowClear: true,
  },
};

export const Disabled: Story = {
  args: {
    entity: 'tracks',
    placeholder: 'Search tracks',
    disabled: true,
    allowClear: true,
  },
};
