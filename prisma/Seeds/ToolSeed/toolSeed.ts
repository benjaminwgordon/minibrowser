import { PrismaClient, Tool } from "@prisma/client";
const prisma = new PrismaClient();
import * as fs from "fs";
import * as path from "path";

const toolSeedDatasource: Tool[] = [
  {
    id: -1,
    name: "Fine Brush",
    iconSVG: fs.readFileSync(path.resolve(__dirname, "./Icon404.svg"), {
      encoding: "utf-8",
    }),
  },
  {
    id: -1,
    name: "Standard Brush",
    iconSVG: fs.readFileSync(path.resolve(__dirname, "./Icon404.svg"), {
      encoding: "utf-8",
    }),
  },
  {
    id: -1,
    name: "Broad Brush",
    iconSVG: fs.readFileSync(path.resolve(__dirname, "./Icon404.svg"), {
      encoding: "utf-8",
    }),
  },
  {
    id: -1,
    name: "Dry Brush",
    iconSVG: fs.readFileSync(path.resolve(__dirname, "./Icon404.svg"), {
      encoding: "utf-8",
    }),
  },
];

export default async function seedTools() {
  for (const seedTool of toolSeedDatasource) {
    await prisma.tool.upsert({
      where: {
        name: seedTool.name,
      },
      update: {
        name: seedTool.name,
        iconSVG: seedTool.iconSVG,
      },
      create: {
        name: seedTool.name,
        iconSVG: seedTool.iconSVG,
      },
    });
  }
}
