export const generateReservationMessage = (name, ticketNumbers, totalAmount, adminName) => {
  const ticketsText = ticketNumbers.length === 1
    ? `a cota ${ticketNumbers[0]}`
    : `as cotas ${ticketNumbers.join(', ')}`;

  const message = `Oi ${adminName}, sou ${name}, reservei ${ticketsText} da rifa do violão (R$${totalAmount.toFixed(2)}). Vou enviar o comprovante Pix agora.`;

  return encodeURIComponent(message);
};

export const generateChargeMessage = (name, ticketNumbers, totalAmount) => {
  const ticketsText = ticketNumbers.length === 1
    ? `a cota ${ticketNumbers[0]}`
    : `as cotas ${ticketNumbers.join(', ')}`;

  const message = `Oi ${name}, tudo bem? Vi aqui que ${ticketsText} da rifa do violão ainda estão pendentes no valor de R$${totalAmount.toFixed(2)}. Me manda o comprovante Pix assim que conseguir 😊`;

  return encodeURIComponent(message);
};

export const openWhatsApp = (phone, message) => {
  const cleanPhone = phone.replace(/\D/g, '');
  const url = `https://wa.me/${cleanPhone}?text=${message}`;
  window.open(url, '_blank');
};