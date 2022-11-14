
import { ConnectButton } from "@rainbow-me/rainbowkit"
import { Link } from "react-router-dom"
export default function Header() {

    return (
        <header>
            <div className="login_modal">
                <ConnectButton />
            </div>
            <img className="logo1" src="/logo1.svg" />
            <Link to="/" style={{ textDecoration: 'none' }}>
                <h1> Data Marketplace</h1>
            </Link>
        </header>
    )

}