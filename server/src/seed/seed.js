const mongoose = require('mongoose');
const path = require('path');

// Load environment variables
require('dotenv').config({ path: path.resolve(__dirname, '../../../.env') });

const connectDB = require('../config/db');
const Roadmap = require('../models/Roadmap');
const Tool = require('../models/Tool');

const roadmapsData = require('./roadmaps.json');
const toolsData = require('./tools.json');

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await connectDB();
    console.log('🌱 Starting database seed...\n');

    // ─── Clear existing data ───────────────────────────────────
    console.log('🗑️  Clearing existing collections...');
    await Roadmap.deleteMany({});
    console.log('   ✓ Roadmaps collection cleared');
    await Tool.deleteMany({});
    console.log('   ✓ Tools collection cleared\n');

    // ─── Seed Roadmaps ─────────────────────────────────────────
    console.log('📚 Seeding roadmaps...');
    const insertedRoadmaps = await Roadmap.insertMany(roadmapsData);
    console.log(`   ✓ ${insertedRoadmaps.length} roadmaps inserted\n`);

    for (const roadmap of insertedRoadmaps) {
      const topicCount = roadmap.sections.reduce(
        (sum, section) => sum + section.topics.length,
        0
      );
      console.log(
        `     - ${roadmap.title} (${roadmap.sections.length} sections, ${topicCount} topics)`
      );
    }
    console.log('');

    // ─── Seed Tools (without alternatives first) ───────────────
    console.log('🛠️  Seeding tools...');

    // Strip alternativeSlugs before insertion (not part of the Mongoose schema)
    const toolsForInsert = toolsData.map(({ alternativeSlugs, ...tool }) => tool);
    const insertedTools = await Tool.insertMany(toolsForInsert);
    console.log(`   ✓ ${insertedTools.length} tools inserted\n`);

    // ─── Resolve alternativeSlugs → ObjectIds ──────────────────
    console.log('🔗 Resolving alternative tool references...');

    // Build a slug → ObjectId lookup map
    const slugToId = {};
    for (const tool of insertedTools) {
      slugToId[tool.slug] = tool._id;
    }

    // Update each tool with resolved alternative ObjectIds
    let resolvedCount = 0;
    for (const toolData of toolsData) {
      const alternativeSlugs = toolData.alternativeSlugs || [];
      if (alternativeSlugs.length === 0) continue;

      const alternativeIds = alternativeSlugs
        .map((slug) => slugToId[slug])
        .filter(Boolean);

      if (alternativeIds.length > 0) {
        await Tool.findOneAndUpdate(
          { slug: toolData.slug },
          { $set: { alternatives: alternativeIds } }
        );
        resolvedCount++;
        console.log(
          `     - ${toolData.name}: linked ${alternativeIds.length} alternatives`
        );
      }
    }

    console.log(`   ✓ ${resolvedCount} tools updated with alternatives\n`);

    // ─── Summary ───────────────────────────────────────────────
    const totalTopics = insertedRoadmaps.reduce(
      (sum, r) =>
        sum + r.sections.reduce((s, sec) => s + sec.topics.length, 0),
      0
    );

    console.log('═══════════════════════════════════════════');
    console.log('✅ Database seeded successfully!');
    console.log('═══════════════════════════════════════════');
    console.log(`   Roadmaps:  ${insertedRoadmaps.length}`);
    console.log(`   Sections:  ${insertedRoadmaps.reduce((s, r) => s + r.sections.length, 0)}`);
    console.log(`   Topics:    ${totalTopics}`);
    console.log(`   Tools:     ${insertedTools.length}`);
    console.log('═══════════════════════════════════════════\n');
  } catch (error) {
    console.error('❌ Seed error:', error.message);
    console.error(error.stack);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('📡 MongoDB disconnected.');
    process.exit(0);
  }
};

seedDatabase();
