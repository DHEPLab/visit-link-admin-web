import type { Meta, StoryObj } from "@storybook/react";
import StatusTag from "./StatusTag";

const meta = {
  title: "Components/StatusTag",
  component: StatusTag,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof StatusTag>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Published: Story = {
  args: {
    value: true,
  },
};

export const Draft: Story = {
  args: {
    value: false,
  },
};

export const Active: Story = {
  args: {
    value: true,
    trueText: "Active",
    falseText: "Inactive",
  },
};

export const Inactive: Story = {
  args: {
    value: false,
    trueText: "Active",
    falseText: "Inactive",
  },
};
