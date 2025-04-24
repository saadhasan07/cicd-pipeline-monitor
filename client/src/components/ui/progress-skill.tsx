import { Progress } from "@/components/ui/progress";

interface ProgressSkillProps {
  name: string;
  percentage: number;
}

export function ProgressSkill({ name, percentage }: ProgressSkillProps) {
  return (
    <li className="flex items-center">
      <div className="w-full bg-secondary-100 rounded-full h-4 mr-2">
        <div
          className="bg-primary-500 h-4 rounded-full"
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
      <span className="text-secondary-600 min-w-[80px] text-right">{name}</span>
    </li>
  );
}
