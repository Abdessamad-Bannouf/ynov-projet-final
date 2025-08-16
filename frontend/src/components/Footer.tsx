export default function Footer() {
    return (
        <footer className="border-t bg-white mt-10">
            <div className="bg-gray-100 text-center py-4 text-sm text-gray-600 border-t">
                <p> © {new Date().getFullYear()} Mon App RH. Tous droits réservés.</p>
            </div>
        </footer>
    );
}
