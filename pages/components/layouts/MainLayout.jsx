import Navbar from "../share/Navbar";

export default function MainLayout({ children }) {
    return (
        <div className='flex flex-col min-h-screen'>
            <header>
                <Navbar />
            </header>
            <main className='flex-grow pb-12 bg-gray-50'>
                {children}
                {/* <BackToTop /> */}
            </main>
            <footer>
                {/* <Footer /> */}
            </footer>
        </div>
    );
}