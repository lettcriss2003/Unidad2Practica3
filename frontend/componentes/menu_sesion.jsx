import Link from "next/link";
export default function Menusesion() {
    return (
        <nav class="navbar bg-dark navbar-expand-lg bg-body-tertiary" data-bs-theme="white">
            <div class="container-fluid">

                <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                </button>
                <div class="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                        <li class="nav-item">
                            <Link href="/principal" className="navbar-brand">Principal</Link>

                        </li>
                        <li class="nav-item">
                            <Link href="/" className="navbar-brand">cerrar sesion</Link>
                        </li>

                    </ul>
                </div>
            </div>
        </nav>
    )
}

