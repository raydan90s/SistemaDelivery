import { Button } from "@components/ui/button";
import { User, Menu } from "lucide-react";
import { Link } from "react-router-dom";
import { UtensilsCrossed } from "lucide-react";
import { CartSheet } from "./CartSheet";

export const Navbar = () => {
  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-sunset">
            <UtensilsCrossed className="h-6 w-6 text-white" />
          </div>
          <span className="text-xl font-bold bg-gradient-sunset bg-clip-text text-transparent">
            DeliciousExpress
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-6">
          <Link to="/menu" className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors">
            Menú
          </Link>
          <Link to="/about" className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors">
            Nosotros
          </Link>
          <Link to="/contact" className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors">
            Contacto
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <CartSheet />
          <Button variant="ghost" size="icon">
            <User className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </nav>
  );
};
