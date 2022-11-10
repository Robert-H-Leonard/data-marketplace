import React from 'react';
import Dashboard from './pages/Dashboard';
import Header from './components/Header'
import Footer from './components/Footer'
import JobRequestForm from './pages/JobRequestForm';
// @ts-ignore
import { Helmet } from 'react-helmet'
import JobInfo from './pages/JobInfo';
import { BrowserRouter, NavLink, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Helmet>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
          <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@700&display=swap" rel="stylesheet" />
          <link href="https://fonts.googleapis.com/css2?family=Roboto+Mono:ital,wght@0,100;0,200;0,400;1,300&display=swap" rel="stylesheet"></link>
          <link href="https://fonts.googleapis.com/css2?family=Roboto+Mono:wght@100&display=swap" rel="stylesheet" />
          <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400&display=swap" rel="stylesheet"></link>
        </Helmet>
        <Header />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="createJob" element={<JobRequestForm />} />
          <Route path="jobId" element={<JobInfo />} />
        </Routes>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
