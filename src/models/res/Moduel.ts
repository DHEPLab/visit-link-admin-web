import { ModuleTopic } from "@/constants/enums";

export interface ModuleTextComponent {
  type: "Text";
  key: number;
  value: {
    type: "script" | "instruction" | "reference";
    html: string;
  };
}

export interface ModuleMediaComponent {
  type: "Media";
  key: number;
  value: {
    type: string;
    file: string;
    text: string;
  };
}

export interface ModuleSwitchComponent {
  type: "Switch";
  key: number;
  value: {
    question: {
      type: "script" | "instruction" | "reference";
      html: string;
    };
    cases: SwitchCase[];
  };
}

export interface ModulePageFooterComponent {
  type: "PageFooter";
  key: number;
}

interface SwitchCase {
  key: number;
  text: string;
  finishAction: string[];
  components: ModuleTextComponent[];
}

export type ModuleComponentType =
  | ModuleTextComponent
  | ModuleMediaComponent
  | ModuleSwitchComponent
  | ModulePageFooterComponent;

export interface ModuleResponse {
  branch: "MASTER" | "DRAFT";
  components: ModuleComponentType[];
  createdAt: string;
  createdBy: string;
  description: string;
  id: number;
  lastModifiedAt: string;
  lastModifiedBy: string;
  name: string;
  number: string;
  projectId: number;
  published: boolean;
  topic: keyof typeof ModuleTopic;
}
