import mongoose from 'mongoose';

const SettingsSchema = new mongoose.Schema({
  heroText: { type: String, default: 'I Create Thumbnails That Get Clicks' },
  heroSubtitle: { type: String, default: 'Helping YouTubers increase CTR with high-impact, cinematic visuals that turn scrollers into subscribers.' },
  socialLinks: {
    discord: { type: String, default: 'lmaomeet' },
    behance: { type: String, default: 'https://www.behance.net/meetzanzmera' },
    fiverr: { type: String, default: 'https://www.fiverr.com/sellers/meetfx/edit' }
  },
  stats: {
    designs: { type: Number, default: 100 },
    clients: { type: Number, default: 3 },
    experience: { type: Number, default: 1 }
  }
}, { timestamps: true });

export default mongoose.models.Settings || mongoose.model('Settings', SettingsSchema);
