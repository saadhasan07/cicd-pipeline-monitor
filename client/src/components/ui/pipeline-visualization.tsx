import React from "react";

export function CICDPipelineVisualization() {
  return (
    <div className="bg-secondary-50 rounded-lg p-4 border border-secondary-200">
      <h4 className="text-sm uppercase font-semibold text-secondary-500 mb-3">CI/CD Pipeline Visualization</h4>
      <div className="relative">
        <div className="border-l-2 border-primary-500 ml-3 py-2">
          <div className="relative flex items-start mb-6">
            <div className="h-6 w-6 bg-primary-500 rounded-full flex items-center justify-center text-white absolute -left-3 mt-0.5">1</div>
            <div className="ml-6">
              <h5 className="font-medium">Code Commit</h5>
              <p className="text-sm text-secondary-600">Trigger pipeline on push to main or PRs</p>
            </div>
          </div>
          
          <div className="relative flex items-start mb-6">
            <div className="h-6 w-6 bg-primary-500 rounded-full flex items-center justify-center text-white absolute -left-3 mt-0.5">2</div>
            <div className="ml-6">
              <h5 className="font-medium">Build & Test</h5>
              <p className="text-sm text-secondary-600">Lint, build, unit & integration tests</p>
            </div>
          </div>
          
          <div className="relative flex items-start mb-6">
            <div className="h-6 w-6 bg-primary-500 rounded-full flex items-center justify-center text-white absolute -left-3 mt-0.5">3</div>
            <div className="ml-6">
              <h5 className="font-medium">Security Scan</h5>
              <p className="text-sm text-secondary-600">SAST, dependency & container scanning</p>
            </div>
          </div>
          
          <div className="relative flex items-start mb-6">
            <div className="h-6 w-6 bg-primary-500 rounded-full flex items-center justify-center text-white absolute -left-3 mt-0.5">4</div>
            <div className="ml-6">
              <h5 className="font-medium">Deploy to Staging</h5>
              <p className="text-sm text-secondary-600">Automatic deployment to staging environment</p>
            </div>
          </div>
          
          <div className="relative flex items-start">
            <div className="h-6 w-6 bg-primary-500 rounded-full flex items-center justify-center text-white absolute -left-3 mt-0.5">5</div>
            <div className="ml-6">
              <h5 className="font-medium">Production Deployment</h5>
              <p className="text-sm text-secondary-600">Manual approval for production deployment</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}