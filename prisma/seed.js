const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const tagPalette = [
  { name: "Work", color: "#94A3B8" },
  { name: "Personal", color: "#CBD5F5" },
  { name: "Urgent", color: "#FCA5A5" },
  { name: "Follow-up", color: "#FDE68A" },
  { name: "Idea", color: "#86EFAC" }
];

const taskTitles = [
  "Draft weekly plan",
  "Review pull requests",
  "Prepare demo notes",
  "Clean up inbox",
  "Schedule one-on-one",
  "Refine onboarding checklist",
  "Write sprint recap",
  "Plan backlog grooming",
  "Update roadmap notes",
  "Send status update"
];

async function main() {
  const user = await prisma.user.create({
    data: {
      email: "demo@todo.local"
    }
  });

  const tags = await Promise.all(
    tagPalette.map((tag) =>
      prisma.tag.create({
        data: {
          userId: user.id,
          name: tag.name,
          color: tag.color
        }
      })
    )
  );

  const tasks = await Promise.all(
    taskTitles.map((title, index) =>
      prisma.task.create({
        data: {
          userId: user.id,
          title,
          status: index % 4 === 0 ? "DONE" : "TODO",
          dueDate: index % 3 === 0 ? new Date(Date.now() + index * 86400000) : null
        }
      })
    )
  );

  await Promise.all(
    tasks.map((task, index) => {
      const tag = tags[index % tags.length];
      const secondary = tags[(index + 2) % tags.length];

      return prisma.taskTag.createMany({
        data: [
          { taskId: task.id, tagId: tag.id },
          { taskId: task.id, tagId: secondary.id }
        ],
        skipDuplicates: true
      });
    })
  );
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
