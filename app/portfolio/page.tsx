import type { Metadata } from "next";
import { ProjectsPortfolio } from "@/components/ProjectsPortfolio";

export const metadata: Metadata = {
  title: "Projetos | Move Social",
  description: "Projetos de impacto social desenvolvidos pela Move Social."
};

export default function PortfolioPage() {
  return <ProjectsPortfolio />;
}
