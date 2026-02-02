import React from "react";
import { Link } from "wouter";
import { Mail, Phone, MapPin } from "lucide-react";
const Footer = () => {
  return (
    <footer className="bg-foreground text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                <span className="text-white text-xl font-bold">F</span>
              </div>
              <span className="text-xl font-bold">FreshMart</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Your neighborhood grocery store, now online. Fresh products
              delivered to your doorstep.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>
                <Link
                  href="/shop"
                  className="hover:text-primary transition-colors"
                >
                  Shop All
                </Link>
              </li>
              <li>
                <Link
                  href="/shop?isTodaysDeal=true"
                  className="hover:text-primary transition-colors"
                >
                  Today's Deals
                </Link>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-semibold mb-4">Categories</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>
                <Link
                  href="/shop?category=Atta%2C%20Rice%20%26%20Dal"
                  className="hover:text-primary transition-colors"
                >
                  Atta & Rice
                </Link>
              </li>
              <li>
                <Link
                  href="/shop?category=Masalas%20%26%20Spices"
                  className="hover:text-primary transition-colors"
                >
                  Spices
                </Link>
              </li>
              <li>
                <Link
                  href="/shop?category=Oil%20%26%20Ghee"
                  className="hover:text-primary transition-colors"
                >
                  Oil & Ghee
                </Link>
              </li>
              <li>
                <Link
                  href="/shop?category=Cleaning%20Essentials"
                  className="hover:text-primary transition-colors"
                >
                  Cleaning
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-3 text-gray-400 text-sm">
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <span>hello@freshmart.com</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <span>+1 (555) 123-4567</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-0.5" />
                <span>
                  123 Market Street
                  <br />
                  New York, NY 10001
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-10 pt-6 text-center text-gray-500 text-sm">
          <p>&copy; 2024 FreshMart. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
