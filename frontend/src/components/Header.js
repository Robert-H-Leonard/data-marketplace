
import { ConnectButton } from "@rainbow-me/rainbowkit"
export default function Header() {

    return (
        <header>
            <div className="login_modal">
                <ConnectButton />
            </div>
            <img className="logo1" src="/logo1.svg" />
            <h1> Data Marketplace</h1>
        </header>
    )

}