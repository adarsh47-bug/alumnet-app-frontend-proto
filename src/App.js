// frontend/src/App.js
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import HomePage from './pages/HomePage';
import ConnectPage from './pages/ConnectPage';
import ForumPage from './pages/UniversityPage';
import EventsPage from './pages/EventsPage';
import CoursesPage from './pages/CoursesPage';
import JobsPage from './pages/JobsPage';
import ProfilePage from './pages/ProfilePage';
// import Header from './components/Header';
// import HeaderCopy from './components/HeaderCopy';
import Footer from './components/Footer';
import CombinedRoute from './components/CombinedRoute';
import { AuthProvider } from './context/authContext';
import Settings from './pages/Settings';
import './App.css';
import MyConnections from './connectPage/MyConnections'
import ConnectionReqReceived from './connectPage/ConnectionReqReceived';
import ConnectionReqSent from './connectPage/ConnectionReqSent';
import ViewProfilePage from './pages/ViewProfilePage';
import EventDetailsPage from './pages/EventDetailsPage';
import ScrollToTop from './components/ScrollToTop';
import IntroPage from './pages/IntroPage';

import CareerAssistanceAI from './aimodels/CareerAssistanceAI';
import LearnWithMeAI from './aimodels/LearnWithMeAI';
import Messenger from './pages/messenger/messenger';
import { Analytics } from "@vercel/analytics/react"

const App = () => {
  return (
    <AuthProvider>
      {/* <Header /> */}
      {/* <CombinedRoute element={HeaderCopy} isPrivate={false} />
      <CombinedRoute element={Header} isPrivate={true} /> */}
      <ScrollToTop />
      <div className="pt-16">
        <Routes>
          <Route path="/login" element={<CombinedRoute element={LoginPage} isPrivate={false} />} />
          <Route path="/logout" element={<CombinedRoute element={LoginPage} isPrivate={true} />} />
          <Route path="/register" element={<CombinedRoute element={RegisterPage} isPrivate={false} />} />

          <Route path="/home" element={<><CombinedRoute element={HomePage} isPrivate={true} /><Footer /></>} />
          <Route path="/connect" element={<><CombinedRoute element={ConnectPage} isPrivate={true} /><Footer /></>} />
          <Route path="/university" element={<><CombinedRoute element={ForumPage} isPrivate={true} /><Footer /></>} />
          <Route path="/events" element={<><CombinedRoute element={EventsPage} isPrivate={true} /><Footer /></>} />
          <Route path="/event-details/:title" element={<CombinedRoute element={EventDetailsPage} isPrivate={true} />} />
          <Route path="/resources" element={<><CombinedRoute element={CoursesPage} isPrivate={true} /><Footer /></>} />
          <Route path="/collaborations" element={<><CombinedRoute element={JobsPage} isPrivate={true} /><Footer /></>} />

          <Route path="/profile" element={<CombinedRoute element={ProfilePage} isPrivate={true} />} />
          <Route path="/settings" element={<CombinedRoute element={Settings} isPrivate={true} />} />
          <Route path="/myconnection" element={<CombinedRoute element={MyConnections} isPrivate={true} />} />
          <Route path="/reqr" element={<CombinedRoute element={ConnectionReqReceived} isPrivate={true} />} />
          <Route path="/reqs" element={<CombinedRoute element={ConnectionReqSent} isPrivate={true} />} />
          <Route path="/messenger" element={<CombinedRoute element={Messenger} isPrivate={true} />} />

          <Route path="/messenger/:userId" element={<CombinedRoute element={Messenger} isPrivate={true} />} />
          <Route path="/profile/:userId" element={<CombinedRoute element={ViewProfilePage} isPrivate={true} />} />
          <Route path="/" element={<><CombinedRoute element={IntroPage} isPrivate={false} /><Footer /></>} />
          <Route path="*" element={<h1>Not Found</h1>} />

          <Route path="/careerai" element={<CombinedRoute element={CareerAssistanceAI} isPrivate={true} />} />
          <Route path="/learnai" element={<CombinedRoute element={LearnWithMeAI} isPrivate={true} />} />


        </Routes>
      </div>
      <Analytics />
    </AuthProvider>
  );
};

export default App;
