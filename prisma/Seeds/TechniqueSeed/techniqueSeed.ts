import { PrismaClient, Technique } from "@prisma/client";
const prisma = new PrismaClient();
import * as fs from "fs";
import * as path from "path";

const techniqueSeedDatasource: Technique[] = [
  {
    id: -1,
    name: "Base",
    iconSVG: fs.readFileSync(path.resolve(__dirname, "./Base.svg"), {
      encoding: "utf-8",
    }),
  },
  {
    id: -1,
    name: "Blend",
    iconSVG: fs.readFileSync(path.resolve(__dirname, "./Blend.svg"), {
      encoding: "utf-8",
    }),
  },
  {
    id: -1,
    name: "Edge Highlight",
    iconSVG: fs.readFileSync(path.resolve(__dirname, "./EdgeHighlight.svg"), {
      encoding: "utf-8",
    }),
  },
  {
    id: -1,
    name: "Layer",
    iconSVG: fs.readFileSync(path.resolve(__dirname, "./Layer.svg"), {
      encoding: "utf-8",
    }),
  },
];

export default async function seedTechniques() {
  for (const seedTechnique of techniqueSeedDatasource) {
    await prisma.technique.upsert({
      where: {
        name: seedTechnique.name,
      },
      update: {
        name: seedTechnique.name,
        iconSVG: seedTechnique.iconSVG,
      },
      create: {
        name: seedTechnique.name,
        iconSVG: seedTechnique.iconSVG,
      },
    });
  }
}
