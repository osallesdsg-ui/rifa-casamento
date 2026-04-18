-- 1. Configurações
CREATE TABLE IF NOT EXISTS settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  raffle_date DATE NOT NULL,
  raffle_time TIME NOT NULL,
  pix_key TEXT NOT NULL,
  admin_name TEXT NOT NULL,
  admin_whatsapp TEXT NOT NULL,
  ticket_price DECIMAL(10,2) DEFAULT 15.00,
  total_tickets INTEGER DEFAULT 300,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Compradores
CREATE TABLE IF NOT EXISTS buyers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  whatsapp TEXT NOT NULL,
  total_amount DECIMAL(10,2) DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'canceled')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Cotas
CREATE TABLE IF NOT EXISTS tickets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  number INTEGER NOT NULL UNIQUE CHECK (number BETWEEN 1 AND 300),
  status TEXT NOT NULL DEFAULT 'available' CHECK (status IN ('available', 'pending', 'paid')),
  buyer_id UUID REFERENCES buyers(id),
  reserved_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Tabela relacional
CREATE TABLE IF NOT EXISTS buyer_tickets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  buyer_id UUID REFERENCES buyers(id) ON DELETE CASCADE,
  ticket_id UUID REFERENCES tickets(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(buyer_id, ticket_id)
);

-- Inserção segura de configurações
INSERT INTO settings (raffle_date, raffle_time, pix_key, admin_name, admin_whatsapp, ticket_price, total_tickets)
VALUES ('2026-08-15', '20:00:00', 'sua-chave-pix-aqui', 'Samuel', '+5511999999999', 15.00, 300)
ON CONFLICT (id) DO NOTHING;

-- Gerar 300 cotas apenas se não existirem
DO $$
BEGIN
  FOR i IN 1..300 LOOP
    INSERT INTO tickets (number, status)
    SELECT i, 'available'
    WHERE NOT EXISTS (SELECT 1 FROM tickets WHERE number = i);
  END LOOP;
END $$;

-- Habilitar Row Level Security
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE buyers ENABLE ROW LEVEL SECURITY;
ALTER TABLE buyer_tickets ENABLE ROW LEVEL SECURITY;

-- Políticas de acesso (DROP + CREATE para evitar erro de sintaxe)
DROP POLICY IF EXISTS "Public read settings" ON settings;
CREATE POLICY "Public read settings" ON settings FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read tickets" ON tickets;
CREATE POLICY "Public read tickets" ON tickets FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read buyers" ON buyers;
CREATE POLICY "Public read buyers" ON buyers FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read buyer_tickets" ON buyer_tickets;
CREATE POLICY "Public read buyer_tickets" ON buyer_tickets FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public write settings" ON settings;
CREATE POLICY "Public write settings" ON settings FOR ALL USING (true);

DROP POLICY IF EXISTS "Public write tickets" ON tickets;
CREATE POLICY "Public write tickets" ON tickets FOR ALL USING (true);

DROP POLICY IF EXISTS "Public write buyers" ON buyers;
CREATE POLICY "Public write buyers" ON buyers FOR ALL USING (true);

DROP POLICY IF EXISTS "Public write buyer_tickets" ON buyer_tickets;
CREATE POLICY "Public write buyer_tickets" ON buyer_tickets FOR ALL USING (true);