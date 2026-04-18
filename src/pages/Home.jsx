import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { useSettings } from '../hooks/useSettings';
import { useTickets } from '../hooks/useTickets';
import { useBuyers } from '../hooks/useBuyers';
import { useExpiration } from '../hooks/useExpiration';
import { useAppContext } from '../context/AppContext';
import { useCountdown } from '../hooks/useCountdown';

import DynamicBackground from '../components/layout/DynamicBackground';
import HeroSection from '../components/public/HeroSection';
import CountdownSection from '../components/public/CountdownSection';
import StatsCards from '../components/public/StatsCards';
import ProgressBar from '../components/public/ProgressBar';
import GuitarGallery from '../components/public/GuitarGallery';
import RaffleFilters from '../components/public/RaffleFilters';
import RaffleGrid from '../components/public/RaffleGrid';
import SelectedTicketsBar from '../components/public/SelectedTicketsBar';
import ReservationForm from '../components/public/ReservationForm';

function Home() {
  const { settings } = useSettings();
  const { tickets } = useTickets();
  const { buyers } = useBuyers();
  const { selectedTickets } = useAppContext();
  const [filter, setFilter] = useState('todas');

  useExpiration();

  const targetDateTime = settings
    ? `${settings.raffle_date}T${settings.raffle_time}`
    : null;

  const timeLeft = useCountdown(targetDateTime);

  // Filtrar tickets baseado no filtro selecionado
  const filteredTickets = tickets.filter(ticket => {
    if (filter === 'disponíveis' || filter === 'disponiveis') {
      return ticket.status === 'available';
    } else if (filter === 'vendidas') {
      return ticket.status === 'paid';
    }
    return true;
  });

  const stats = {
    paid: tickets.filter(t => t.status === 'paid').length,
    pending: tickets.filter(t => t.status === 'pending').length,
    available: tickets.filter(t => t.status === 'available').length,
    total: 300,
  };

  const ticketPrice = settings?.ticket_price || 15;
  const totalRaised = stats.paid * ticketPrice;
  const goal = 4500;

  const scrollToForm = () => {
    document.getElementById('reservation-form')?.scrollIntoView({ behavior: 'smooth' });
  };

  // Formatar data para SEO
  const formatRaffleDate = () => {
    if (!settings?.raffle_date) return 'agosto de 2026';
    const date = new Date(settings.raffle_date + 'T00:00:00');
    const months = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];
    return `${date.getDate()} de ${months[date.getMonth()]}`;
  };

  return (
    <>
      {/* ✅ SEO Dinâmico com React Helmet */}
      <Helmet>
        <title>Rifa do Violão Eagle • Samuel & Isabela Casamento 2026</title>
        <meta name="description" content={`Participe da rifa do violão Eagle CH888 12 cordas em homenagem ao casamento de Samuel & Isabela. 300 cotas a R$15. Sorteio ${formatRaffleDate()}. Reserve já a sua!`} />
        <meta name="keywords" content="rifa, violão, casamento, Samuel e Isabela, Eagle CH888, sorteio, prêmio, música, 12 cordas, rifacasamento" />
        <meta name="author" content="Samuel & Isabela" />
        <meta name="robots" content="index, follow" />
        
        {/* Open Graph / Facebook / WhatsApp */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://rifa-casamento-violao.vercel.app/" />
        <meta property="og:title" content="🎸 Rifa do Violão • Samuel & Isabela" />
        <meta property="og:description" content={`300 cotas • R$15 cada • Prêmio: Violão Eagle CH888 12 cordas. Sorteio ${formatRaffleDate()}. Participe!`} />
        <meta property="og:image" content="https://rifa-casamento-violao.vercel.app/og-image.jpg" />
        <meta property="og:site_name" content="Rifa Casamento Samuel & Isabela" />
        <meta property="og:locale" content="pt_BR" />
        
        {/* Twitter / X */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content="https://rifa-casamento-violao.vercel.app/" />
        <meta name="twitter:title" content="🎸 Rifa do Violão • Samuel & Isabela" />
        <meta name="twitter:description" content={`Participe da rifa do violão Eagle CH888. 300 cotas a R$15. Sorteio ${formatRaffleDate()}.`} />
        <meta name="twitter:image" content="https://rifa-casamento-violao.vercel.app/og-image.jpg" />
        
        {/* Schema.org / Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Event",
            "name": "Rifa do Violão Eagle • Casamento Samuel & Isabela",
            "description": "Rifa beneficente em homenagem ao casamento de Samuel & Isabela. Prêmio: violão Eagle CH888 12 cordas.",
            "startDate": settings?.raffle_date ? `${settings.raffle_date}T${settings.raffle_time || '20:00'}:00-03:00` : "2026-08-15T20:00:00-03:00",
            "eventStatus": "https://schema.org/EventScheduled",
            "eventAttendanceMode": "https://schema.org/OnlineEventAttendanceMode",
            "organizer": {
              "@type": "Person",
              "name": "Samuel & Isabela"
            },
            "offers": {
              "@type": "Offer",
              "price": ticketPrice.toString(),
              "priceCurrency": "BRL",
              "availability": stats.available > 0 ? "https://schema.org/InStock" : "https://schema.org/SoldOut",
              "url": "https://rifa-casamento-violao.vercel.app"
            }
          })}
        </script>
      </Helmet>

      <div className="min-h-screen bg-dark-500 relative overflow-hidden">
        <DynamicBackground />

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="relative z-10"
        >
          <HeroSection settings={settings} />
          <CountdownSection timeLeft={timeLeft} />
          <StatsCards stats={stats} ticketPrice={ticketPrice} />
          <ProgressBar totalRaised={totalRaised} goal={goal} stats={stats} />
          <GuitarGallery />
          
          <RaffleFilters filter={filter} onFilterChange={setFilter} />
          
          <RaffleGrid tickets={filteredTickets} />
          
          <ReservationForm settings={settings} />
        </motion.div>

        {selectedTickets.length > 0 && (
          <SelectedTicketsBar onReserveClick={scrollToForm} />
        )}
      </div>
    </>
  );
}

export default Home;