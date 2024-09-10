import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import ShadeButton from "./ShadeButton";

const meta = {
  title: "Components/ShadeButton",
  component: ShadeButton,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {},
  args: { onClick: fn() },
} satisfies Meta<typeof ShadeButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    color: "primary",
    children: "Button",
  },
};

export const Secondary: Story = {
  args: {
    children: "Button",
  },
};

export const Large: Story = {
  args: {
    size: "large",
    children: "Button",
  },
};

export const Small: Story = {
  args: {
    size: "small",
    children: "Button",
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    children: "Button",
  },
};
