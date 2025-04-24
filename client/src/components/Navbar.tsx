import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/ui/theme-provider";
import { Moon, Sun } from "lucide-react";

export default function Navbar() {
  const [location] = useLocation();
  const { theme, setTheme } = useTheme();

  return (
    <header className="bg-secondary-900 text-white shadow-lg">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col sm:flex-row justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold mb-2">DevOps Portfolio Projects</h1>
            <p className="text-secondary-300 text-sm">Building professional CI/CD infrastructure solutions</p>
          </div>
          <div className="flex items-center mt-4 sm:mt-0">
            <nav className="mr-4">
              <ul className="flex space-x-6">
                <li>
                  <Link href="/" className={`${location === "/" ? "text-primary-300" : "text-white"} hover:text-primary-300 transition-colors`}>
                    Home
                  </Link>
                </li>
                <li>
                  <Link href="/projects" className={`${location === "/projects" ? "text-primary-300" : "text-white"} hover:text-primary-300 transition-colors`}>
                    Projects
                  </Link>
                </li>
                <li>
                  <Link href="/skills" className={`${location === "/skills" ? "text-primary-300" : "text-white"} hover:text-primary-300 transition-colors`}>
                    Skills
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className={`${location === "/contact" ? "text-primary-300" : "text-white"} hover:text-primary-300 transition-colors`}>
                    Contact
                  </Link>
                </li>
              </ul>
            </nav>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
              className="text-white hover:bg-secondary-800"
            >
              {theme === "light" ? (
                <Moon className="h-5 w-5" />
              ) : (
                <Sun className="h-5 w-5" />
              )}
              <span className="sr-only">Toggle theme</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
