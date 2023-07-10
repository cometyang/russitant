import type { Meta, StoryObj } from '@storybook/react';

import { ChatGPTMessage, ChatLine } from '../component/ChatLine';

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction
const meta: Meta<typeof ChatLine> = {
  title: 'Example/ChatLine',
  component: ChatLine,
  tags: ['autodocs'],
  argTypes: {

  },
};

export default meta;
type Story = StoryObj<typeof ChatLine>;

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
export const Primary: Story = {
  args: {
   
  },
};