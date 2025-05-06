import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeLanguageProvider } from './contexts/ThemeLanguageContext';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import { ReviewProvider } from './contexts/ReviewContext';
import { PetProvider } from './contexts/PetContext';
import { WishlistProvider } from './contexts/WishListContext';

import UnifiedHeaderNav from './components/UnifiedHeaderNav';
import Footer from './components/Footer';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Products from './pages/Product';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import AddPet from './pages/AddPet';
import PaymentPage from './pages/PaymentPage';
import RegisterPet from './pages/RegisterPet';
import PetProfile from './pages/PetProfile';
import NotFoundPage from './pages/NotFoundPage';
import ServiceDetailPage from './pages/ServiceDetailPage';
import GroomingSection from './pages/GroomingSection';
import TrainingSection from './pages/TrainingSection';
import DayCareSection from './pages/DayCareSection';
import VeterinarySection from './pages/VeterinarySection';
import Blog from './pages/Blog';
import Forums from './pages/Forums';
import AdoptionPage from './pages/AdoptionPage';
import WishlistPage from './pages/WishList';

function App() {
  return (
    <ThemeLanguageProvider>
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <ReviewProvider>
              <PetProvider>
                <Router>
                  <div>
                    <UnifiedHeaderNav />

                      <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/shop" element={<Products />} />
                        <Route path="/productdetails/:id"element={<ProductDetails />}/>
                        <Route path="/cart" element={<Cart />} />
                        <Route path="/AddPet" element={<AddPet />} />
                        <Route path="/PaymentPage" element={<PaymentPage />} />
                        <Route path="/RegisterPet" element={<RegisterPet />} />
                        <Route path="/PetProfile/:id" element={<PetProfile />} />
                        <Route path="/NotFoundPage" element={<NotFoundPage />} />
                        <Route path="/servicedetailpage" element={<ServiceDetailPage />} />
                        <Route path="/grooming" element={<GroomingSection />} />
                        <Route path="/training" element={<TrainingSection />} />
                        <Route path="/daycare" element={<DayCareSection />} />
                        <Route path="/veterinary" element={<VeterinarySection />} />
                        <Route path="/blog" element={<Blog />} />
                        <Route path="/forums" element={<Forums />} />
                        <Route path='/adoptionpage' element={<AdoptionPage/>} />
                        <Route path='/wishlistpage' element={<WishlistPage/>}></Route>
                      </Routes>

                    <div>
                      <Footer />
                    </div>
                  </div>
                </Router>
              </PetProvider>
            </ReviewProvider>
          </WishlistProvider>  
        </CartProvider>
      </AuthProvider>
    </ThemeLanguageProvider>
  );
}

export default App;