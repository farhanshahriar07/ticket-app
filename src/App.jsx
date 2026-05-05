import React, { useState, useEffect } from 'react';
import { 
  Search, Calendar, MapPin, Clock, Ticket, 
  ShoppingCart, ChevronLeft, CheckCircle2,
  Trash2, CreditCard, Music, User
} from 'lucide-react';

// --- MOCK DATA ---
const CONCERTS = [
  { 
    id: 1, 
    artist: "The Midnight Echo", 
    tour: "Neon Nights Tour", 
    date: "Jun 15, 2026", 
    time: "20:00", 
    venue: "Army Stadium, Dhaka", 
    price: 1500, 
    image: "https://images.unsplash.com/photo-1522158637959-30385a09e0da?auto=format&fit=crop&w=800&q=80", 
    available: 120,
    description: "Experience the mesmerizing synth-pop sounds of The Midnight Echo live. Their Neon Nights Tour brings an immersive visual and auditory experience you won't forget."
  },
  { 
    id: 2, 
    artist: "Aura & The Waves", 
    tour: "Oceanic Symphony", 
    date: "Jul 22, 2026", 
    time: "19:30", 
    venue: "TSC, Dhaka University", 
    price: 500, 
    image: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?auto=format&fit=crop&w=800&q=80", 
    available: 50,
    description: "Join Aura & The Waves for a special acoustic evening. Let their soulful melodies and beautiful harmonies wash over you in this intimate setting."
  },
  { 
    id: 3, 
    artist: "Electric Horizon", 
    tour: "Voltage 2026", 
    date: "Aug 05, 2026", 
    time: "21:00", 
    venue: "The Warehouse, Dhaka", 
    price: 2000, 
    image: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=800&q=80", 
    available: 300,
    description: "Get ready to jump! Electric Horizon is bringing the heaviest drops and highest energy to The Warehouse. Not for the faint of heart."
  },
  { 
    id: 4, 
    artist: "Luna's Lullaby", 
    tour: "Botanical Sessions", 
    date: "Aug 18, 2026", 
    time: "18:00", 
    venue: "Botanical Garden, Dhaka", 
    price: 1500, 
    image: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&w=800&q=80", 
    available: 15,
    description: "An enchanting evening under the stars. Luna's Lullaby performs their latest indie-folk hits surrounded by nature. Limited capacity."
  },
];

export default function TicketApp() {
  // --- STATE ---
  const [currentView, setCurrentView] = useState('home'); // home, details, cart, tickets
  const [selectedConcert, setSelectedConcert] = useState(null);
  const [cart, setCart] = useState([]);
  const [purchasedTickets, setPurchasedTickets] = useState([]);
  const [toastMessage, setToastMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // --- ACTIONS ---
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
    // Generate individual tickets for each purchased item
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
    showToast('Checkout successful! Enjoy the show.');
    navigateTo('tickets');
  };

  const cartTotal = cart.reduce((sum, item) => sum + (item.concert.price * item.quantity), 0);
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // --- SUB-COMPONENTS ---

  // 1. Toast Notification
  const Toast = () => {
    if (!toastMessage) return null;
    return (
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-indigo-600 text-white px-6 py-3 rounded-full shadow-lg flex items-center gap-2 z-50 animate-fade-in-up">
        <CheckCircle2 size={20} />
        <span className="font-medium">{toastMessage}</span>
      </div>
    );
  };

  // 2. Navigation Bar
  const Navbar = () => (
    <nav className="sticky top-0 z-40 bg-gray-900/95 backdrop-blur-sm border-b border-gray-800">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <button 
          onClick={() => navigateTo('home')} 
          className="flex items-center gap-2 text-indigo-400 hover:text-indigo-300 transition-colors"
        >
          <div className="bg-indigo-600 p-1.5 rounded-lg">
            <Music size={24} className="text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight text-white hidden sm:block">VibeTickets</span>
        </button>

        <div className="flex items-center gap-1 sm:gap-4">
          <button 
            onClick={() => navigateTo('tickets')}
            className={`px-3 py-2 rounded-lg flex items-center gap-2 transition-colors ${currentView === 'tickets' ? 'bg-gray-800 text-indigo-400' : 'text-gray-300 hover:text-white hover:bg-gray-800'}`}
          >
            <Ticket size={20} />
            <span className="hidden sm:block font-medium">My Tickets</span>
          </button>
          
          <button 
            onClick={() => navigateTo('cart')}
            className={`px-3 py-2 rounded-lg flex items-center gap-2 transition-colors relative ${currentView === 'cart' ? 'bg-gray-800 text-indigo-400' : 'text-gray-300 hover:text-white hover:bg-gray-800'}`}
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
  );

  // 3. Home View
  const HomeView = () => {
    const filteredConcerts = CONCERTS.filter(c => 
      c.artist.toLowerCase().includes(searchQuery.toLowerCase()) || 
      c.venue.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
      <div className="space-y-8 pb-12 animate-fade-in">
        {/* Hero Section */}
        <section className="relative rounded-2xl overflow-hidden bg-gray-800 border border-gray-700">
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900 to-transparent z-10"></div>
          <img 
            src="https://images.unsplash.com/photo-1533174000255-598943ac0800?auto=format&fit=crop&w=1200&q=80" 
            alt="Concert Crowd" 
            className="w-full h-64 sm:h-80 object-cover opacity-50"
          />
          <div className="absolute inset-0 z-20 flex flex-col justify-center p-6 sm:p-12">
            <h1 className="text-3xl sm:text-5xl font-bold text-white mb-4 max-w-2xl leading-tight">
              Discover your next <span className="text-indigo-400">unforgettable</span> live experience.
            </h1>
            <div className="relative max-w-md mt-4">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input 
                type="text" 
                placeholder="Search artists, venues..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-gray-800/80 backdrop-blur border border-gray-600 text-white pl-12 pr-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all placeholder-gray-400"
              />
            </div>
          </div>
        </section>

        {/* Concert List */}
        <section>
          <h2 className="text-2xl font-bold text-white mb-6">Upcoming Shows</h2>
          {filteredConcerts.length === 0 ? (
            <div className="text-center py-12 text-gray-400 bg-gray-800/50 rounded-xl border border-gray-700">
              <Music size={48} className="mx-auto mb-4 opacity-50" />
              <p className="text-lg">No shows found matching your search.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredConcerts.map(concert => (
                <div 
                  key={concert.id} 
                  onClick={() => navigateTo('details', concert)}
                  className="group bg-gray-800 rounded-xl overflow-hidden border border-gray-700 hover:border-indigo-500 transition-all cursor-pointer hover:-translate-y-1 hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-indigo-500/20"
                >
                  <div className="relative h-48 overflow-hidden">
                    <div className="absolute top-3 right-3 bg-gray-900/80 backdrop-blur text-white font-bold px-3 py-1 rounded-lg z-10 border border-gray-700">
                      ৳{concert.price}
                    </div>
                    <img 
                      src={concert.image} 
                      alt={concert.artist} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                  <div className="p-5">
                    <div className="text-xs font-semibold text-indigo-400 tracking-wider uppercase mb-1">
                      {concert.tour}
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3 truncate">{concert.artist}</h3>
                    
                    <div className="space-y-2 text-sm text-gray-300">
                      <div className="flex items-center gap-2">
                        <Calendar size={16} className="text-gray-400" />
                        <span>{concert.date}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin size={16} className="text-gray-400" />
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
    );
  };

  // 4. Concert Details View
  const DetailsView = () => {
    const [quantity, setQuantity] = useState(1);
    if (!selectedConcert) return null;

    return (
      <div className="pb-12 animate-fade-in">
        <button 
          onClick={() => navigateTo('home')}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6"
        >
          <ChevronLeft size={20} />
          <span>Back to browsing</span>
        </button>

        <div className="bg-gray-800 rounded-2xl overflow-hidden border border-gray-700 flex flex-col md:flex-row">
          <div className="w-full md:w-1/2 h-64 md:h-auto relative">
            <img 
              src={selectedConcert.image} 
              alt={selectedConcert.artist} 
              className="w-full h-full object-cover"
            />
          </div>
          
          <div className="w-full md:w-1/2 p-6 md:p-10 flex flex-col justify-between">
            <div>
              <div className="text-sm font-semibold text-indigo-400 tracking-wider uppercase mb-2">
                {selectedConcert.tour}
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">{selectedConcert.artist}</h1>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <div className="flex items-center gap-3 bg-gray-900/50 p-3 rounded-lg border border-gray-700">
                  <Calendar className="text-indigo-400" size={24} />
                  <div>
                    <div className="text-xs text-gray-400">Date</div>
                    <div className="font-medium text-white">{selectedConcert.date}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 bg-gray-900/50 p-3 rounded-lg border border-gray-700">
                  <Clock className="text-indigo-400" size={24} />
                  <div>
                    <div className="text-xs text-gray-400">Time</div>
                    <div className="font-medium text-white">{selectedConcert.time}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 bg-gray-900/50 p-3 rounded-lg border border-gray-700 sm:col-span-2">
                  <MapPin className="text-indigo-400" size={24} />
                  <div>
                    <div className="text-xs text-gray-400">Venue</div>
                    <div className="font-medium text-white">{selectedConcert.venue}</div>
                  </div>
                </div>
              </div>

              <div className="mb-8">
                <h3 className="text-lg font-semibold text-white mb-2">About the event</h3>
                <p className="text-gray-300 leading-relaxed">
                  {selectedConcert.description}
                </p>
              </div>
            </div>

            <div className="bg-gray-900 p-6 rounded-xl border border-gray-700 mt-6">
              <div className="flex items-end justify-between mb-6">
                <div>
                  <div className="text-sm text-gray-400 mb-1">Price per ticket</div>
                  <div className="text-3xl font-bold text-white">৳{selectedConcert.price}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-400 mb-2">Select Quantity</div>
                  <div className="flex items-center bg-gray-800 rounded-lg border border-gray-600 overflow-hidden">
                    <button 
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-4 py-2 hover:bg-gray-700 text-white transition-colors"
                    >-</button>
                    <span className="w-12 text-center font-semibold text-white">{quantity}</span>
                    <button 
                      onClick={() => setQuantity(quantity + 1)}
                      className="px-4 py-2 hover:bg-gray-700 text-white transition-colors"
                    >+</button>
                  </div>
                </div>
              </div>

              <button 
                onClick={() => {
                  addToCart(selectedConcert, quantity);
                  setQuantity(1);
                }}
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all transform hover:scale-[1.02] active:scale-95 shadow-lg shadow-indigo-600/20"
              >
                <ShoppingCart size={20} />
                Add to Cart - ৳{(selectedConcert.price * quantity).toFixed(2)}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // 5. Cart View
  const CartView = () => {
    return (
      <div className="max-w-4xl mx-auto pb-12 animate-fade-in">
        <h2 className="text-3xl font-bold text-white mb-8 flex items-center gap-3">
          <ShoppingCart className="text-indigo-400" />
          Your Cart
        </h2>

        {cart.length === 0 ? (
          <div className="text-center py-16 bg-gray-800 rounded-2xl border border-gray-700">
            <div className="bg-gray-900 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingCart size={40} className="text-gray-600" />
            </div>
            <h3 className="text-2xl font-semibold text-white mb-2">Your cart is empty</h3>
            <p className="text-gray-400 mb-8">Looks like you haven't added any tickets yet.</p>
            <button 
              onClick={() => navigateTo('home')}
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3 px-8 rounded-xl transition-colors"
            >
              Browse Concerts
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {cart.map((item) => (
                <div key={item.concert.id} className="bg-gray-800 rounded-xl p-4 border border-gray-700 flex flex-col sm:flex-row gap-4 items-center sm:items-start relative">
                  <button 
                    onClick={() => removeFromCart(item.concert.id)}
                    className="absolute top-4 right-4 text-gray-500 hover:text-red-400 transition-colors"
                    title="Remove item"
                  >
                    <Trash2 size={20} />
                  </button>
                  
                  <img 
                    src={item.concert.image} 
                    alt={item.concert.artist} 
                    className="w-full sm:w-32 h-32 object-cover rounded-lg"
                  />
                  
                  <div className="flex-1 flex flex-col justify-between h-full w-full">
                    <div>
                      <h4 className="text-lg font-bold text-white pr-8">{item.concert.artist}</h4>
                      <div className="text-sm text-gray-400 mt-1 flex flex-col gap-1">
                        <span className="flex items-center gap-1"><Calendar size={14}/> {item.concert.date}</span>
                        <span className="flex items-center gap-1"><MapPin size={14}/> {item.concert.venue}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center bg-gray-900 rounded-lg border border-gray-600">
                        <button onClick={() => updateCartQuantity(item.concert.id, -1)} className="px-3 py-1 hover:bg-gray-700 text-white">-</button>
                        <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                        <button onClick={() => updateCartQuantity(item.concert.id, 1)} className="px-3 py-1 hover:bg-gray-700 text-white">+</button>
                      </div>
                      <div className="font-bold text-white">
                        ৳{(item.concert.price * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 h-fit sticky top-24">
              <h3 className="text-xl font-bold text-white mb-6 border-b border-gray-700 pb-4">Order Summary</h3>
              
              <div className="space-y-3 mb-6 text-gray-300">
                <div className="flex justify-between">
                  <span>Subtotal ({cartItemCount} items)</span>
                  <span>৳{cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Processing Fee</span>
                  <span>৳{(cartTotal * 0.05).toFixed(2)}</span>
                </div>
              </div>
              
              <div className="border-t border-gray-700 pt-4 mb-8">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-white">Total</span>
                  <span className="text-2xl font-bold text-indigo-400">
                    ৳{(cartTotal * 1.05).toFixed(2)}
                  </span>
                </div>
              </div>

              <button 
                onClick={checkout}
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-transform transform hover:scale-[1.02] shadow-lg shadow-indigo-600/20"
              >
                <CreditCard size={20} />
                Secure Checkout
              </button>
              <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-500">
                 <CheckCircle2 size={14} className="text-emerald-500" /> All transactions are secure and encrypted.
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  // 6. My Tickets View
  const TicketsView = () => {
    return (
      <div className="max-w-4xl mx-auto pb-12 animate-fade-in">
        <h2 className="text-3xl font-bold text-white mb-8 flex items-center gap-3">
          <Ticket className="text-indigo-400" />
          My Tickets
        </h2>

        {purchasedTickets.length === 0 ? (
          <div className="text-center py-16 bg-gray-800 rounded-2xl border border-gray-700">
            <div className="bg-gray-900 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
              <Ticket size={40} className="text-gray-600" />
            </div>
            <h3 className="text-2xl font-semibold text-white mb-2">No tickets yet</h3>
            <p className="text-gray-400 mb-8">Your purchased tickets will appear here.</p>
            <button 
              onClick={() => navigateTo('home')}
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3 px-8 rounded-xl transition-colors"
            >
              Explore Events
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {purchasedTickets.map((ticket, idx) => (
              <div key={idx} className="bg-white rounded-2xl overflow-hidden flex flex-col md:flex-row shadow-xl relative">
                {/* Visual Left Edge Cutouts */}
                <div className="absolute top-1/2 -left-3 -translate-y-1/2 w-6 h-6 bg-gray-900 rounded-full hidden md:block"></div>
                <div className="absolute top-1/2 -right-3 -translate-y-1/2 w-6 h-6 bg-gray-900 rounded-full hidden md:block"></div>

                {/* Ticket Image Side */}
                <div className="md:w-1/3 relative h-40 md:h-auto">
                  <img 
                    src={ticket.concert.image} 
                    alt={ticket.concert.artist} 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-4">
                     <span className="text-white font-bold text-xl">{ticket.concert.artist}</span>
                  </div>
                </div>

                {/* Ticket Details Side */}
                <div className="md:w-2/3 p-6 flex flex-col md:flex-row relative">
                  {/* Dashed Line for Desktop */}
                  <div className="absolute left-0 top-4 bottom-4 w-px border-l-2 border-dashed border-gray-300 hidden md:block"></div>
                  
                  <div className="flex-1 md:pl-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <div className="text-indigo-600 text-xs font-bold uppercase tracking-wider mb-1">General Admission</div>
                        <h3 className="text-2xl font-bold text-gray-900 leading-tight">{ticket.concert.tour}</h3>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-gray-500">Seat</div>
                        <div className="font-bold text-gray-900">{ticket.seat}</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <div className="text-xs text-gray-500 flex items-center gap-1"><Calendar size={12}/> Date</div>
                        <div className="font-semibold text-gray-900">{ticket.concert.date}</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500 flex items-center gap-1"><Clock size={12}/> Time</div>
                        <div className="font-semibold text-gray-900">{ticket.concert.time}</div>
                      </div>
                      <div className="col-span-2">
                        <div className="text-xs text-gray-500 flex items-center gap-1"><MapPin size={12}/> Venue</div>
                        <div className="font-semibold text-gray-900">{ticket.concert.venue}</div>
                      </div>
                    </div>
                  </div>

                  {/* QR Code / Barcode Section */}
                  <div className="md:w-1/4 mt-4 md:mt-0 flex flex-col items-center justify-center border-t md:border-t-0 md:border-l border-dashed border-gray-300 pt-4 md:pt-0 md:pl-4">
                     <div className="bg-gray-100 p-2 rounded-lg mb-2 flex items-center justify-center">
                        {/* Mock QR Code Pattern */}
                        <div className="grid grid-cols-5 gap-1 w-20 h-20 opacity-80">
                           {Array.from({length: 25}).map((_, i) => (
                             <div key={i} className={`w-full h-full ${Math.random() > 0.4 ? 'bg-gray-900' : 'bg-transparent'} ${i===0||i===4||i===20||i===24 ? 'bg-indigo-600 rounded-sm' : ''}`}></div>
                           ))}
                        </div>
                     </div>
                     <span className="text-[10px] font-mono text-gray-500">{ticket.id}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  // 7. Footer Component
  const Footer = () => (
    <footer className="bg-gray-900 border-t border-gray-800 mt-12 py-8 text-center text-gray-500">
      <div className="max-w-6xl mx-auto px-4 flex flex-col items-center gap-4">
        <div className="flex items-center gap-2 text-indigo-400 opacity-80">
          <Music size={20} />
          <span className="font-bold text-lg tracking-tight">VibeTickets</span>
        </div>
        <p className="text-sm">© {new Date().getFullYear()} VibeTickets. All rights reserved.</p>
      </div>
    </footer>
  );

  // --- MAIN RENDER ---
  return (
    <div className="min-h-screen bg-gray-900 font-sans selection:bg-indigo-500/30 flex flex-col">
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in-up { animation: fadeInUp 0.3s ease-out forwards; }
        .animate-fade-in { animation: fadeIn 0.4s ease-out forwards; }
      `}} />

      <Navbar />
      
      <main className="max-w-6xl mx-auto px-4 pt-8 flex-1 w-full">
        {currentView === 'home' && <HomeView />}
        {currentView === 'details' && <DetailsView />}
        {currentView === 'cart' && <CartView />}
        {currentView === 'tickets' && <TicketsView />}
      </main>

      <Footer />

      <Toast />
    </div>
  );
}