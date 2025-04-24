import { ProgressSkill } from "@/components/ui/progress-skill";
import { Code, Layers, Server, Shield, BarChart3, Cloud } from "lucide-react";
import { skillCategories } from "@/lib/data";

export default function Skills() {
  return (
    <div className="min-h-screen">
      <section className="bg-gradient-to-r from-secondary-800 to-secondary-900 text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">DevOps & CI/CD Skills</h1>
          <p className="text-xl text-secondary-200 max-w-3xl mx-auto">
            Expertise in modern DevOps practices, tools, and technologies
          </p>
        </div>
      </section>
      
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">DevOps & CI/CD Skills</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* CI/CD Tools */}
            <div>
              <h3 className="text-xl font-bold mb-4 flex items-center">
                <Code className="h-6 w-6 text-primary-500 mr-2" />
                CI/CD Tools
              </h3>
              <ul className="space-y-3">
                {skillCategories[0].skills.map((skill, index) => (
                  <ProgressSkill 
                    key={index} 
                    name={skill.name} 
                    percentage={skill.percentage} 
                  />
                ))}
              </ul>
            </div>
            
            {/* Infrastructure as Code */}
            <div>
              <h3 className="text-xl font-bold mb-4 flex items-center">
                <Layers className="h-6 w-6 text-primary-500 mr-2" />
                Infrastructure as Code
              </h3>
              <ul className="space-y-3">
                {skillCategories[1].skills.map((skill, index) => (
                  <ProgressSkill 
                    key={index} 
                    name={skill.name} 
                    percentage={skill.percentage} 
                  />
                ))}
              </ul>
            </div>
            
            {/* Container Orchestration */}
            <div>
              <h3 className="text-xl font-bold mb-4 flex items-center">
                <Server className="h-6 w-6 text-primary-500 mr-2" />
                Container Orchestration
              </h3>
              <ul className="space-y-3">
                {skillCategories[2].skills.map((skill, index) => (
                  <ProgressSkill 
                    key={index} 
                    name={skill.name} 
                    percentage={skill.percentage} 
                  />
                ))}
              </ul>
            </div>
            
            {/* Security & Compliance */}
            <div>
              <h3 className="text-xl font-bold mb-4 flex items-center">
                <Shield className="h-6 w-6 text-primary-500 mr-2" />
                Security & Compliance
              </h3>
              <ul className="space-y-3">
                {skillCategories[3].skills.map((skill, index) => (
                  <ProgressSkill 
                    key={index} 
                    name={skill.name} 
                    percentage={skill.percentage} 
                  />
                ))}
              </ul>
            </div>
            
            {/* Monitoring & Observability */}
            <div>
              <h3 className="text-xl font-bold mb-4 flex items-center">
                <BarChart3 className="h-6 w-6 text-primary-500 mr-2" />
                Monitoring & Observability
              </h3>
              <ul className="space-y-3">
                {skillCategories[4].skills.map((skill, index) => (
                  <ProgressSkill 
                    key={index} 
                    name={skill.name} 
                    percentage={skill.percentage} 
                  />
                ))}
              </ul>
            </div>
            
            {/* Cloud Platforms */}
            <div>
              <h3 className="text-xl font-bold mb-4 flex items-center">
                <Cloud className="h-6 w-6 text-primary-500 mr-2" />
                Cloud Platforms
              </h3>
              <ul className="space-y-3">
                {skillCategories[5].skills.map((skill, index) => (
                  <ProgressSkill 
                    key={index} 
                    name={skill.name} 
                    percentage={skill.percentage} 
                  />
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
