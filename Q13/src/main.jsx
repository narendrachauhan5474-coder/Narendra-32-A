import React from "react";
import { createRoot } from "react-dom/client";
import "./style.css";

const projects = [
  { number: "01", name: "Task Garden", description: "A simple space to organize small daily goals.", tags: ["React", "UI"] },
  { number: "02", name: "City Notes", description: "A guide to favorite places, collected one visit at a time.", tags: ["Design", "Web"] },
  { number: "03", name: "Study Buddy", description: "A focused timer and notes tool for better study sessions.", tags: ["JavaScript", "Product"] }
];

function App() {
  return (
    <>
      <header className="nav"><a href="#top" className="logo">KM<span>.</span></a><nav><a href="#work">Work</a><a href="#about">About</a><a href="#contact">Contact</a></nav></header>
      <main id="top">
        <section className="hero">
          <p className="eyebrow">Hello, I’m a developer in the making</p>
          <h1>Thoughtful ideas,<br /><em>made for the web.</em></h1>
          <p className="intro">I enjoy building clear, useful digital experiences and learning something new with every project.</p>
          <a className="button" href="#work">Explore my work <span aria-hidden="true">↓</span></a>
          <div className="orb" aria-hidden="true"><span>curious<br />by nature</span></div>
        </section>
        <section id="work" className="work">
          <div className="section-title"><p className="eyebrow">A few things I’ve made</p><h2>Selected work</h2></div>
          <div className="project-list">{projects.map((project) => <article className="project" key={project.number}><span className="number">{project.number}</span><div><h3>{project.name}</h3><p>{project.description}</p><div className="tags">{project.tags.map((tag) => <span key={tag}>{tag}</span>)}</div></div><span className="arrow" aria-hidden="true">↗</span></article>)}</div>
        </section>
        <section id="about" className="about"><p className="eyebrow">A little about me</p><h2>Always learning,<br />always making.</h2><p>I’m growing my skills in frontend development, design, and the details that make a website feel welcoming. This portfolio is a small snapshot of that journey.</p></section>
        <section id="contact" className="contact"><p className="eyebrow">Have a project in mind?</p><h2>Let’s make<br /><em>something good.</em></h2><a href="mailto:hello@example.com">hello@example.com ↗</a></section>
      </main>
      <footer>© {new Date().getFullYear()} · Built with React</footer>
    </>
  );
}

createRoot(document.getElementById("root")).render(<App />);
