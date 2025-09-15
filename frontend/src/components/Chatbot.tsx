import { useEffect, useState, useCallback } from 'react';

// Declare the chatbase types
declare global {
  interface Window {
    chatbase: ((...args: unknown[]) => void) & { q?: unknown[] };
  }
}

export const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);

  // Function to close the chat
  const closeChat = useCallback(() => {
    const chatWidget = document.querySelector('.chatbase-widget');
    const chatFrame = document.querySelector('.chatbase-widget iframe');
    if (chatWidget && chatFrame) {
      // Hide the chat widget
      (chatWidget as HTMLElement).style.display = 'none';
      // Reset the iframe src to close any open chat
      (chatFrame as HTMLIFrameElement).src = (chatFrame as HTMLIFrameElement).src;
      setIsOpen(false);
    }
  }, []);

  // Function to open the chat
  const openChat = useCallback(() => {
    const chatWidget = document.querySelector('.chatbase-widget');
    if (chatWidget) {
      (chatWidget as HTMLElement).style.display = 'block';
      setIsOpen(true);
    }
  }, []);

  useEffect(() => {
    // Initialize chatbase
    if (
      !window.chatbase ||
      ((window as unknown as { chatbase: (...args: unknown[]) => unknown }).chatbase("getState") !== "initialized")
    ) {
      window.chatbase = function(...args: unknown[]) {
        if (!window.chatbase.q) {
          window.chatbase.q = [];
        }
        window.chatbase.q.push(args);
      };
      window.chatbase = new Proxy(window.chatbase, {
        get(target, prop) {
          if (prop === "q") {
            return target.q;
          }
          const callable = target as (...a: unknown[]) => unknown;
          return (...args: unknown[]) => callable(prop, ...args);
        }
      });
    }

    // Load the chatbase script
    const script = document.createElement("script");
    script.src = "https://www.chatbase.co/embed.min.js";
    script.id = "79sumrFZtvSZ6S7NMrBjM";
    (script as unknown as { domain: string }).domain = "www.chatbase.co";
    document.body.appendChild(script);

    // Handle chat widget clicks
    const handleChatClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      
      // If clicking the chat icon
      if (target.closest('.chatbase-widget-button')) {
        if (isOpen) {
          closeChat();
        } else {
          openChat();
        }
      }
    };

    // Handle clicks outside the chat
    const handleOutsideClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const chatWidget = document.querySelector('.chatbase-widget');
      
      if (isOpen && chatWidget && !chatWidget.contains(target)) {
        closeChat();
      }
    };

    // Handle escape key press
    const handleEscapeKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        closeChat();
      }
    };

    // Wait for the chat widget to be loaded
    const checkForWidget = setInterval(() => {
      const chatWidget = document.querySelector('.chatbase-widget');
      if (chatWidget) {
        chatWidget.addEventListener('click', handleChatClick);
        document.addEventListener('click', handleOutsideClick);
        document.addEventListener('keydown', handleEscapeKey);
        clearInterval(checkForWidget);
      }
    }, 1000);

    // Cleanup function
    return () => {
      const scriptElement = document.getElementById("79sumrFZtvSZ6S7NMrBjM");
      if (scriptElement) {
        scriptElement.remove();
      }
      const chatWidget = document.querySelector('.chatbase-widget');
      if (chatWidget) {
        chatWidget.removeEventListener('click', handleChatClick);
      }
      document.removeEventListener('click', handleOutsideClick);
      document.removeEventListener('keydown', handleEscapeKey);
      clearInterval(checkForWidget);
    };
  }, [isOpen, closeChat, openChat]); // Add dependencies

  return null; // This component doesn't render anything
}; 