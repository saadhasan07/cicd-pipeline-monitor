import { Link } from "wouter";

export default function CTASection() {
  return (
    <section className="py-16 bg-gradient-to-r from-primary-700 to-primary-800 text-white">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold mb-6">Ready to Build Your DevOps Portfolio?</h2>
        <p className="text-xl mb-8 max-w-3xl mx-auto">
          Choose one of these projects to showcase your skills and demonstrate your expertise in CI/CD pipelines, infrastructure automation, and modern deployment techniques.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link href="/projects">
            <a className="bg-white text-primary-700 hover:bg-gray-100 font-semibold px-6 py-3 rounded-lg transition-colors shadow-lg">
              Explore Project Ideas
            </a>
          </Link>
          <Link href="/contact">
            <a className="bg-transparent hover:bg-white/10 border border-white text-white font-semibold px-6 py-3 rounded-lg transition-colors">
              Contact for More Information
            </a>
          </Link>
        </div>
      </div>
    </section>
  );
}
