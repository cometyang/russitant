import type { Meta, StoryObj } from '@storybook/react';

import { ChatGPTMessage, ChatBox } from '../component/ChatBox';

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction
const meta: Meta<typeof ChatBox> = {
  title: 'Example/ChatBox',
  component: ChatBox,
  tags: ['autodocs'],
  argTypes: {

  },
};

export default meta;
type Story = StoryObj<typeof ChatBox>;

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
export const Primary: Story = {
  args: {
   content: "Hello world"
  },
};