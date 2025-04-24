import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Project } from "@/lib/types";
import { CheckCircle2 } from "lucide-react";

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Card className="bg-white rounded-xl shadow-lg overflow-hidden mb-10 transition-transform hover:translate-y-[-4px]">
      <CardContent className="p-6 sm:p-8">
        <div className="flex flex-col md:flex-row">
          <div className="w-full md:w-2/3 pr-0 md:pr-8">
            <div className="flex items-center mb-4">
              <span className={`bg-${project.status === 'completed' ? 'green' : 'blue'}-100 text-${project.status === 'completed' ? 'green' : 'blue'}-800 text-xs px-3 py-1 rounded-full uppercase font-semibold tracking-wide`}>
                {project.status === 'completed' ? 'Completed' : 'In Progress'}
              </span>
              <span className="ml-3 text-secondary-500 text-sm">{project.type}</span>
            </div>
            <h3 className="text-2xl font-bold mb-3">{project.title}</h3>
            <p className="text-secondary-600 mb-6">{project.description}</p>
            
            <div className="mb-6">
              <h4 className="text-lg font-semibold mb-2">Key Features:</h4>
              <ul className="space-y-2 text-secondary-700">
                {project.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-primary-500 mr-2 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="flex flex-wrap gap-2 mb-6">
              {project.technologies.map((tech, index) => (
                <Badge key={index} variant="secondary" className="bg-secondary-100 text-secondary-700 rounded-lg px-3 py-1 text-sm font-medium">
                  {tech}
                </Badge>
              ))}
            </div>
            
            {project.codeSnippet && (
              <div className="bg-secondary-50 rounded-lg p-5 border border-secondary-200 mb-6">
                <h4 className="text-lg font-semibold mb-3">Code Sample</h4>
                <pre className="bg-secondary-800 text-white p-4 rounded overflow-x-auto">
                  <code>{project.codeSnippet}</code>
                </pre>
              </div>
            )}
            
            <div>
              <a href={project.link} className="inline-flex items-center font-medium text-primary-600 hover:text-primary-700">
                {project.linkText}
                <svg className="ml-1 w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </a>
            </div>
          </div>
          
          {project.sideContent && (
            <div className="w-full md:w-1/3 mt-6 md:mt-0">
              {project.sideContent}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
