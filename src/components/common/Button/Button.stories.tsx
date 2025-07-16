import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from './Button';

const meta: Meta<typeof Button> = {
  title: 'Common/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: { type: 'select' },
      options: ['default', 'primary', 'dashed', 'link', 'text'],
    },
    danger: { control: 'boolean' },
    disabled: { control: 'boolean' },
    children: { control: 'text' },
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Default: Story = {
  args: {
    children: 'Default Button',
  },
};

export const Primary: Story = {
  args: {
    type: 'primary',
    children: 'Primary Button',
  },
};

export const Danger: Story = {
  args: {
    type: 'primary',
    danger: true,
    children: 'Danger Button',
  },
};

export const Disabled: Story = {
  args: {
    type: 'primary',
    disabled: true,
    children: 'Disabled Button',
  },
};

export const Link: Story = {
  args: {
    type: 'link',
    children: 'Link Button',
  },
};
