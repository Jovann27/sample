#!/usr/bin/env node
// Migration script: normalize skills for existing users
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/userSchema.js';

dotenv.config({ path: process.env.NODE_ENV === 'production' ? '.env' : '../.env' });

const MONGO = process.env.MONGO_URI || 'mongodb://localhost:27017/skillconnect';

async function run() {
  const argv = process.argv.slice(2);
  const dry = argv.includes('--dry-run');
  const limitArgIndex = argv.indexOf('--limit');
  const limit = limitArgIndex >= 0 ? parseInt(argv[limitArgIndex + 1]) : null;

  await mongoose.connect(MONGO, { useNewUrlParser: true, useUnifiedTopology: true });
  console.log('Connected to DB');

  const query = {};
  const users = await User.find(query).limit(limit || 0);
  let updated = 0;
  for (const u of users) {
    const skills = (u.skills || []).map(s => s.toString().trim().toLowerCase()).filter(Boolean);
    const unique = [...new Set(skills)];
    const same = JSON.stringify(unique) === JSON.stringify(u.skills || []);
    if (!same) {
      console.log(`User ${u._id}:`, 'before=', u.skills, 'after=', unique);
      if (!dry) {
        u.skills = unique;
        await u.save();
        updated++;
      }
    }
  }

  if (dry) console.log('Dry run complete. No changes were saved.');
  else console.log(`Updated ${updated} users`);
  process.exit(0);
}

run().catch(err => { console.error(err); process.exit(1); });
