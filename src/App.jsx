import React, { useState, useEffect, useMemo } from 'react';
import { 
  Search, Calendar, MapPin, Clock, Ticket, 
  ShoppingCart, ChevronLeft, CheckCircle2,
  Trash2, CreditCard, Music, User, Sun, Moon
} from 'lucide-react';

// --- MOCK DATA ---
const CONCERTS = [
  { 
    id: 1, 
    artist: "The Midnight Echo", 
    tour: "Neon Nights Tour", 
    date: "Jun 15, 2026", 
    time: "20:00", 
    venue: "Starlight Arena, Dhaka", 
    price: 2500, 
    image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=800&q=80", 
    available: 120,
    description: "Experience the mesmerizing synth-pop sounds of The Midnight Echo live. Their Neon Nights Tour brings an immersive visual and auditory experience you won't forget."
  },
  { 
    id: 2, 
    artist: "Aura & The Waves", 
    tour: "Oceanic Symphony", 
    date: "Jul 22, 2026", 
    time: "19:30", 
    venue: "National Theatre, Dhaka", 
    price: 1500, 
    image: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=800&q=80", 
    available: 50,
    description: "Join Aura & The Waves for a special acoustic evening. Let their soulful melodies and beautiful harmonies wash over you in this intimate setting."
  },
  { 
    id: 3, 
    artist: "Electric Horizon", 
    tour: "Voltage 2026", 
    date: "Aug 05, 2026", 
    time: "21:00", 
    venue: "Army Stadium, Dhaka", 
    price: 3500, 
    image: "https://images.unsplash.com/photo-1619229666372-3c26c399a4cb?auto=format&fit=crop&w=800&q=80", 
    available: 300,
    description: "Get ready to jump! Electric Horizon is bringing the heaviest drops and highest energy. Not for the faint of heart."
  },
  { 
    id: 4, 
    artist: "Shironamhin", 
    tour: "Botanical Sessions", 
    date: "Aug 18, 2026", 
    time: "18:00", 
    venue: "Ramna Park, Dhaka", 
    price: 800, 
    image: "https://images.unsplash.com/photo-1735069183448-0c211d61a3fa?auto=format&fit=crop&w=800&q=80", 
    available: 15,
    description: "An enchanting evening under the stars. Shironamhin performs their latest indie-folk hits surrounded by nature. Limited capacity."
  },
];

export default function App() {
  // --- STATE ---
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [currentView, setCurrentView] = useState('home'); // home, details, cart, tickets
  const [selectedConcert, setSelectedConcert] = useState(null);
  const [cart, setCart] = useState([]);
  const [purchasedTickets, setPurchasedTickets] = useState([]);
  const [toastMessage, setToastMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // --- ACTIONS ---
  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const navigateTo = (view, concert = null) => {
    setCurrentView(view);
    if (concert) setSelectedConcert(concert);
    window.scrollTo(0, 0);
  };

  const addToCart = (concert, quantity) => {
    setCart(prev => {
      const existing = prev.find(item => item.concert.id === concert.id);
      if (existing) {
        return prev.map(item => 
          item.concert.id === concert.id 
            ? { ...item, quantity: item.quantity + quantity } 
            : item
        );
      }
      return [...prev, { concert, quantity }];
    });
    showToast(`Added ${quantity} ticket(s) to cart`);
  };

  const removeFromCart = (concertId) => {
    setCart(prev => prev.filter(item => item.concert.id !== concertId));
  };

  const updateCartQuantity = (concertId, delta) => {
    setCart(prev => prev.map(item => {
      if (item.concert.id === concertId) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const checkout = () => {
    const newTickets = [];
    cart.forEach(item => {
      for (let i = 0; i < item.quantity; i++) {
        newTickets.push({
          id: `TKT-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
          concert: item.concert,
          purchaseDate: new Date().toLocaleDateString(),
          seat: `GA-${Math.floor(Math.random() * 500) + 1}`
        });
      }
    });

    setPurchasedTickets(prev => [...newTickets, ...prev]);
    setCart([]);
    showToast('Purchase successful! Enjoy the concert.');
    navigateTo('tickets');
  };

  const cartTotal = cart.reduce((sum, item) => sum + (item.concert.price * item.quantity), 0);
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // --- STYLING HELPERS ---
  const themeClass = isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900';
  const navClass = isDarkMode ? 'bg-gray-900/95 border-gray-800' : 'bg-white/95 border-gray-200';
  const cardClass = isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200 shadow-sm';
  const inputClass = isDarkMode ? 'bg-gray-900 border-gray-600 text-white focus:ring-indigo-500' : 'bg-white border-gray-300 text-gray-900 focus:ring-indigo-600';
  const mutedText = isDarkMode ? 'text-gray-400' : 'text-gray-500';

  const filteredConcerts = useMemo(() => {
    return CONCERTS.filter(c => 
      c.artist.toLowerCase().includes(searchQuery.toLowerCase()) || 
      c.venue.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-300 ${themeClass}`}>
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(15px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        .animate-fade-in-up { animation: fadeInUp 0.4s ease-out forwards; }
        .animate-fade-in { animation: fadeIn 0.5s ease-out forwards; }
      `}} />

      {/* NAVBAR */}
      <nav className={`sticky top-0 z-40 backdrop-blur-sm border-b transition-colors duration-300 ${navClass}`}>
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <button 
            onClick={() => navigateTo('home')} 
            className="flex items-center gap-2 text-indigo-500 hover:text-indigo-400 transition-colors"
          >
            <div className="bg-indigo-600 p-1.5 rounded-lg">
              <Music size={24} className="text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight hidden sm:block">VibeTickets</span>
          </button>

          <div className="flex items-center gap-1 sm:gap-4">
            <button 
              onClick={toggleTheme}
              className={`p-2 rounded-lg transition-colors ${isDarkMode ? 'hover:bg-gray-800 text-yellow-400' : 'hover:bg-gray-100 text-gray-600'}`}
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            <button 
              onClick={() => navigateTo('tickets')}
              className={`px-3 py-2 rounded-lg flex items-center gap-2 transition-colors ${currentView === 'tickets' ? (isDarkMode ? 'bg-gray-800 text-indigo-400' : 'bg-indigo-50 text-indigo-600') : (isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-indigo-600')}`}
            >
              <Ticket size={20} />
              <span className="hidden sm:block font-medium">My Tickets</span>
            </button>
            
            <button 
              onClick={() => navigateTo('cart')}
              className={`px-3 py-2 rounded-lg flex items-center gap-2 transition-colors relative ${currentView === 'cart' ? (isDarkMode ? 'bg-gray-800 text-indigo-400' : 'bg-indigo-50 text-indigo-600') : (isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-indigo-600')}`}
            >
              <ShoppingCart size={20} />
              <span className="hidden sm:block font-medium">Cart</span>
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-indigo-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                  {cartItemCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </nav>
      
      <main className="flex-1 w-full max-w-6xl mx-auto px-4 pt-8">
        {currentView === 'home' && (
          <div className="space-y-8 pb-12 animate-fade-in">
            {/* HERO SECTION */}
            <section className={`relative rounded-3xl overflow-hidden border transition-all duration-500 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-indigo-600 border-transparent shadow-xl'}`}>
              <div className={`absolute inset-0 z-10 bg-gradient-to-r ${isDarkMode ? 'from-black/90 to-transparent' : 'from-indigo-900/90 via-indigo-900/40 to-transparent'}`}></div>
              <img 
                src="https://images.unsplash.com/photo-1515175192010-cf3250992719?auto=format&fit=crop&w=1200&q=80" 
                alt="Concert Experience" 
                className={`w-full h-64 sm:h-96 object-cover ${isDarkMode ? 'opacity-50' : 'opacity-70'}`}
              />
              <div className="absolute inset-0 z-20 flex flex-col justify-center p-6 sm:p-12">
                <h1 className="text-3xl sm:text-5xl font-bold mb-4 max-w-2xl leading-tight text-white">
                  Get your tickets for the <span className="text-indigo-300 underline underline-offset-4 decoration-indigo-300/40">hottest</span> concerts in town.
                </h1>
                <div className="relative max-w-md mt-4">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={20} />
                  <input 
                    type="text" 
                    placeholder="Search artists or venues..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-white/10 backdrop-blur-md border border-white/20 text-white pl-12 pr-4 py-3.5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-white/50 transition-all placeholder-gray-300"
                  />
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-6">Trending Concerts</h2>
              {filteredConcerts.length === 0 ? (
                <div className={`text-center py-12 rounded-2xl border border-dashed ${isDarkMode ? 'border-gray-700 text-gray-500' : 'border-gray-300 text-gray-400'}`}>
                  <Music size={48} className="mx-auto mb-4 opacity-50" />
                  <p className="text-lg">No concerts found for "{searchQuery}".</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredConcerts.map(concert => (
                    <div 
                      key={concert.id} 
                      onClick={() => navigateTo('details', concert)}
                      className={`group rounded-2xl overflow-hidden border transition-all cursor-pointer hover:-translate-y-1 hover:shadow-xl ${cardClass}`}
                    >
                      <div className="relative h-56 overflow-hidden">
                        <div className="absolute top-4 right-4 bg-black/70 backdrop-blur text-white font-bold px-3 py-1.5 rounded-xl z-10 border border-white/10">
                          ৳{concert.price}
                        </div>
                        <img 
                          src={concert.image} 
                          alt={concert.artist} 
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                      </div>
                      <div className="p-6">
                        <div className="text-xs font-bold text-indigo-500 tracking-widest uppercase mb-1">{concert.tour}</div>
                        <h3 className="text-xl font-bold mb-4">{concert.artist}</h3>
                        <div className={`space-y-2 text-sm ${mutedText}`}>
                          <div className="flex items-center gap-2">
                            <Calendar size={16} />
                            <span>{concert.date}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin size={16} />
                            <span className="truncate">{concert.venue}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>
        )}

        {currentView === 'details' && selectedConcert && (
          <div className="pb-12 animate-fade-in">
            <button 
              onClick={() => navigateTo('home')}
              className={`flex items-center gap-2 mb-6 transition-colors ${mutedText} hover:text-indigo-500`}
            >
              <ChevronLeft size={20} />
              <span>Back to Home</span>
            </button>
            <DetailsContent 
              concert={selectedConcert} 
              isDarkMode={isDarkMode} 
              cardClass={cardClass} 
              mutedText={mutedText} 
              onAddToCart={addToCart} 
            />
          </div>
        )}

        {currentView === 'cart' && (
          <div className="max-w-4xl mx-auto pb-12 animate-fade-in">
            <h2 className="text-3xl font-bold mb-8">Shopping Cart</h2>
            <CartContent 
              cart={cart} 
              isDarkMode={isDarkMode} 
              cardClass={cardClass} 
              mutedText={mutedText} 
              onUpdateQty={updateCartQuantity}
              onRemove={removeFromCart}
              onCheckout={checkout}
              total={cartTotal}
              onExplore={() => navigateTo('home')}
            />
          </div>
        )}

        {currentView === 'tickets' && (
          <div className="max-w-4xl mx-auto pb-12 animate-fade-in">
            <h2 className="text-3xl font-bold mb-8">Purchased Tickets</h2>
            <TicketsContent 
              tickets={purchasedTickets} 
              isDarkMode={isDarkMode} 
              mutedText={mutedText} 
            />
          </div>
        )}
      </main>

      <Footer isDarkMode={isDarkMode} />
      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-indigo-600 text-white px-6 py-3 rounded-full shadow-xl flex items-center gap-2 z-50 animate-fade-in-up">
          <CheckCircle2 size={20} />
          <span className="font-medium">{toastMessage}</span>
        </div>
      )}
    </div>
  );
}

// --- SUB-COMPONENTS ---

const DetailsContent = ({ concert, isDarkMode, cardClass, mutedText, onAddToCart }) => {
  const [quantity, setQuantity] = useState(1);
  return (
    <div className={`rounded-3xl overflow-hidden border flex flex-col md:flex-row ${cardClass}`}>
      <div className="w-full md:w-1/2 h-80 md:h-auto">
        <img src={concert.image} alt={concert.artist} className="w-full h-full object-cover" />
      </div>
      <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col">
        <div className="flex-1">
          <span className="text-sm font-bold text-indigo-500 tracking-widest uppercase">{concert.tour}</span>
          <h1 className="text-4xl font-black mt-2 mb-6">{concert.artist}</h1>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            <div className={`p-4 rounded-2xl border ${isDarkMode ? 'bg-gray-900 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
              <Calendar size={20} className="text-indigo-500 mb-2" />
              <div className={`text-xs uppercase font-bold tracking-tighter ${mutedText}`}>Date</div>
              <div className="font-bold">{concert.date}</div>
            </div>
            <div className={`p-4 rounded-2xl border ${isDarkMode ? 'bg-gray-900 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
              <Clock size={20} className="text-indigo-500 mb-2" />
              <div className={`text-xs uppercase font-bold tracking-tighter ${mutedText}`}>Time</div>
              <div className="font-bold">{concert.time}</div>
            </div>
            <div className={`p-4 rounded-2xl border sm:col-span-2 ${isDarkMode ? 'bg-gray-900 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
              <MapPin size={20} className="text-indigo-500 mb-2" />
              <div className={`text-xs uppercase font-bold tracking-tighter ${mutedText}`}>Venue</div>
              <div className="font-bold">{concert.venue}</div>
            </div>
          </div>
          <p className={`${mutedText} leading-relaxed`}>{concert.description}</p>
        </div>
        <div className={`mt-8 p-6 rounded-2xl border ${isDarkMode ? 'bg-gray-900 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
          <div className="flex items-center justify-between mb-6">
            <div className="text-3xl font-black text-indigo-500">৳{(concert.price * quantity).toLocaleString()}</div>
            <div className={`flex items-center border rounded-xl overflow-hidden ${isDarkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-300 bg-white'}`}>
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-4 py-2 hover:bg-indigo-500 hover:text-white transition-colors">-</button>
              <span className="w-10 text-center font-bold">{quantity}</span>
              <button onClick={() => setQuantity(quantity + 1)} className="px-4 py-2 hover:bg-indigo-500 hover:text-white transition-colors">+</button>
            </div>
          </div>
          <button onClick={() => onAddToCart(concert, quantity)} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-3 transition-transform active:scale-95">
            <ShoppingCart size={20} /> Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

const CartContent = ({ cart, isDarkMode, cardClass, mutedText, onUpdateQty, onRemove, onCheckout, total, onExplore }) => {
  if (cart.length === 0) return (
    <div className={`text-center py-20 rounded-3xl border border-dashed ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
      <ShoppingCart size={64} className={`mx-auto mb-6 ${mutedText} opacity-30`} />
      <h3 className="text-xl font-bold mb-2">Your cart is empty</h3>
      <button onClick={onExplore} className="text-indigo-500 font-bold hover:underline">Explore Concerts</button>
    </div>
  );
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-4">
        {cart.map((item) => (
          <div key={item.concert.id} className={`p-4 rounded-2xl border flex flex-col sm:flex-row gap-6 items-center ${cardClass}`}>
            <img src={item.concert.image} className="w-24 h-24 rounded-xl object-cover" alt="" />
            <div className="flex-1 text-center sm:text-left">
              <h4 className="font-bold text-lg">{item.concert.artist}</h4>
              <p className={`text-sm ${mutedText}`}>{item.concert.date} • {item.concert.venue}</p>
              <div className="mt-2 flex items-center justify-center sm:justify-start gap-4">
                <div className={`flex items-center border rounded-lg overflow-hidden ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                  <button onClick={() => onUpdateQty(item.concert.id, -1)} className="px-2 py-1 hover:bg-indigo-500 hover:text-white transition-colors">-</button>
                  <span className="w-8 text-center text-xs font-bold">{item.quantity}</span>
                  <button onClick={() => onUpdateQty(item.concert.id, 1)} className="px-2 py-1 hover:bg-indigo-500 hover:text-white transition-colors">+</button>
                </div>
                <span className="font-bold">৳{(item.concert.price * item.quantity).toLocaleString()}</span>
              </div>
            </div>
            <button onClick={() => onRemove(item.concert.id)} className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors">
              <Trash2 size={20} />
            </button>
          </div>
        ))}
      </div>
      <div className={`p-6 rounded-3xl border h-fit ${cardClass}`}>
        <h3 className="font-bold text-xl mb-6 text-center lg:text-left">Summary</h3>
        <div className={`space-y-4 text-sm pb-6 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <div className="flex justify-between">
            <span className={mutedText}>Subtotal</span>
            <span className="font-bold">৳{total.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span className={mutedText}>Booking Fee (5%)</span>
            <span className="font-bold">৳{(total * 0.05).toLocaleString()}</span>
          </div>
        </div>
        <div className="flex justify-between py-6">
          <span className="font-bold text-lg">Total</span>
          <span className="font-black text-2xl text-indigo-500">৳{(total * 1.05).toLocaleString()}</span>
        </div>
        <button onClick={onCheckout} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2">
          <CreditCard size={18} /> Complete Purchase
        </button>
      </div>
    </div>
  );
};

const TicketsContent = ({ tickets, isDarkMode, mutedText }) => {
  if (tickets.length === 0) return (
    <div className={`text-center py-20 rounded-3xl border border-dashed ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
      <Ticket size={64} className={`mx-auto mb-6 ${mutedText} opacity-30`} />
      <p className={mutedText}>You haven't bought any tickets yet.</p>
    </div>
  );
  return (
    <div className="grid gap-6">
      {tickets.map((ticket, i) => (
        <div key={i} className="flex flex-col md:flex-row rounded-3xl overflow-hidden bg-white text-gray-900 shadow-2xl border border-gray-100">
          <div className="md:w-1/3 relative h-40 md:h-auto">
            <img src={ticket.concert.image} className="w-full h-full object-cover" alt="" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-6">
              <h4 className="text-white font-bold text-xl">{ticket.concert.artist}</h4>
            </div>
          </div>
          <div className="md:w-2/3 p-6 flex border-l-2 border-dashed border-gray-200">
            <div className="flex-1">
              <span className="text-[10px] font-black uppercase text-indigo-600 tracking-widest">Entry Pass</span>
              <h3 className="text-2xl font-black mb-4 truncate">{ticket.concert.tour}</h3>
              <div className="grid grid-cols-2 gap-y-4 text-sm">
                <div>
                  <p className="text-xs text-gray-400 uppercase font-bold">Date</p>
                  <p className="font-bold">{ticket.concert.date}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 uppercase font-bold">Seat</p>
                  <p className="font-bold">{ticket.seat}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-xs text-gray-400 uppercase font-bold">Venue</p>
                  <p className="font-bold">{ticket.concert.venue}</p>
                </div>
              </div>
            </div>
            <div className="w-24 flex flex-col items-center justify-center border-l border-gray-100 ml-4 pl-4">
              <div className="w-16 h-16 bg-gray-50 flex items-center justify-center p-1 mb-2">
                <div className="grid grid-cols-4 gap-0.5 w-full h-full opacity-70">
                  {Array.from({length: 16}).map((_, j) => (
                    <div key={j} className={`bg-black ${Math.random() > 0.5 ? 'opacity-100' : 'opacity-10'}`}></div>
                  ))}
                </div>
              </div>
              <span className="text-[8px] font-mono text-gray-400 uppercase">{ticket.id}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

const Footer = ({ isDarkMode }) => (
  <footer className={`py-6 border-t transition-colors duration-300 ${isDarkMode ? 'bg-gray-900 border-gray-800 text-gray-500' : 'bg-white border-gray-200 text-gray-400'}`}>
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
      <div className="flex items-center gap-2">
        <Music size={18} className="text-indigo-500" />
        <span className={`text-lg font-black tracking-tighter ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>VibeTickets</span>
        <span className="hidden sm:inline text-[10px] uppercase font-bold tracking-widest ml-4">© {new Date().getFullYear()}</span>
      </div>
      
      <div className="flex items-center gap-6 text-[10px] font-bold uppercase tracking-widest">
        <a href="#" className="hover:text-indigo-500 transition-colors">Privacy</a>
        <a href="#" className="hover:text-indigo-500 transition-colors">Terms</a>
        <a href="#" className="hover:text-indigo-500 transition-colors">Help</a>
      </div>
    </div>
  </footer>
);