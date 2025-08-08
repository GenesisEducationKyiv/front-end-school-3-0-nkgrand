import type { Meta, StoryObj } from '@storybook/react-vite';
import { Tag } from './Tag';

const meta: Meta<typeof Tag> = {
  title: 'Common/Tag',
  component: Tag,
  tags: ['autodocs'],
  argTypes: {
    color: {
      control: { type: 'select' },
      options: [
        'default',
        'magenta',
        'red',
        'volcano',
        'orange',
        'gold',
        'lime',
        'green',
        'cyan',
        'blue',
        'geekblue',
        'purple',
      ],
    },
    children: { control: 'text' },
    bordered: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof Tag>;

export const Default: Story = {
  args: {
    children: 'Default Tag',
  },
};

export const Blue: Story = {
  args: {
    color: 'blue',
    children: 'Blue Tag',
  },
};

export const Custom: Story = {
  args: {
    color: 'magenta',
    bordered: true,
    children: 'Custom Tag',
  },
};
