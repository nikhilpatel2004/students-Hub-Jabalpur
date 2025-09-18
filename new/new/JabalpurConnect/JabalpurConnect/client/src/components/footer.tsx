import { Link } from "wouter";
import { GraduationCap } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-foreground text-background py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center mb-4">
              <GraduationCap className="text-2xl text-primary mr-2 w-8 h-8" />
              <span className="text-xl font-bold">Student Hub Jabalpur</span>
            </div>
            <p className="text-background/70 mb-4">
              Your trusted platform for finding the perfect accommodation and tiffin services in Jabalpur.
            </p>
            <div className="flex space-x-4">
              <a 
                href="#" 
                className="text-background/70 hover:text-primary transition-colors"
                data-testid="social-facebook"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a 
                href="#" 
                className="text-background/70 hover:text-primary transition-colors"
                data-testid="social-instagram"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987 6.62 0 11.987-5.367 11.987-11.987C24.014 5.367 18.637.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.49-3.326-1.297-.878-.807-1.297-1.958-1.297-3.255 0-1.297.419-2.448 1.297-3.326.878-.878 2.029-1.297 3.326-1.297 1.297 0 2.448.419 3.255 1.297.878.878 1.297 2.029 1.297 3.326 0 1.297-.419 2.448-1.297 3.255-.807.807-1.958 1.297-3.255 1.297z"/>
                </svg>
              </a>
              <a 
                href="#" 
                className="text-background/70 hover:text-primary transition-colors"
                data-testid="social-twitter"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
              </a>
              <a 
                href="#" 
                className="text-background/70 hover:text-primary transition-colors"
                data-testid="social-linkedin"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
            </div>
          </div>
          
          {/* For Students */}
          <div>
            <h3 className="font-semibold mb-4">For Students</h3>
            <ul className="space-y-2 text-background/70">
              <li>
                <Link href="/rooms" className="hover:text-primary transition-colors" data-testid="footer-find-rooms">
                  Find Rooms
                </Link>
              </li>
              <li>
                <Link href="/tiffin" className="hover:text-primary transition-colors" data-testid="footer-find-tiffin">
                  Find Tiffin Services
                </Link>
              </li>
              <li>
                <Link href="/#post-requirement" className="hover:text-primary transition-colors" data-testid="footer-post-requirements">
                  Post Requirements
                </Link>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors" data-testid="footer-student-guide">
                  Student Guide
                </a>
              </li>
            </ul>
          </div>
          
          {/* For Providers */}
          <div>
            <h3 className="font-semibold mb-4">For Providers</h3>
            <ul className="space-y-2 text-background/70">
              <li>
                <a href="#" className="hover:text-primary transition-colors" data-testid="footer-list-property">
                  List Your Property
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors" data-testid="footer-tiffin-registration">
                  Tiffin Service Registration
                </a>
              </li>
              <li>
                <Link href="/profile" className="hover:text-primary transition-colors" data-testid="footer-dashboard">
                  Dashboard
                </Link>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors" data-testid="footer-success-stories">
                  Success Stories
                </a>
              </li>
            </ul>
          </div>
          
          {/* Support */}
          <div>
            <h3 className="font-semibold mb-4">Support</h3>
            <ul className="space-y-2 text-background/70">
              <li>
                <a href="#" className="hover:text-primary transition-colors" data-testid="footer-help-center">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors" data-testid="footer-contact">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors" data-testid="footer-privacy">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors" data-testid="footer-terms">
                  Terms of Service
                </a>
              </li>
            </ul>
            <div className="mt-6">
              <p className="text-sm text-background/70">Contact:</p>
              <p className="text-sm">+91 98765 43210</p>
              <p className="text-sm">hello@studenthubjabalpur.com</p>
            </div>
          </div>
        </div>
        
        <div className="border-t border-background/20 mt-8 pt-8 text-center text-background/70">
          <p>&copy; 2024 Student Hub Jabalpur. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
