import { Link } from "wouter";

export default function Hero() {
  return (
    <section className="bg-gradient-to-r from-secondary-800 to-secondary-900 text-white py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-4">CI/CD & DevOps Portfolio</h2>
          <p className="text-xl text-secondary-200 mb-8">
            Showcase of real-world DevOps projects demonstrating infrastructure automation, CI/CD pipelines, and modern deployment techniques.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/projects">
              <a className="bg-primary-500 hover:bg-primary-600 text-white font-semibold px-6 py-3 rounded-lg transition-colors shadow-lg">
                View Projects
              </a>
            </Link>
            <Link href="/contact">
              <a className="bg-transparent hover:bg-white/10 border border-white text-white font-semibold px-6 py-3 rounded-lg transition-colors">
                Contact Me
              </a>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
