import { CloudLightning, CheckCircle, Layers } from "lucide-react";

export default function MetricsSection() {
  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-secondary-50 p-6 rounded-xl shadow-md border border-secondary-200">
            <div className="flex items-center mb-2">
              <CloudLightning className="h-6 w-6 text-primary-500 mr-2" />
              <h3 className="font-semibold text-lg">CI/CD Pipelines</h3>
            </div>
            <p className="text-secondary-600">5+ fully automated pipelines built with GitHub Actions, Jenkins, and GitLab CI</p>
          </div>
          
          <div className="bg-secondary-50 p-6 rounded-xl shadow-md border border-secondary-200">
            <div className="flex items-center mb-2">
              <Layers className="h-6 w-6 text-primary-500 mr-2" />
              <h3 className="font-semibold text-lg">Infrastructure as Code</h3>
            </div>
            <p className="text-secondary-600">8+ projects using Terraform, Ansible, and CloudFormation templates</p>
          </div>
          
          <div className="bg-secondary-50 p-6 rounded-xl shadow-md border border-secondary-200">
            <div className="flex items-center mb-2">
              <CheckCircle className="h-6 w-6 text-primary-500 mr-2" />
              <h3 className="font-semibold text-lg">Automated Testing</h3>
            </div>
            <p className="text-secondary-600">100+ automated tests integrated into deployment pipelines</p>
          </div>
        </div>
      </div>
    </section>
  );
}
