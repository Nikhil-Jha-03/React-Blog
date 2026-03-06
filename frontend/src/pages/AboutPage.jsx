import { GraduationCap, Sparkles, Code2, PenLine, Rocket } from "lucide-react";
import { Link } from "react-router-dom";

// Replace these with your real data whenever you want.
const profile = {
  name: "Nikhil Jha",
  role: "3rd year student",
  intro:
    "I am building this blog platform to practice full-stack development, improve design sense, and share ideas through writing.",
  location: "India",
  focus: "React, Node.js, and clean UI development"
};

const quickStats = [
  { label: "Projects Built", value: "06+" },
  { label: "Articles Planned", value: "20+" },
  { label: "Tech Stack Focus", value: "MERN" },
  { label: "Learning Status", value: "Active" }
];

const skills = [
  {
    icon: Code2,
    title: "Frontend Development",
    description: "Building responsive layouts and reusable React components."
  },
  {
    icon: PenLine,
    title: "Content Writing",
    description: "Creating beginner-friendly technical blogs and documentation."
  },
  {
    icon: Rocket,
    title: "Project Building",
    description: "Shipping practical projects and improving them iteratively."
  }
];

const timeline = [
  {
    year: "2026",
    title: "Started React-Blog",
    text: "Built user auth, blog posting flow, and admin authentication."
  },
  {
    year: "Next",
    title: "Content + SEO Plan",
    text: "Plan to add richer article categories, search, and content optimization."
  },
  {
    year: "Upcoming",
    title: "Portfolio Integration",
    text: "Connect this blog with a personal portfolio and showcase case studies."
  }
];

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      <section className="relative pt-32 pb-16 px-6 sm:px-8 border-b border-gray-800">
        <div className="absolute top-24 -left-20 w-72 h-72 bg-gray-700/20 blur-3xl rounded-full" />
        <div className="absolute bottom-10 -right-16 w-72 h-72 bg-gray-500/15 blur-3xl rounded-full" />

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-gray-700 bg-gray-900/80 mb-8">
            <Sparkles size={16} className="text-gray-300" />
            <span className="text-sm text-gray-200">About The Creator</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-tight">
            {profile.name}
            <span className="block text-2xl sm:text-3xl lg:text-4xl text-gray-300 mt-3 font-bold">
              {profile.role}
            </span>
          </h1>

          <p className="mt-6 max-w-3xl text-gray-300 text-lg leading-relaxed">
            {profile.intro}
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <span className="px-4 py-2 rounded-full border border-gray-700 text-sm text-gray-200">
              Location: {profile.location}
            </span>
            <span className="px-4 py-2 rounded-full border border-gray-700 text-sm text-gray-200">
              Focus: {profile.focus}
            </span>
          </div>
        </div>
      </section>

      <section className="px-6 sm:px-8 py-14 border-b border-gray-800">
        <div className="max-w-6xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {quickStats.map((item) => (
            <div
              key={item.label}
              className="rounded-2xl border border-gray-800 bg-gradient-to-b from-gray-950 to-black p-5 hover:border-gray-600 transition-colors"
            >
              <p className="text-2xl sm:text-3xl font-extrabold">{item.value}</p>
              <p className="text-sm text-gray-400 mt-1">{item.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="px-6 sm:px-8 py-16 border-b border-gray-800">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <GraduationCap size={22} className="text-gray-200" />
            <h2 className="text-3xl sm:text-4xl font-bold">What I Am Working On</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            {skills.map((skill) => {
              const Icon = skill.icon;
              return (
                <article
                  key={skill.title}
                  className="p-6 rounded-2xl bg-gray-950 border border-gray-800 hover:border-gray-600 hover:-translate-y-1 transition-all"
                >
                  <div className="w-11 h-11 rounded-xl bg-gray-900 border border-gray-700 flex items-center justify-center mb-4">
                    <Icon size={18} />
                  </div>
                  <h3 className="text-xl font-semibold">{skill.title}</h3>
                  <p className="text-gray-400 mt-3 leading-relaxed">{skill.description}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="px-6 sm:px-8 py-16">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold mb-8">Roadmap (Dummy Data)</h2>
          <div className="space-y-4">
            {timeline.map((item) => (
              <div
                key={`${item.year}-${item.title}`}
                className="border border-gray-800 rounded-2xl p-5 sm:p-6 bg-gray-950/60"
              >
                <p className="text-xs tracking-widest uppercase text-gray-500">{item.year}</p>
                <h3 className="text-xl font-semibold mt-1">{item.title}</h3>
                <p className="text-gray-400 mt-2">{item.text}</p>
              </div>
            ))}
          </div>

          <div className="mt-10">
            <Link
              to="/blog"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white text-black font-semibold hover:bg-gray-200 transition-colors"
            >
              Explore Blogs
              <Rocket size={16} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
