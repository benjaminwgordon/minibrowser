import { PrismaClient } from "@prisma/client";
import seedPaints from "./Seeds/PaintSeed/paintSeed";
import seedTechniques from "./Seeds/TechniqueSeed/techniqueSeed";
import seedTools from "./Seeds/ToolSeed/toolSeed";

const prisma = new PrismaClient();
async function main() {
  try {
    await seedPaints();
    await seedTechniques();
    await seedTools();
  } catch (err) {
    console.log(`Error while seeding database: ${err}`);
  }
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
