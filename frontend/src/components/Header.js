import LoginModal from "./loginModal"
export default function Header() {

    return (
        <header>
            <LoginModal/>
            <img className="logo1" src="/logo1.svg" />
            <h1> Data Marketplace</h1>
        </header>
    )

}