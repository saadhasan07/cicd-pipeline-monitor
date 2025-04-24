import { ReactNode } from "react";

export interface Project {
  id: number;
  title: string;
  description: string;
  status: 'completed' | 'in-progress';
  type: string;
  features: string[];
  technologies: string[];
  link: string;
  linkText: string;
  codeSnippet?: string;
  sideContent?: ReactNode;
}

export interface ProjectIdea {
  title: string;
  description: string;
  technologies: string;
  icon: string;
}

export interface Skill {
  name: string;
  percentage: number;
}

export interface SkillCategory {
  name: string;
  icon: string;
  skills: Skill[];
}

export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}
