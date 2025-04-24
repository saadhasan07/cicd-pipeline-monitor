import Hero from "@/components/Hero";
import MetricsSection from "@/components/MetricsSection";
import { ProjectCard } from "@/components/ui/project-card";
import CTASection from "@/components/CTASection";
import { projects } from "@/lib/data";
import { Link } from "wouter";

export default function Home() {
  // Display only the first project on the home page
  const featuredProject = projects[0];

  return (
    <div>
      <Hero />
      <MetricsSection />
      
      <section id="projects" className="py-16 bg-secondary-50">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold mb-4">Featured DevOps Project</h2>
            <p className="text-lg text-secondary-600 max-w-3xl mx-auto">
              Explore my portfolio of CI/CD and DevOps projects that demonstrate expertise in modern infrastructure management and deployment automation.
            </p>
          </div>

          <ProjectCard project={featuredProject} />
          
          <div className="text-center mt-8">
            <Link href="/projects">
              <a className="inline-flex items-center font-medium text-primary-600 hover:text-primary-700">
                View All Projects
                <svg className="ml-1 w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </a>
            </Link>
          </div>
        </div>
      </section>
      
      <CTASection />
    </div>
  );
}
