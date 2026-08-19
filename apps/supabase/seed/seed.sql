-- NexusWeb Initial Seed Fixtures
INSERT INTO public.items (slug, name, description, rarity, item_type, asset_url, price_coins, price_gems)
VALUES 
  ('cyber_katana', 'Cyber Katana X', 'Plasma-forged blade for close encounters', 'rare', 'weapon', '/models/weapons/katana.glb', 1200, 50),
  ('void_runner_skin', 'Void Runner', 'Stealth nanofiber tactical suit', 'epic', 'skin', '/models/skins/void_runner.glb', 3500, 150),
  ('neon_glider', 'Neon Glider', 'Anti-gravity tactical drop board', 'legendary', 'vehicle', '/models/vehicles/glider.glb', 10000, 500)
ON CONFLICT (slug) DO NOTHING;