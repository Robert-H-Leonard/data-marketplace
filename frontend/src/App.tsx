import React, { useEffect, useState } from 'react';
import Dashboard from './pages/Dashboard';
import Header from './components/Header'
import Footer from './components/Footer'
import JobRequestForm from './pages/JobRequestForm';
// @ts-ignore
import { Helmet } from 'react-helmet'
import JobInfo from './pages/JobInfo';
import { BrowserRouter, NavLink, Routes, Route } from 'react-router-dom';
import "@rainbow-me/rainbowkit/styles.css";
import { getDefaultWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { chain, configureChains, createClient, useAccount, useSigner, WagmiConfig } from "wagmi";
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc'
import { publicProvider } from "wagmi/providers/public";
import { JobRequestStore, IJobRequestStore, JobRequestDataWithBids } from './store/JobRequestStore';
import { ethers } from 'ethers';


function App() {
  const { data: signer } = useSigner();

  const jobRequestStore: IJobRequestStore = JobRequestStore.getInstance(false, signer ? signer as ethers.providers.JsonRpcSigner : undefined);

  const [jobRequests, setJobRequests] = useState<JobRequestDataWithBids[]>([]);
  const [dataSigner, setDataSigned] = useState<ethers.providers.JsonRpcSigner>();
  const [isLoading, setIsLoading] = useState(false);
  const [isInitLoad, setIsInitLoad] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      const fetchJobRequest = async () => {
        setIsLoading(true);
        const loadedRequest: JobRequestDataWithBids[] = []
        // Load request
        const jobRequest = await jobRequestStore.getJobRequests();
        
        // Load their bids
        for(const req of jobRequest) {
          const bids = await jobRequestStore.getBidsOnJobRequest(req.id!!)
          loadedRequest.push({ ...req, bids})
        }
  
  
        setJobRequests(loadedRequest);
  
        setDataSigned(signer as ethers.providers.JsonRpcSigner)
        setIsLoading(false);
      }
  
      if(jobRequestStore && !isLoading) {
        fetchJobRequest();
      }
    }, 8000);

    const fetchJobRequest = async () => {
      const loadedRequest: JobRequestDataWithBids[] = []
      // Load request
      const jobRequest = await jobRequestStore.getJobRequests();
      
      // Load their bids
      for(const req of jobRequest) {
        const bids = await jobRequestStore.getBidsOnJobRequest(req.id!!)
        loadedRequest.push({ ...req, bids })
      }


      setJobRequests(loadedRequest);
      setDataSigned(signer as ethers.providers.JsonRpcSigner)
      setIsLoading(false);
      setIsInitLoad(false);
    }

    if(jobRequestStore && isInitLoad) {
      fetchJobRequest();
      setIsLoading(false);
    }
  
    return () => clearInterval(interval);
  });

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
          <Route path="/" element={<Dashboard jobRequests={jobRequests} isLoading={isInitLoad}/>} />
          <Route path="/createJob" element={<JobRequestForm jobRequestStore={jobRequestStore as JobRequestStore}/>} />
          <Route path="/jobRequest/:id" element={<JobInfo jobRequestStore={jobRequestStore}/>} />
        </Routes>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

const WrappedApp = () => {
  const { chains, provider } = configureChains(
    [chain.goerli],
    [jsonRpcProvider({
      rpc: (chain) =>
      ({
        http: `https://nd-077-762-934.p2pify.com/c0498f945c72c9e9ecb6e3c68313eaba`
      }),
    })
    ]
  );

  const { connectors } = getDefaultWallets({
    appName: "My RainbowKit App",
    chains
  });

  const wagmiClient = createClient({
    autoConnect: true,
    connectors,
    provider
  });

  return(
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider chains={chains}>
        <App/>
      </RainbowKitProvider>
    </WagmiConfig>
  )
}

export default WrappedApp;
