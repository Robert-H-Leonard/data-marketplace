
import { ConnectButton } from "@rainbow-me/rainbowkit"
export default function Header() {

    return (
        <header>
            <a href="/">
                <img className="logo1" src="/logo1.svg" />
                <h1> Data Marketplace</h1>
            </a>
            <div className="login_modal">
                <ConnectButton />
            </div>
        </header>
    )

}