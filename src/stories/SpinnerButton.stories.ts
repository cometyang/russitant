import type { Meta, StoryObj } from '@storybook/react';

import { SpinnerButton } from '../component/Button';

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction
const meta: Meta<typeof SpinnerButton> = {
  title: 'Example/SpinnerButton',
  component: SpinnerButton,
  tags: ['autodocs'],
  argTypes: {
    isSpinning: {
      control: 'true',
    },
  },
};

export default meta;
type Story = StoryObj<typeof SpinnerButton>;

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
export const Spinner: Story = {
  args: {
    isSpinning: true,
  },
};

// export const Secondary: Story = {
//   args: {
//     label: 'Button',
//   },
// };

// export const Large: Story = {
//   args: {
//     size: 'large',
//     label: 'Button',
//   },
// };

// export const Small: Story = {
//   args: {
//     size: 'small',
//     label: 'Button',
//   },
// };
