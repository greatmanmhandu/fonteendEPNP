import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import './App.css';
import Login from './pages/login/Login';
import Home from './pages/home/Home';

import MedicalIssues from './pages/categories/MedicalIssues';
import NewCategory from './pages/categories/new-category/NewCategory';
import EditCategory from './pages/categories/edit-category/EditCategory';

import Roles from './pages/roles/Roles';
import NewRole from './pages/roles/new-role/NewRole';
import EditRole from './pages/roles/edit-role/EditRole';

import Vaccination from './pages/pos/Vaccination';
import NewVaccin from './pages/pos/new-pos/NewVaccin';
import EditVaccin from './pages/pos/edit-pos/EditVaccin';

import ChildBirthRecords from './pages/unit-of-measure/ChildBirthRecords';
import NewChildBirthRecords from './pages/unit-of-measure/new-unit-of-measure/NewChildBirthRecords';
import EditChildBirthRecords from './pages/unit-of-measure/edit-unit-of-measure/EditChildBirthRecords';

import MedicalCenters from './pages/expense-category/MedicalCenters';
import NewMedicalCenters from './pages/expense-category/new-expense/NewMedicalCenters';
import EditMedicalCenters from './pages/expense-category/edit-expense/EditMedicalCenters';

import Units from './pages/units/Units';
import NewUnit from './pages/units/new-unit/NewUnit';
import EditUnit from './pages/units/edit-unit/EditUnit';

import PreTerm from './pages/expense/PreTerm';
import NewExpense from './pages/expense/new-expense/NewExpense';
import EditPreTerm from './pages/expense/edit-expense/EditPreTerm';

import Items from './pages/items/Items';
import NewItem from './pages/items/new-item/NewItem';
import EditItem from './pages/items/edit-item/EditItem';
import NewProduct from './pages/items/new-item/NewProduct';

import Providers from './pages/providers/Providers';
import NewProvider from './pages/providers/new-provider/NewProvider';
import EditProvider from './pages/providers/edit-provider/EditProvider';

import Purchases from './pages/purchases/Purchases';
import SelectProvider from './pages/purchases/new-purchase/SelectProvider';
import NewPurchase from './pages/purchases/new-purchase/NewPurchase';
import DetailPurchase from './pages/purchases/detail-purchase/DetailPurchase';

import Customers from './pages/customers/Customers';
import NewCustomer from './pages/customers/new-customer/NewCustomer';
import EditCustomer from './pages/customers/edit-customer/EditCustomer';

import Sales from './pages/sales/Sales';
import NewSale from './pages/sales/new-sale/NewSale';
import DetailSale from './pages/sales/detail-sale/DetailSale';

import Users from './pages/users/Users';
import NewUser from './pages/users/new-user/NewUser';
import EditUser from './pages/users/edit-user/EditUser';
import EditUserData from './pages/users/edit-user/editing-options/EditUserData';
import EditUserPassword from './pages/users/edit-user/editing-options/EditUserPassword';
import AddUserMenu from './pages/users/edit-user/editing-options/AddUserMenu';
import AddUserUnit from './pages/users/edit-user/editing-options/AddUserUnit';
import UserAndRole from './pages/users/edit-user/UserAndRole';
import ShopManagement from './pages/users/edit-user/ShopManagement';
import StockManagement from './pages/users/edit-user/StockManagement';
import InvetoryManagement from './pages/users/edit-user/InvetoryManagement';
import ProductManagement from './pages/users/edit-user/ProductManagement';
import ExpenseManagement from './pages/users/edit-user/ExpenseManagement';
import Products from './pages/items/Products';
import Sidebar from './components/sidebar/Sidebar';
import Navbar from './components/navbar/Navbar';
import ForgotLogin from './pages/login/forgot-login/ForgotLogin';
import AccessValidation from './pages/login/forgot-login/AccessValidation';
import CustomerManagement from './pages/users/edit-user/CustomerManagement';
import StockAdjustmentManagement from './pages/users/edit-user/StockAdjustmentManagement';
import ItemsFoAdjustment from './pages/items/ItemsFoAdjustment';
import OverrideProduct from './pages/items/new-item/OverrideProduct';
import AdditionProduct from './pages/items/new-item/AdditionProduct';
import UnitSelection from './pages/login/UnitSelection';
import ReductionProduct from './pages/items/new-item/ReductionProduct';

import NotFound from './pages/not-found/NotFound';

import userVerification from './utils/userVerification';

function App() {
    return (
        <Router>
            <div className="app-container">
                <Routes>
                    <Route path="/" element={<Navigate to="/login" replace />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/forgot-login" element={<ForgotLogin />} />
                    <Route path="/access-validation" element={<AccessValidation />} />
                    <Route path="/choose-unit/:id" element={
                        <UnitSelection />
                    } />
                    <Route path="/*" element={
                        <MainLayout />
                    } />
                </Routes>
            </div>
        </Router>
    );
}

const MainLayout = () => {
    const navigate = useNavigate();

    // Permission validation
    useEffect(() => {
        if (!userVerification().isAuthenticated) {
            localStorage.clear();
            navigate('/login');
        }
    }, [navigate]);

    return (
        <>
            <Sidebar />
            <Navbar />
            <div className="main-content">
                <Routes>
                    <Route path="/home" element={
                        <Home />
                    } />

                    {/* stock category*/}
                    <Route path="/medical-issues" element={
                        <MedicalIssues />
                    } />
                    <Route path="/new-category" element={
                        <NewCategory />
                    } />
                    <Route path="/edit-category/:id" element={
                        <EditCategory />
                    } />

                    {/* expense category */}
                    <Route path="/medical-centers" element={
                        <MedicalCenters />
                    } />
                    <Route path="/new-medical-centers" element={
                        <NewMedicalCenters />
                    } />
                    <Route path="/edit-medical-centers/:id" element={
                        <EditMedicalCenters />
                    } />

                    {/* expense list */}
                    <Route path="/pre-term-records" element={
                        <PreTerm />
                    } />
                    <Route path="/edit-pre-term-records/:id" element={
                        <EditPreTerm />
                    } />

                    {/* roles */}
                    <Route path="/role" element={
                        <Roles />
                    } />
                    <Route path="/new-role" element={
                        <NewRole />
                    } />
                    <Route path="/edit-role/:id" element={
                        <EditRole />
                    } />

                    {/* pos */}
                    <Route path="/vaccination" element={
                        <Vaccination />
                    } />
                    <Route path="/new-vaccin" element={
                        <NewVaccin />
                    } />
                    <Route path="/edit-vaccin/:id" element={
                        <EditVaccin />
                    } />


                    {/* unit of measure */}
                    <Route path="/child-birth-records" element={
                        <ChildBirthRecords />
                    } />
                    <Route path="/new-child-birth-records" element={
                        <NewChildBirthRecords />
                    } />
                    <Route path="/edit-child-birth-records/:id" element={
                        <EditChildBirthRecords />
                    } />

          
                 
                    <Route path="/users" element={
                        <Users />
                    } />
                    <Route path="/new-user" element={
                        <NewUser />
                    } />
                    <Route path="/edit-user/:id" element={
                        <EditUser />
                    } />
                    <Route path="/edit-user-data/:id" element={
                        <EditUserData />
                    } />
                    <Route path="/user-and-roles" element={
                        <UserAndRole />
                    } />
           
      
                    <Route path="/edit-user-pass/:id" element={
                        <EditUserPassword />
                    } />
                    <Route path="/add-user-menu/:id" element={
                        <AddUserMenu />
                    } />
                    <Route path="/add-user-unit/:id" element={
                        <AddUserUnit />
                    } />
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </div>
        </>
    );
}

export default App;
