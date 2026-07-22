import { useState, useEffect, useRef } from 'react';
import { LostPetReport } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { X, Send, Phone, MessageSquare, ShieldAlert, Heart } from 'lucide-react';

interface ContactModalProps {
  report: LostPetReport;
  onClose: () => void;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'owner';
  text: string;
  timestamp: string;
}

export default function ContactModal({ report, onClose }: ContactModalProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init-1',
      sender: 'owner',
      text: `¡Hola! Soy el dueño de ${report.name}. Muchas gracias por contactarme. ¿Tienes alguna información o lo has visto recientemente? 🐾`,
      timestamp: 'Hace unos momentos',
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isCalling, setIsCalling] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSendMessage = (textToSend: string) => {
    if (!textToSend.trim()) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: 'Ahora mismo',
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');

    // Trigger typing response
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      let replyText = '';

      if (textToSend.toLowerCase().includes('vi') || textToSend.toLowerCase().includes('roma') || textToSend.toLowerCase().includes('condesa') || textToSend.toLowerCase().includes('polanco')) {
        replyText = `¡No puede ser! Es de muchísima ayuda. ¿Podrías decirme exactamente en qué calle o establecimiento lo viste pasar? Voy de inmediato hacia allá. ¡Mil gracias! 🙏🏼`;
      } else if (textToSend.toLowerCase().includes('número') || textToSend.toLowerCase().includes('contacto')) {
        replyText = `Claro, puedes llamarme directamente al número de la publicación: ${report.contactNumber}. ¡Agradezco profundamente tu apoyo!`;
      } else {
        replyText = `Muchísimas gracias por el mensaje y por estar al pendiente. Cualquier detalle, por mínimo que sea, nos ayuda un montón a traer a ${report.name} de vuelta a casa de forma segura.`;
      }

      const ownerMsg: ChatMessage = {
        id: `owner-${Date.now()}`,
        sender: 'owner',
        text: replyText,
        timestamp: 'Ahora mismo',
      };

      setMessages((prev) => [...prev, ownerMsg]);
    }, 1500);
  };

  const quickReplies = [
    `Creo que vi a ${report.name} hace un momento.`,
    '¿Tienes algún número alternativo para contactar?',
    'Estaré muy atento por mi zona si lo llego a ver.',
    '¿De qué color es su collar actualmente?',
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-white rounded-3xl overflow-hidden w-full max-w-md shadow-2xl flex flex-col h-[80vh] max-h-[700px] relative border border-gray-100"
        >
          {/* Header */}
          <div className="bg-primary text-white p-4 flex items-center justify-between shadow-md">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white/20">
                <img
                  className="w-full h-full object-cover"
                  src={report.ownerAvatar || 'https://lh3.googleusercontent.com/aida-public/AB6AXuAGxtnF8_l_m4z3df-J-hvL4j-oGPdKQ0of7Pxef8efL8KlwoPXu5DRohpClHK9tGMkSirzJDDCF-6ek66p0N9NuRf-XaRrNk5ca0Gma7HAO3GSpjn3IEfRO9V_gDvI_8FtCrjiIYmds5VAWn4g2tSpvgRbqko70rmMp5GdF0ySUL-MV4g8JGs1QnVItzlcenKsa-nVr6ZDmznVXyupuxEmr22BKttsFSaOnJRqJyw7Ht09EbF96dTz'}
                  alt={report.ownerName}
                />
              </div>
              <div>
                <h3 className="font-headline font-bold text-sm leading-tight">{report.ownerName}</h3>
                <span className="text-[10px] text-white/80 font-medium">Dueño de {report.name}</span>
              </div>
            </div>

            <div className="flex items-center gap-1">
              {/* Phone call trigger */}
              <button
                onClick={() => setIsCalling(true)}
                className="p-2 hover:bg-white/10 rounded-full transition-colors"
                title="Llamar"
                id="call-owner-btn"
              >
                <Phone className="w-4.5 h-4.5 text-white" />
              </button>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/10 rounded-full transition-colors"
                id="close-chat-btn"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>

          {/* Chat area */}
          <div className="flex-1 bg-gray-50 overflow-y-auto p-4 space-y-4 flex flex-col">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`max-w-[80%] p-3.5 rounded-2xl text-sm leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-primary text-white rounded-br-none self-end shadow-sm'
                    : 'bg-white text-on-surface border border-gray-100 rounded-bl-none self-start shadow-sm'
                }`}
              >
                <p>{msg.text}</p>
                <span className={`text-[9px] block text-right mt-1 font-semibold ${
                  msg.sender === 'user' ? 'text-white/70' : 'text-gray-400'
                }`}>
                  {msg.timestamp}
                </span>
              </div>
            ))}

            {isTyping && (
              <div className="bg-white border border-gray-100 p-3 rounded-2xl rounded-bl-none max-w-[80px] self-start shadow-sm flex justify-center items-center gap-1">
                <span className="w-2 h-2 bg-primary rounded-full animate-bounce"></span>
                <span className="w-2 h-2 bg-primary rounded-full animate-bounce delay-100"></span>
                <span className="w-2 h-2 bg-primary rounded-full animate-bounce delay-200"></span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick replies & suggestions */}
          <div className="p-3 bg-white border-t border-gray-100">
            <span className="text-[10px] font-bold text-gray-400 uppercase block mb-2 tracking-wider">Sugerencias</span>
            <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
              {quickReplies.map((reply) => (
                <button
                  key={reply}
                  onClick={() => handleSendMessage(reply)}
                  className="px-4 py-2 bg-gray-50 hover:bg-primary/5 hover:text-primary whitespace-nowrap border border-gray-200 rounded-full text-xs font-semibold text-gray-600 transition-all duration-200 active:scale-95"
                  id={`suggestion-${reply.substring(0, 10)}`}
                >
                  {reply}
                </button>
              ))}
            </div>
          </div>

          {/* Input form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage(inputText);
            }}
            className="p-3 bg-white border-t border-gray-100 flex gap-2 items-center"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Escribe un mensaje..."
              className="flex-1 p-3.5 bg-gray-50 border border-gray-200 rounded-full outline-none focus:ring-2 focus:ring-primary focus:bg-white text-sm transition-all"
              id="chat-input-text"
            />
            <button
              type="submit"
              disabled={!inputText.trim()}
              className="p-3.5 bg-primary text-white hover:bg-primary-container disabled:opacity-50 rounded-full active:scale-95 transition-all shadow-md"
              id="send-chat-btn"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

          {/* Call simulator modal */}
          {isCalling && (
            <div className="absolute inset-0 bg-primary/95 text-white z-50 flex flex-col items-center justify-between p-12">
              <div className="text-center space-y-2 mt-12 animate-pulse">
                <span className="text-[11px] font-bold tracking-widest uppercase text-white/70">Llamada de PetRescue</span>
                <h3 className="font-headline text-3xl font-extrabold">{report.ownerName}</h3>
                <p className="text-sm text-white/80">Marcando al {report.contactNumber}...</p>
              </div>

              <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white/20 shadow-2xl scale-110">
                <img
                  className="w-full h-full object-cover"
                  src={report.ownerAvatar || 'https://lh3.googleusercontent.com/aida-public/AB6AXuAGxtnF8_l_m4z3df-J-hvL4j-oGPdKQ0of7Pxef8efL8KlwoPXu5DRohpClHK9tGMkSirzJDDCF-6ek66p0N9NuRf-XaRrNk5ca0Gma7HAO3GSpjn3IEfRO9V_gDvI_8FtCrjiIYmds5VAWn4g2tSpvgRbqko70rmMp5GdF0ySUL-MV4g8JGs1QnVItzlcenKsa-nVr6ZDmznVXyupuxEmr22BKttsFSaOnJRqJyw7Ht09EbF96dTz'}
                  alt={report.ownerName}
                />
              </div>

              <div className="flex flex-col gap-4 items-center mb-12">
                <div className="text-xs text-white/60 font-semibold mb-2">Simulador de Voz Directa</div>
                <button
                  onClick={() => setIsCalling(false)}
                  className="w-16 h-16 bg-red-500 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-red-600 active:scale-90 transition-transform"
                  id="hang-up-btn"
                >
                  <X className="w-6 h-6" />
                </button>
                <span className="text-xs font-bold text-white/80">Colgar Llamada</span>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
