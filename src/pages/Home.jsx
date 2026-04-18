import { useState } from 'react';
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
  const [filter, setFilter] = useState('todas'); // ✅ Estado do filtro

  useExpiration();

  const targetDateTime = settings
    ? `${settings.raffle_date}T${settings.raffle_time}`
    : null;

  const timeLeft = useCountdown(targetDateTime);

  // ✅ Filtrar tickets baseado no filtro selecionado
  const filteredTickets = tickets.filter(ticket => {
    if (filter === 'disponíveis' || filter === 'disponiveis') {
      return ticket.status === 'available';
    } else if (filter === 'vendidas') {
      return ticket.status === 'paid';
    }
    // 'todas' ou padrão
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

  return (
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
        
        {/* ✅ Passa o filtro e a função de mudar filtro */}
        <RaffleFilters filter={filter} onFilterChange={setFilter} />
        
        {/* ✅ Passa os tickets filtrados */}
        <RaffleGrid tickets={filteredTickets} />
        
        <ReservationForm settings={settings} />
      </motion.div>

      {selectedTickets.length > 0 && (
        <SelectedTicketsBar onReserveClick={scrollToForm} />
      )}
    </div>
  );
}

export default Home;