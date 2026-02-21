import heroBg from "../assets/hero-bg.png";
import { Link } from "react-router-dom";
function Home() {
  return (
    <div>

      {/* Hero Section */}
      <section
        className="text-white d-flex align-items-center"
        style={{
          minHeight: "70vh",
          backgroundImage: `linear-gradient(rgba(13,110,253,0.9), rgba(13,110,253,0.9)), url(${heroBg})`,
          backgroundSize: "cover",
          backgroundPosition: "center"
        }}
      >
        <div className="container text-center">
          <h1 className="fw-bold display-5">
            Welcome to MyFin Bank
          </h1>

          <p className="mt-3 fs-5">
            Secure. Reliable. Simple Banking Experience.
          </p>

          <div className="mt-4">
            <Link to="/login" className="btn btn-light btn-lg me-3">
              Login
            </Link>
            <Link to="/register" className="btn btn-outline-light btn-lg">
              Open an Account
            </Link>
          </div>

          <p className="mt-4 small">
            Trusted by customers for secure and reliable banking services.
          </p>
        </div>
      </section>

      {/* Info Section */}
<section className="py-5 bg-light">
  <div className="container">
    <div className="row text-center">

      <div className="col-md-4 mb-4">
        <div className="card h-100 shadow-sm border-0">
          <div className="card-body">
            <h5 className="card-title fw-semibold text-primary">
              Trusted Banking
            </h5>
            <p className="card-text text-muted mt-2">
              MyFin Bank follows industry-standard security practices to protect customer data.
            </p>
          </div>
        </div>
      </div>

      <div className="col-md-4 mb-4">
        <div className="card h-100 shadow-sm border-0">
          <div className="card-body">
            <h5 className="card-title fw-semibold text-primary">
              Easy Access
            </h5>
            <p className="card-text text-muted mt-2">
              Access your banking profile anytime through our secure online platform.
            </p>
          </div>
        </div>
      </div>

      <div className="col-md-4 mb-4">
        <div className="card h-100 shadow-sm border-0">
          <div className="card-body">
            <h5 className="card-title fw-semibold text-primary">
              Customer First
            </h5>
            <p className="card-text text-muted mt-2">
              Designed with clarity and simplicity, inspired by leading banks like SBI and Kotak.
            </p>
          </div>
        </div>
      </div>

    </div>
  </div>
</section>


    </div>
  );
}

export default Home;
