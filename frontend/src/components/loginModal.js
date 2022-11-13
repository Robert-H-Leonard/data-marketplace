import "@rainbow-me/rainbowkit/styles.css";
import { getDefaultWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { chain, configureChains, createClient, WagmiConfig } from "wagmi";
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc'
import { publicProvider } from "wagmi/providers/public";
import { ConnectButton } from "@rainbow-me/rainbowkit";


const { chains, provider } = configureChains(
    [chain.goerli],
    [jsonRpcProvider({
        rpc: (chain) =>
        ({
            http: `https://nd-077-762-934.p2pify.com/c0498f945c72c9e9ecb6e3c68313eaba`
        }),
    })
        , publicProvider()
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

export default function LoginModal() {
    return (
        <div className="login_modal">
            <WagmiConfig client={wagmiClient}>
                <RainbowKitProvider chains={chains}>
                    <ConnectButton />
                </RainbowKitProvider>
            </WagmiConfig>

        </div>
    );
}

