import { Link } from "react-router-dom";
import depositImg from "../assets/dashboard/deposit.png";
import transferImg from "../assets/dashboard/transfer.png";
import emiImg from "../assets/dashboard/emi.png";
import loanImg from "../assets/dashboard/loan.png";
import investImg from "../assets/dashboard/investment.png";
import chatImg from "../assets/dashboard/chat.png"


function UserDashboard() {
  return (
    <div className="dashboard-bg">
      <div className="container-fluid px-4">

        <h3 className="text-primary text-center mb-4">
          User Dashboard
        </h3>

        <div className="col-12 col-lg-10 mx-auto">

          {/* Deposit / Withdraw */}
          <Link to="/deposit" className="text-decoration-none">
            <div className="card dashboard-row-card shadow-sm">
              <div className="img-wrapper">
                <img src={depositImg} alt="Deposit Withdraw" />
                <div className="img-overlay"></div>
                <div className="overlay-text">
                  <h5>Deposit / Withdraw</h5>
                  <p>Manage your account balance</p>
                </div>
              </div>
            </div>
          </Link>

          {/* Fund Transfer */}
          <Link to="/transfer" className="text-decoration-none">
            <div className="card dashboard-row-card shadow-sm">
              <div className="img-wrapper">
                <img src={transferImg} alt="Fund Transfer" />
                <div className="img-overlay"></div>
                <div className="overlay-text">
                  <h5>Fund Transfer</h5>
                  <p>Send money securely</p>
                </div>
              </div>
            </div>
          </Link>

          {/* EMI Calculator */}
          <Link to="/emi" className="text-decoration-none">
            <div className="card dashboard-row-card shadow-sm">
              <div className="img-wrapper">
                <img src={emiImg} alt="EMI Calculator" />
                <div className="img-overlay"></div>
                <div className="overlay-text">
                  <h5>EMI Calculator</h5>
                  <p>Plan your loan repayments</p>
                </div>
              </div>
            </div>
          </Link>

          {/* Apply Loan */}
          <Link to="/apply-loan" className="text-decoration-none">
            <div className="card dashboard-row-card shadow-sm">
              <div className="img-wrapper">
                <img src={loanImg} alt="Apply Loan" />
                <div className="img-overlay"></div>
                <div className="overlay-text">
                  <h5>Apply Loan</h5>
                  <p>Quick & easy loan application</p>
                </div>
              </div>
            </div>
          </Link>

          {/* Investments */}
          <Link to="/investments" className="text-decoration-none">
            <div className="card dashboard-row-card shadow-sm">
              <div className="img-wrapper">
                <img src={investImg} alt="Investments" />
                <div className="img-overlay"></div>
                <div className="overlay-text">
                  <h5>Investments</h5>
                  <p>FD / RD options available</p>
                </div>
              </div>
            </div>
          </Link>

          {/* Chat with Bank */}
         <Link to="/chat" className="text-decoration-none">
             <div className="card dashboard-row-card shadow-sm">
                <div className="img-wrapper">
                  <img src={chatImg} alt="Chat Support" />
                  <div className="img-overlay"></div>
                  <div className="overlay-text">
                   <h5>Chat with Bank</h5>
                   <p>Talk to bank support instantly</p>
                 </div>
              </div>
          </div>
         </Link>


        </div>
      </div>
    </div>
  );
}

export default UserDashboard;





