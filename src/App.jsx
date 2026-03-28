import React, { useEffect, Component } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { AdminRoute } from './components/admin/AdminRoute.jsx'
import AdminAddProduct from './pages/admin/AdminAddProduct.jsx'
import AdminCoupons from './pages/admin/AdminCoupons.jsx'
import AdminCustomers from './pages/admin/AdminCustomers.jsx'
import AdminDashboard from './pages/admin/AdminDashboard.jsx'
import AdminEditProduct from './pages/admin/AdminEditProduct.jsx'
import AdminLogin from './pages/admin/AdminLogin.jsx'
import AdminOrderDetail from './pages/admin/AdminOrderDetail.jsx'
import AdminOrders from './pages/admin/AdminOrders.jsx'
import AdminPayments from './pages/admin/AdminPayments.jsx'
import AdminProducts from './pages/admin/AdminProducts.jsx'
import AdminSettings from './pages/admin/AdminSettings.jsx'
import About from './pages/customer/About.jsx'
import Bulk from './pages/customer/Bulk.jsx'
import Cart from './pages/customer/Cart.jsx'
import CategoryPage from './pages/customer/CategoryPage.jsx'
import Checkout from './pages/customer/Checkout.jsx'
import Contact from './pages/customer/Contact.jsx'
import CustomPoster from './pages/customer/CustomPoster.jsx'
import Home from './pages/customer/Home.jsx'
import OrderSuccess from './pages/customer/OrderSuccess.jsx'
import Product from './pages/customer/Product.jsx'
import Shop from './pages/customer/Shop.jsx'
import Wishlist from './pages/customer/Wishlist.jsx'
import { prefetchSiteConfig } from './lib/siteSettings.js'
import './lib/seed.js'

class SiteErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { recoverKey: 0 }
  }

  static getDerivedStateFromError() {
    return { hadError: true }
  }

  componentDidCatch() {
    this.setState((s) => ({ recoverKey: s.recoverKey + 1, hadError: false }))
  }

  render() {
    return (
      <React.Fragment key={this.state.recoverKey}>
        {this.props.children}
      </React.Fragment>
    )
  }
}

export default function App() {
  useEffect(() => {
    prefetchSiteConfig()
  }, [])

  return (
    <SiteErrorBoundary>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/shop" element={<Shop />} />
      <Route path="/category/:slug" element={<CategoryPage />} />
      <Route path="/product/:id" element={<Product />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/checkout" element={<Checkout />} />
      <Route path="/order-success" element={<OrderSuccess />} />
      <Route path="/wishlist" element={<Wishlist />} />
      <Route path="/custom-poster" element={<CustomPoster />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/bulk" element={<Bulk />} />

      <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route
        path="/admin/dashboard"
        element={
          <AdminRoute>
            <AdminDashboard />
          </AdminRoute>
        }
      />
      <Route
        path="/admin/products"
        element={
          <AdminRoute>
            <AdminProducts />
          </AdminRoute>
        }
      />
      <Route
        path="/admin/products/add"
        element={
          <AdminRoute>
            <AdminAddProduct />
          </AdminRoute>
        }
      />
      <Route
        path="/admin/products/edit/:id"
        element={
          <AdminRoute>
            <AdminEditProduct />
          </AdminRoute>
        }
      />
      <Route
        path="/admin/orders"
        element={
          <AdminRoute>
            <AdminOrders />
          </AdminRoute>
        }
      />
      <Route
        path="/admin/orders/:id"
        element={
          <AdminRoute>
            <AdminOrderDetail />
          </AdminRoute>
        }
      />
      <Route
        path="/admin/customers"
        element={
          <AdminRoute>
            <AdminCustomers />
          </AdminRoute>
        }
      />
      <Route
        path="/admin/payments"
        element={
          <AdminRoute>
            <AdminPayments />
          </AdminRoute>
        }
      />
      <Route
        path="/admin/coupons"
        element={
          <AdminRoute>
            <AdminCoupons />
          </AdminRoute>
        }
      />
      <Route
        path="/admin/settings"
        element={
          <AdminRoute>
            <AdminSettings />
          </AdminRoute>
        }
      />
      <Route
        path="/admin/*"
        element={
          <AdminRoute>
            <Navigate to="/admin/dashboard" replace />
          </AdminRoute>
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
    </SiteErrorBoundary>
  )
}
