import { ProjectCard } from "@/components/ui/project-card";
import { CICDPipelineVisualization } from "@/components/ui/pipeline-visualization";
import { projects, projectIdeas } from "@/lib/data";
import { Database, Shield, PackageCheck, BarChart3, GitBranch, Boxes } from "lucide-react";

export default function Projects() {
  return (
    <div className="min-h-screen">
      <section className="bg-gradient-to-r from-secondary-800 to-secondary-900 text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">DevOps Portfolio Projects</h1>
          <p className="text-xl text-secondary-200 max-w-3xl mx-auto">
            A collection of CI/CD and infrastructure automation projects showcasing DevOps best practices
          </p>
        </div>
      </section>
      
      <section className="py-16 bg-secondary-50">
        <div className="container mx-auto px-4">
          <div className="mb-12">
            <h2 className="text-3xl font-bold mb-4">Featured Projects</h2>
            <p className="text-lg text-secondary-600">
              These projects demonstrate my expertise in CI/CD, infrastructure automation, and DevOps practices.
            </p>
          </div>

          {projects.map((project, index) => {
            // Add the pipeline visualization to the first project
            if (index === 0) {
              return (
                <ProjectCard 
                  key={index} 
                  project={{
                    ...project,
                    sideContent: <CICDPipelineVisualization />
                  }} 
                />
              );
            }
            return <ProjectCard key={index} project={project} />;
          })}

          {/* Project Ideas Section */}
          <div className="mt-16">
            <h3 className="text-2xl font-bold mb-6 text-center">More Project Ideas for Your Portfolio</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-md border border-secondary-100 hover:shadow-lg transition-shadow">
                <div className="flex items-center mb-4">
                  <PackageCheck className="h-8 w-8 text-primary-500 mr-3" />
                  <h4 className="text-xl font-semibold">Microservices Deployment</h4>
                </div>
                <p className="text-secondary-600 mb-4">Implement a microservices architecture with service discovery, API gateway, and containerized deployment.</p>
                <div className="text-sm text-secondary-500">
                  <p>Technologies: Docker, Kubernetes, Istio</p>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-md border border-secondary-100 hover:shadow-lg transition-shadow">
                <div className="flex items-center mb-4">
                  <Shield className="h-8 w-8 text-primary-500 mr-3" />
                  <h4 className="text-xl font-semibold">Security Automation</h4>
                </div>
                <p className="text-secondary-600 mb-4">Create a security automation pipeline for vulnerability scanning, compliance checks, and security remediation.</p>
                <div className="text-sm text-secondary-500">
                  <p>Technologies: OWASP ZAP, SonarQube, AWS Security Hub</p>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-md border border-secondary-100 hover:shadow-lg transition-shadow">
                <div className="flex items-center mb-4">
                  <Database className="h-8 w-8 text-primary-500 mr-3" />
                  <h4 className="text-xl font-semibold">Database CI/CD</h4>
                </div>
                <p className="text-secondary-600 mb-4">Build a CI/CD pipeline for database schema changes with automated testing and rollback capabilities.</p>
                <div className="text-sm text-secondary-500">
                  <p>Technologies: Flyway, Liquibase, PostgreSQL</p>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-md border border-secondary-100 hover:shadow-lg transition-shadow">
                <div className="flex items-center mb-4">
                  <BarChart3 className="h-8 w-8 text-primary-500 mr-3" />
                  <h4 className="text-xl font-semibold">Monitoring & Alerting</h4>
                </div>
                <p className="text-secondary-600 mb-4">Set up a comprehensive monitoring stack with dashboards, alerts, and automated incident response.</p>
                <div className="text-sm text-secondary-500">
                  <p>Technologies: Prometheus, Grafana, AlertManager</p>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-md border border-secondary-100 hover:shadow-lg transition-shadow">
                <div className="flex items-center mb-4">
                  <GitBranch className="h-8 w-8 text-primary-500 mr-3" />
                  <h4 className="text-xl font-semibold">GitOps Pipeline</h4>
                </div>
                <p className="text-secondary-600 mb-4">Implement GitOps principles with infrastructure and application deployment driven by Git repositories.</p>
                <div className="text-sm text-secondary-500">
                  <p>Technologies: ArgoCD, Flux, Kubernetes</p>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-md border border-secondary-100 hover:shadow-lg transition-shadow">
                <div className="flex items-center mb-4">
                  <Boxes className="h-8 w-8 text-primary-500 mr-3" />
                  <h4 className="text-xl font-semibold">Infrastructure Testing</h4>
                </div>
                <p className="text-secondary-600 mb-4">Develop a comprehensive testing framework for infrastructure code with policy enforcement.</p>
                <div className="text-sm text-secondary-500">
                  <p>Technologies: Terratest, Checkov, OPA/Conftest</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
